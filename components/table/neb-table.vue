<script setup lang="ts" generic="T extends Record<string, any>">
import type { NebSaveRestoreProps } from '../../composables/neb-save-restore'
import type { Columns, Emits, FormattedRow, Props, Slots } from './neb-table-frame.vue'
import dayjs from 'dayjs'
import Fuse from 'fuse.js'

type TableProps = Omit<Props<T>, 'rows'> & {
  rows: T[] | null
}
const props = defineProps<NebSaveRestoreProps & TableProps>()

defineEmits<Emits<T>>()

const slots = defineSlots<Slots<T> & {
  'actions'?: () => any
  'footer-start'?: () => any
  'footer-end'?: () => any
}>()

const modelValue = defineModel<null | T[]>({
  required: false,
  default: null,
})

const searchTerm = ref('')
const computedColumns = computed(() => {
  const columns: Columns<T> = {}

  if (searchTerm.value)
    // @ts-expect-error searchScore is added by the table
    columns.searchScore = { text: 'Score' }

  for (const key in props.columns)
    columns[key] = props.columns[key]

  return columns
})

const formattedRows = computed<FormattedRow<T>[]>(() => {
  if (props.status === 'pending' || !props.rows)
    return []

  return props.rows.map((row) => {
    const formattedRow: Partial<FormattedRow<T>['formatted']> = {}

    for (const column in computedColumns.value)
      formattedRow[column] = formatCell(row, column)

    return {
      formatted: formattedRow as FormattedRow<T>['formatted'],
      original: row,
    }
  })
})

function formatCell(row: T, key: keyof T): string {
  if (computedColumns.value[key]!.formatFunction)
    return computedColumns.value[key]!.formatFunction(row[key])

  const maybeDate = createDateIfPossible(row[key])
  if (maybeDate)
    return dayjs(maybeDate).format('YYYY-MM-DD')

  if (row[key] === undefined || row[key] === null)
    return ''

  return row[key].toString()
}

const searcher = computed(() => {
  if (props.status === 'pending')
    return null

  return new Fuse(formattedRows.value, {
    includeScore: true,
    keys: Object.keys(computedColumns.value).map(key => `formatted.${key}`),
  })
})
const searchedRows = computed<FormattedRow<T>[]>(() => {
  if (props.status === 'pending' || !searcher.value || !searchTerm.value.length)
    return formattedRows.value

  const result = searcher.value.search(searchTerm.value)
  return result.map(r => ({
    formatted: { ...r.item.formatted, searchScore: `${Math.round((1 - r.score!) * 100)}%` },
    original: { ...r.item.original, searchScore: r.score },
  }))
})

const page = defineModel<number>('page', {
  required: false,
  default: 0,
})
const sortColumn = defineModel<keyof T | null>('sortColumn', {
  required: false,
  default: null,
})
const sortDirection = defineModel<'asc' | 'desc'>('sortDirection', {
  required: false,
  default: 'asc',
})
const itemsPerPage = defineModel<number>('itemsPerPage', {
  required: false,
})

const sortColumnBeforeSearch = ref<null | keyof T>(null)
const sortDirectionBeforeSearch = ref<'asc' | 'desc'>('asc')
watch(searchTerm, (_, oldVal) => {
  if (searchTerm.value) {
    if (!oldVal) {
      sortColumnBeforeSearch.value = sortColumn.value
      sortDirectionBeforeSearch.value = sortDirection.value
    }

    sortColumn.value = 'searchScore'
    sortDirection.value = 'asc'
    page.value = 0
  }
  else if (sortColumn.value === 'searchScore') {
    sortColumn.value = sortColumnBeforeSearch.value
    sortDirection.value = sortDirectionBeforeSearch.value
  }
}, {
  flush: 'sync',
})

const sortedRows = computed(() => {
  if (props.status === 'pending')
    return []

  if (!sortColumn.value)
    return searchedRows.value

  const sortFunction = getSortFunction(sortColumn.value)

  return [...searchedRows.value || []].sort((a, b) => {
    const [first, second] = sortDirection.value === 'asc' ? [a, b] : [b, a]

    if (first.original[sortColumn.value!] === undefined || first.original[sortColumn.value!] === null)
      return -1
    if (second.original[sortColumn.value!] === undefined || second.original[sortColumn.value!] === null)
      return 1

    return sortFunction(first, second)
  })
})
function getSortFunction(key: keyof T): (a: FormattedRow<T>, b: FormattedRow<T>) => number {
  if (computedColumns.value[key]!.sortFunction)
    return computedColumns.value[key]!.sortFunction

  const data = searchedRows.value.find(row => row.original[key])

  if (!data)
    return () => 1

  if (typeof data.original[key] === 'number')
    return (a, b) => a.original[key] - b.original[key]

  const maybeDate = createDateIfPossible(data.original[key])
  if (maybeDate)
    return (a, b) => new Date(a.original[key]).getTime() - new Date(b.original[key]).getTime()

  return (a, b) => a.formatted[key].localeCompare(b.formatted[key])
}

const paginationResult = ref<FormattedRow<T>[]>([]) as Ref<FormattedRow<T>[]>

const tableSlots = computed<Slots<T>>(() => {
  const tableSlots = {} as Slots<T>

  const simpleSlots = ['header', 'loading-state', 'empty-state', 'error-state', 'row-actions', 'last-column', 'footer']
  for (const key in slots) {
    if (key.startsWith('th-') || key.startsWith('td-') || simpleSlots.includes(key))
      // @ts-expect-error - type magic is too strong in this one
      tableSlots[key] = slots[key]
  }

  return tableSlots
})

useNebSaveRestore('neb-table', props, {
  searchTerm, // order of the keys is important because of the 'sync' flushed watcher
  sortColumn,
  sortDirection,
}, {
  sortColumn: column => !!column && !!props.columns[column],
})
</script>

<template>
  <neb-table-frame
    v-model="modelValue"
    v-model:sort-direction="sortDirection"
    v-model:sort-column="sortColumn"
    :rows="paginationResult"
    :columns="computedColumns"
    :status="props.status"
    :refresh="props.refresh"
    v-bind="$attrs"
    @click="($event) => $emit('click', $event)"
  >
    <template #header>
      <div class="header">
        <neb-search-input v-model="searchTerm" lazy class="search-input" />

        <slot name="actions" />
      </div>
    </template>

    <template v-for="(_, slot) of tableSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>

    <template #footer>
      <slot name="footer-start" />
      <neb-pagination
        v-model="paginationResult"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :data="sortedRows"
        :enable-save-restore="props.enableSaveRestore"
        :save-key="props.saveKey"
        :status="props.status"
      />
      <slot name="footer-end" />
    </template>
  </neb-table-frame>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}
.search-input {
  flex: 1;
  min-width: 200px;
  max-width: 500px;
}
</style>
