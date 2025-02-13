<script setup lang="ts" generic="T extends Record<string, any>">
import type { AsyncDataRequestStatus } from 'nuxt/app'
import type { RestoreProps } from '../../composables/neb-restore'

export interface Column<T, Key extends keyof T = keyof T> {
  text: string
  centered?: boolean
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

export type ThSlots<T> = {
  [K in keyof T as `th-${K & string}`]: (props: { column: Column<T, K> }) => any
}

export type TdSlots<T> = {
  [K in keyof T as `td-${K & string}`]: (props: { data: FormattedRow<T>, original: FormattedRow<T>['original'][K], formatted: FormattedRow<T>['formatted'][K], column: Column<T, K> }) => any
}

export type Slots<T> = ThSlots<T> & TdSlots<T> & {
  'header'?: () => any
  'loading-state'?: () => any
  'empty-state'?: () => any
  'error-state'?: () => any
  'row-actions'?: (props: { data: FormattedRow<T> }) => any
  'last-column'?: (props: { data: FormattedRow<T> }) => any
  'footer'?: () => any
}

export type Props<T> = {
  columns: Columns<T>
  rows: FormattedRow<T>[] | null
  status?: AsyncDataRequestStatus
  refresh?: () => Promise<void>
} & RestoreProps<RestoreState<T>>

export interface Emits<T> {
  click: [row: T]
}

const props = withDefaults(defineProps<Props<T>>(), {
  status: 'success',
  restore: false,
})

const emit = defineEmits<Emits<T>>()

defineSlots<Slots<T>>()

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
      <neb-state-content
        :status="props.status"
        :refresh="props.refresh"
        :error-title="$t('nebula.table-frame.error.title')"
        :error-description="$t('nebula.table-frame.error.description')"
      >
        <slot v-if="!props.rows?.length" name="empty-state">
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

              <th v-for="(column, key) in props.columns" :key="`th-${key as string}`" :class="{ centered: column!.centered }" @click="handleHeaderClick(key)">
                <div class="th-wrapper">
                  <div class="th-slot-wrapper">
                    <slot :name="`th-${key as keyof Column<T>}`" :column="column!">
                      {{ column!.text }}
                    </slot>
                  </div>

                  <icon v-if="key === sortColumn" :name="sortIcon" />
                </div>
              </th>

              <th v-if="$slots['row-actions'] || $slots['last-column']" class="last-column">
                {{ $t('nebula.table-frame.actions') }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in props.rows" :key="index" @click="emit('click', row.original)">
              <td v-if="modelValue" class="checkbox-cell">
                <neb-checkbox v-model="modelValue" :value="row.original" @click.stop="" />
              </td>

              <td v-for="(column, key) in props.columns" :key="`td-${key as string}`" :class="{ centered: column!.centered }">
                <slot :name="`td-${key as keyof Column<T>}`" :data="row" :original="row.original[key as string]" :formatted="row.formatted[key]" :column="column!">
                  {{ row.formatted[key] }}
                </slot>
              </td>

              <td v-if="$slots['row-actions'] || $slots['last-column']">
                <slot name="last-column" :data="row">
                  <div class="actions-wrapper">
                    <slot name="row-actions" :data="row" />
                  </div>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>

        <template #loading>
          <slot name="loading-state" />
        </template>

        <template #error>
          <slot name="error-state" />
        </template>
      </neb-state-content>
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
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  line-height: 22px;

  &.centered {
    .th-wrapper {
      justify-content: center;
    }
  }

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
.last-column {
  text-align: center;
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

    &.centered {
      text-align: center;
    }
  }
}
.checkbox-cell {
  width: 0;
  padding: var(--space-3) var(--space-1) var(--space-3) var(--space-6);
}
.actions-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
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
