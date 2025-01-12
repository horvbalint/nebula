<script setup lang="ts" generic="T extends Record<string, any>">
import type { Columns, FormattedRow, Props } from './neb-table-frame.vue'
import dayjs from 'dayjs'
import Fuse from 'fuse.js'

type TableProps = Omit<Props<T>, 'rows'> & {
  rows: T[] | null
}
const props = defineProps<TableProps>()

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
  if (props.loading || !props.rows)
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
  if (props.loading)
    return null

  return new Fuse(formattedRows.value, {
    includeScore: true,
    keys: Object.keys(computedColumns.value).map(key => `formatted.${key}`),
  })
})
const searchedRows = computed<FormattedRow<T>[]>(() => {
  if (props.loading || !searcher.value || !searchTerm.value.length)
    return formattedRows.value

  const result = searcher.value.search(searchTerm.value)
  return result.map(r => ({
    formatted: { ...r.item.formatted, searchScore: r.score },
    original: { ...r.item.original, searchScore: r.score },
  }))
})

const sortColumn = ref<keyof T | null>(null) as Ref<keyof T | null>
const sortAsc = ref(true)

watch(searchTerm, () => {
  if (searchTerm.value) {
    sortColumn.value = 'searchScore'
    sortAsc.value = false
  }
  else if (sortColumn.value === 'searchScore') {
    sortColumn.value = null
    sortAsc.value = true
  }
})

const sortedRows = computed(() => {
  if (props.loading)
    return []

  if (!sortColumn.value)
    return searchedRows.value

  const sortFunction = getSortFunction(sortColumn.value)

  return [...searchedRows.value || []].sort((a, b) => {
    const first = sortAsc.value ? a : b
    const second = sortAsc.value ? b : a

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

// const computedBinds = computed(() => {
//   const binds: any = { ...props, ...useAttrs() }
//   delete binds.rows
//   delete binds.columns

//   return binds
// })

const tableSlots = computed(() => {
  const slots = useSlots()

  const tableSlots: Record<string, any> = {}
  for (const key in slots) {
    if (key.startsWith('th-') || key.startsWith('td-') || ['td', 'row-actions', 'last-column'].includes(key))
      tableSlots[key] = slots[key]
  }

  return tableSlots
})
</script>

<template>
  <neb-table-frame
    v-model="modelValue"
    v-model:sort-asc="sortAsc"
    v-model:sort-column="sortColumn"
    :rows="paginationResult"
    :columns="computedColumns"
    v-bind="$attrs"
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
      <neb-pagination v-model="paginationResult" :data="sortedRows" />
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
