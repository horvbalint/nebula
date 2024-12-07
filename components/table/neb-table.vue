<script setup lang="ts" generic="T extends Record<string, any>">
import type { Column, Props } from '@nebula/components/table/neb-table-frame.vue'

const props = defineProps<Omit<Props<T>, 'sortAsc' | 'sortColumn'>>()

const modelValue = defineModel<null | T[]>({
  required: false,
  default: null,
})

const sortColumn = ref<keyof T | null>(null) as Ref<keyof T | null>
const sortAsc = ref(true)

const sortedRows = computed(() => {
  if (props.loading)
    return []

  if (!sortColumn.value)
    return props.rows

  const sortFunction = getSortFunction(sortColumn.value)

  return [...props.rows || []].sort((a, b) => {
    const first = sortAsc.value ? b[sortColumn.value!] : a[sortColumn.value!]
    const second = sortAsc.value ? a[sortColumn.value!] : b[sortColumn.value!]

    if (first === undefined || first === null)
      return -1
    if (second === undefined || second === null)
      return 1

    return sortFunction(first, second)
  })
})

function getSortFunction(key: keyof T): (a: any, b: any) => number {
  if (props.columns[key]!.sortFunction)
    return props.columns[key]!.sortFunction

  const data = props.rows!.find(row => row[key])

  if (!data)
    return () => 1

  if (typeof data[key] === 'number')
    return (a: number, b: number) => a - b

  const maybeDate = createDateIfPossible(data[key])
  if (maybeDate)
    return (a: Date | string, b: Date | string) => new Date(a).getTime() - new Date(b).getTime()

  return (a: string, b: string) => a.localeCompare(b)
}

const paginationResult = ref<T[]>([]) as Ref<T[]>

const computedBinds = computed(() => {
  const binds: any = { ...props, ...useAttrs() }
  delete binds.rows

  return binds
})
</script>

<template>
  <neb-table-frame
    v-model="modelValue"
    v-model:sort-asc="sortAsc"
    v-model:sort-column="sortColumn"
    :rows="paginationResult"
    v-bind="computedBinds"
  >
    <template v-for="(_, slot) of $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>

    <template #footer>
      <slot name="footer-start" />
      <neb-pagination v-model="paginationResult" :data="sortedRows" />
      <slot name="footer-end" />
    </template>
  </neb-table-frame>
</template>
