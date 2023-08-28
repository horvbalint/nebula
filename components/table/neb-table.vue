<script setup lang="ts" generic="T extends Record<string, any>">
import dayjs from 'dayjs'

interface Column {
  text: string
  key: string
  sortFunction?: (a: any, b: any) => number
  formatFunction?: (cell: any) => string
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  columns: Column[]
  rows: T[]
  loading?: boolean
  error?: boolean
}>(), {
  loading: false,
  error: false,
})

defineEmits<{
  'click': [row: T]
}>()

const modelValue = defineModel<null | T[]>({
  required: false,
  default: null,
})

interface FormattedRow {
  formatted: Record<string, string>
  original: T
}

const paginationResult = ref<FormattedRow[]>([])
const formattedRows = computed<FormattedRow[]>(() => {
  return props.rows.map((row: T) => {
    const formattedRow: Record<string, any> = {}

    for (const column of props.columns)
      formattedRow[column.key] = formatCell(row, column)

    return {
      formatted: formattedRow,
      original: row,
    }
  })
})

function formatCell(row: T, column: Column) {
  if (column.formatFunction)
    return column.formatFunction(row[column.key])

  const maybeDate = createDateIfPossible(row[column.key])
  if (maybeDate)
    return dayjs(maybeDate).format('YYYY.MM.DD')

  return row[column.key]
}

const sortColumn = ref<Column | null>(null)
const sortAsc = ref(true)

const sortedRows = computed(() => {
  if (!sortColumn.value)
    return formattedRows.value

  const sortFunction = getSortFunction(sortColumn.value)

  return [...formattedRows.value].sort((a, b) => {
    const first = sortAsc.value ? b.original[sortColumn.value!.key] : a.original[sortColumn.value!.key]
    const second = sortAsc.value ? a.original[sortColumn.value!.key] : b.original[sortColumn.value!.key]

    if (!first)
      return -1
    if (!second)
      return 1

    return sortFunction(first, second)
  })
})

function getSortFunction(column: Column): (a: any, b: any) => number {
  if (column.sortFunction)
    return column.sortFunction

  const data = props.rows.find(row => row[column.key])

  if (!data)
    return () => 1

  if (typeof data[column.key] === 'number')
    return (a: number, b: number) => a - b

  const maybeDate = createDateIfPossible(data[column.key])
  if (maybeDate)
    return (a: Date | string, b: Date | string) => new Date(a).getTime() - new Date(b).getTime()

  return (a: string, b: string) => a.localeCompare(b)
}

const sortIcon = computed(() => {
  if (sortAsc.value)
    return 'material-symbols:arrow-downward-alt'
  else
    return 'material-symbols:arrow-upward-alt'
})

function sortByColumn(column: Column) {
  if (column.key === sortColumn.value?.key)
    sortAsc.value = !sortAsc.value
  else
    sortColumn.value = column
}

function createDateIfPossible(value: any) {
  if (value instanceof Date)
    return value

  const maybeDate = new Date(value)

  if (Number.isNaN(maybeDate.getTime()))
    return null

  if (maybeDate.toISOString() === value)
    return maybeDate

  return null
}

const isAnyChecked = computed({
  get() {
    if (!modelValue.value)
      return false

    return !!modelValue.value.length
  },
  set(value: boolean) {
    if (value)
      modelValue.value = [...props.rows]
    else
      modelValue.value = []
  },
})
</script>

<template>
  <div class="neb-table">
    <header v-if="$slots.header" class="header-slot">
      <slot name="header" />
    </header>

    <div class="neb-table-wrapper" :class="{ 'no-header': !$slots.header }">
      <slot v-if="loading" name="error-state">
        <neb-loading-state />
      </slot>

      <slot v-else-if="error" name="error-state">
        <neb-error-state
          title="Hiba a lekérés közben!"
          description="Nem sikerült lekérni a táblázat adatait. Kérjük próbálja újra késöbb!"
        />
      </slot>

      <slot v-else-if="!rows.length" name="empty-state">
        <neb-empty-state
          title="Nincsenek rendelkezésre álló adatok!"
          description="Jelenleg nem áll rendelkezésre megjeleníthető adat ebben a táblázatban."
        />
      </slot>

      <table v-else>
        <thead>
          <tr>
            <th v-if="modelValue" class="checkbox-cell">
              <neb-checkbox v-model="isAnyChecked" icon="material-symbols:remove-rounded" />
            </th>

            <th v-for="column in columns" :key="`th-${column.key}`" @click="sortByColumn(column)">
              <slot :name="`th-${column.key}`" :column="column">
                {{ column.text }}
              </slot>

              <icon v-if="column.key === sortColumn?.key" :name="sortIcon" />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, index) in paginationResult" :key="index" @click="$emit('click', row.original)">
            <td v-if="modelValue" class="checkbox-cell">
              <neb-checkbox v-model="modelValue" :value="row.original" />
            </td>

            <td v-for="column in columns" :key="`td-${column.key}`">
              <slot :name="`td-${column.key}`" :original="row.original[column.key]" :formatted="row.formatted[column.key]" :column="column">
                {{ row.formatted[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer>
      <slot name="footer-start" />
      <neb-pagination v-model="paginationResult" :data="sortedRows" />
      <slot name="footer-end" />
    </footer>
  </div>
</template>

<style scoped>
.neb-table {
  background: var(--white-color);
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}
.header-slot {
  border-radius: var(--radius-default) var(--radius-default) 0 0;
  border-bottom: 1px solid var(--neutral-color-200);
}
footer {
  border-radius: 0 0 var(--radius-default) var(--radius-default);
  border-top: 1px solid var(--neutral-color-200);
}
.header-slot, footer {
  padding: var(--space-4) var(--space-6);

  & h2 {
    font-size: var(--text-lg);
    font-weight: 600;
  }
}
.neb-table-wrapper {
  position: relative;
  flex: 1;
  overflow: auto;

  &.no-header {
    border-top-left-radius: var(--radius-default);
    border-top-right-radius: var(--radius-default);
  }
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
  height: 44px;
  box-shadow: 0 1px 0 0 var(--neutral-color-200);
  background: var(--neutral-color-50);
}
th {
  flex: 1;
  padding: var(--space-3) var(--space-6);
  text-align: left;
  color: var(--neutral-color-600);
  font-size: var(--text-xs);
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  line-height: 22px;

  .icon {
    margin-left: var(--space-1);
    width: 18px;
    height: 18px;
  }
}
tbody {
  tr {
    border-bottom: 1px solid var(--neutral-color-200);

    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background: var(--primary-color-50);
    }
  }

  td {
    padding: 20px var(--space-6);
    font-size: var(--text-sm);
    font-weight: 400;
    color: var(--neutral-color-600);
    text-align: left;
    white-space: nowrap;
  }
}
.checkbox-cell {
  width: 0;
  padding: var(--space-3) var(--space-1) var(--space-3) var(--space-6);
}
.dark-mode {
  .neb-table {
    background: var(--neutral-color-975);
    border: 1px solid var(--neutral-color-700);
  }
  .header-slot {
    border-bottom: 1px solid var(--neutral-color-700);
  }
  footer {
    border-top: 1px solid var(--neutral-color-700);
  }
  thead {
    box-shadow: 0 1px 0 0 var(--neutral-color-700);
    background: var(--neutral-color-900);
  }
  th {
    color: var(--neutral-color-300);
  }
  tbody {
    tr {
      border-bottom: 1px solid var(--neutral-color-700);

      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background: var(--primary-color-975);
      }
    }

    td {
      color: var(--neutral-color-300);
    }
  }
}
</style>
