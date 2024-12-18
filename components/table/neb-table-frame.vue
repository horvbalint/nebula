<script setup lang="ts" generic="T extends Record<string, any>">
import type { RestoreProps } from '@nebula/composables/neb-restore'

export interface Column<T, Key extends keyof T = keyof T> {
  text: string
  sortFunction?: (a: any, b: any) => number
  formatFunction?: (value: T[Key]) => string
}

export type Columns<T> = Partial<{
  [K in keyof T]: Column<T, K>
}>

export interface RestoreState<T> {
  sortColumn: keyof T | null
  sortAsc: boolean
}

export interface FormattedRow<T> {
  formatted: Record<keyof T, string>
  original: T
}

export type Props<T> = {
  columns: Columns<T>
  rows: FormattedRow<T>[] | null
  loading?: boolean
  error?: boolean
} & RestoreProps<RestoreState<T>>

const props = withDefaults(defineProps<Props<T>>(), {
  loading: false,
  error: false,
  restore: false,
})

const emit = defineEmits<{
  click: [row: T]
}>()

// useNebLoading(props, () => {
// useNebRestore<RestoreState>({
//   props,
//   store: () => ({
//     sortColumn: props.sortColumn,
//     sortAsc: sortAsc.value,
//   }),
//   restore: (state) => {
//     emit('update:sortColumn', state.sortColumn)
//     emit('update:sortAsc', state.sortAsc)
//   },
// })
// })

const modelValue = defineModel<null | T[]>({
  required: false,
  default: null,
})
const sortColumn = defineModel<keyof T | null>('sortColumn', {
  required: false,
  default: null,
})
const sortAsc = defineModel('sortAsc', {
  required: false,
  default: true,
})

const sortIcon = computed(() => {
  if (sortAsc.value)
    return 'material-symbols:arrow-upward-alt'
  else
    return 'material-symbols:arrow-downward-alt'
})

function handleHeaderClick(key: keyof T) {
  if (key === sortColumn.value)
    sortAsc.value = !sortAsc.value
  else
    sortColumn.value = key
}

const isAnyChecked = computed({
  get() {
    if (!modelValue.value)
      return false

    return !!modelValue.value.length
  },
  set(value: boolean) {
    if (value)
      modelValue.value = (props.rows || []).map(r => r.original)
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
          :title="$t('nebula.table-frame.error.title')"
          :description="$t('nebula.table-frame.error.description')"
        />
      </slot>

      <slot v-else-if="!props.rows?.length" name="empty-state">
        <neb-empty-state
          :title="$t('nebula.table-frame.empty.title')"
          :description="$t('nebula.table-frame.empty.description')"
        />
      </slot>

      <table v-else>
        <thead>
          <tr>
            <th v-if="modelValue" class="checkbox-cell">
              <neb-checkbox v-model="isAnyChecked" icon="material-symbols:remove-rounded" />
            </th>

            <th v-for="(column, key) in props.columns" :key="`th-${key as string}`" @click="handleHeaderClick(key)">
              <div class="th-wrapper">
                <div class="th-slot-wrapper">
                  <slot :name="`th-${key as string}`" :column="column">
                    {{ column!.text }}
                  </slot>
                </div>

                <icon v-if="key === sortColumn" :name="sortIcon" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, index) in props.rows" :key="index" @click="emit('click', row.original)">
            <td v-if="modelValue" class="checkbox-cell">
              <neb-checkbox v-model="modelValue" :value="row.original" @click.stop="" />
            </td>

            <td v-for="(column, key) in props.columns" :key="`td-${key as string}`">
              <slot name="td" :data="row" :original="row.original[key]" :formatted="row.formatted[key]" :column="column">
                <slot :name="`td-${key as string}`" :data="row" :original="row.original[key]" :formatted="row.formatted[key]" :column="column">
                  {{ row.formatted[key] }}
                </slot>
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
  background: #fff;
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
.header-slot,
footer {
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
  z-index: 1;
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

  .th-wrapper {
    display: flex;
    align-items: center;
  }

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
    background: var(--neutral-color-950);
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
        background: var(--primary-color-950);
      }
    }

    td {
      color: var(--neutral-color-300);
    }
  }
}
</style>
