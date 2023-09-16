<script setup lang="ts" generic="T extends Record<string, any>">
import dayjs from 'dayjs'

export interface Column {
  text: string
  key: string
  sortFunction?: (a: any, b: any) => number
  formatFunction?: (cell: any) => string
}

export interface Props<T> {
  columns: Column[]
  rows: T[]
  sortColumn: Column | null
  sortAsc: boolean
  loading?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props<T>>(), {
  loading: false,
  error: false,
})

const emit = defineEmits<{
  'click': [row: T]
  'update:sortAsc': [sortAsc: typeof props.sortAsc]
  'update:sortColumn': [sortColumn: typeof props.sortColumn]
}>()

const modelValue = defineModel<null | T[]>({
  required: false,
  default: null,
})

interface FormattedRow {
  formatted: Record<string, string>
  original: T
}

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

const sortIcon = computed(() => {
  if (props.sortAsc)
    return 'material-symbols:arrow-upward-alt'
  else
    return 'material-symbols:arrow-downward-alt'
})

function handleHeaderClick(column: Column) {
  if (column.key === props.sortColumn?.key)
    emit('update:sortAsc', !props.sortAsc)
  else
    emit('update:sortColumn', column)
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
      <slot v-if="loading" name="loading-state">
        <neb-loading-state />
      </slot>

      <slot v-else-if="error" name="error-state">
        <neb-error-state
          title="Hiba a lekérés közben!"
          description="Nem sikerült lekérni a táblázat adatait. Kérjük próbálja újra késöbb!"
        />
      </slot>

      <slot v-else-if="!formattedRows.length" name="empty-state">
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

            <th v-for="column in columns" :key="`th-${column.key}`" @click="handleHeaderClick(column)">
              <div class="th-slot-wrapper">
                <slot :name="`th-${column.key}`" :column="column">
                  {{ column.text }}
                </slot>
              </div>

              <icon v-if="column.key === sortColumn?.key" :name="sortIcon" />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, index) in formattedRows" :key="index" @click="$emit('click', row.original)">
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
      <slot name="footer" />
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

  .th-slot-wrapper {
    display: inline-block;
  }

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
    padding: var(--space-3) var(--space-6);
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
