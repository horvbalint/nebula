<script setup lang="ts" generic="T">
const props = withDefaults(defineProps<{
  modelValue?: T[]
  page?: number
  data?: T[] | null
  count?: number
  itemsPerPage?: number
  radius?: number
  sideCount?: number
}>(), {
  itemsPerPage: 10,
  radius: 1,
  sideCount: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: T[]]
  'update:page': [value: number]
}>()

const page = ref(props.page || 0)

watch(() => props.page, () => {
  if (props.page)
    page.value = props.page
})
watch(page, emitPages)
watch(() => props.data, emitPages)
emitPages()

function emitPages() {
  if (!props.data)
    return

  const startIndex = page.value * props.itemsPerPage
  emit('update:modelValue', props.data.slice(startIndex, startIndex + props.itemsPerPage))
}

const computedPageCount = computed(() => {
  const itemCount = props.data?.length || props.count

  if (!itemCount)
    return 0
  else
    return Math.ceil(itemCount / props.itemsPerPage)
})

const pageGroups = computed(() => {
  if (!computedPageCount.value)
    return []

  const startGroup = generateStartGroup()
  const middleGroup = generateMiddleGroup()
  const endGroup = generateEndGroup()

  const firstGroups = mergeGroupsIfNeeded(startGroup, middleGroup)
  const lastGroups = mergeGroupsIfNeeded(firstGroups[firstGroups.length - 1], endGroup)

  firstGroups.splice(firstGroups.length - 1, 1, ...lastGroups)

  return firstGroups
})

function generateStartGroup() {
  const startNumber = 1
  const endNumber = Math.min(startNumber + props.sideCount - 1, computedPageCount.value)
  return getNumberBetween(startNumber, endNumber)
}

const sideGroupLength = computed(() => {
  const self = 1
  const separator = 1
  const buttonCount = (props.sideCount * 2) + (props.radius * 2) + (separator * 2) + self

  return buttonCount - props.sideCount - separator
})

function generateMiddleGroup() {
  const currentPageNumber = page.value + 1

  const distanceFromStart = page.value
  const distanceFromEnd = (computedPageCount.value - 1) - page.value
  const distance = Math.min(distanceFromStart, distanceFromEnd)
  const radius = distance < sideGroupLength.value - props.radius ? sideGroupLength.value - distance : props.radius

  const startNumber = Math.max(currentPageNumber - radius, 1)
  const endNumber = Math.min(currentPageNumber + radius, computedPageCount.value)
  return getNumberBetween(startNumber, endNumber)
}

function generateEndGroup() {
  const endNumber = computedPageCount.value
  const startNumber = Math.max(endNumber - props.sideCount + 1, 1)
  return getNumberBetween(startNumber, endNumber)
}

function mergeGroupsIfNeeded(first: number[], second: number[]): number[][] {
  const lastFromFirstGroup = first[first.length - 1]
  const firstFromSecondGroup = second[0]

  if (lastFromFirstGroup + 1 < firstFromSecondGroup)
    return [first, second]

  const set = new Set([...first, ...second])
  return [[...set]]
}

function getNumberBetween(start: number, end: number): number[] {
  const numbers = []

  for (let i = start; i <= end; ++i)
    numbers.push(i)

  return numbers
}

function handlePageClick(pageIndex: number) {
  page.value = pageIndex
  emit('update:page', pageIndex)
}

function previous() {
  if (page.value === 0)
    return

  handlePageClick(page.value - 1)
}

function next() {
  if (page.value === computedPageCount.value)
    return

  handlePageClick(page.value + 1)
}
</script>

<template>
  <neb-compact>
    <template #normal-mode="{ setNormalModeRef }">
      <div :ref="setNormalModeRef" class="neb-pagination">
        <neb-button type="secondary-neutral" :disabled="page === 0" @click="previous()">
          <icon name="material-symbols:arrow-left-alt-rounded" />
          {{ $t('nebula.pagination.previous') }}
        </neb-button>

        <div class="page-numbers">
          <template v-for="(group, index) in pageGroups" :key="index">
            <neb-button
              v-for="pageNumber in group"
              :key="pageNumber"
              :type="pageNumber - 1 === page ? 'secondary-neutral' : 'tertiary-neutral'"
              @click="handlePageClick(pageNumber - 1)"
            >
              {{ pageNumber }}
            </neb-button>

            <div class="truncated">
              ...
            </div>
          </template>
        </div>

        <neb-button type="secondary-neutral" :disabled="page >= computedPageCount - 1" @click="next()">
          {{ $t('nebula.pagination.next') }}
          <icon name="material-symbols:arrow-right-alt-rounded" />
        </neb-button>
      </div>
    </template>

    <template #compact-mode>
      <div class="neb-pagination">
        <neb-button type="secondary-neutral" :disabled="page === 0" @click="previous()">
          <icon name="material-symbols:arrow-left-alt-rounded" />
        </neb-button>

        <div class="page-stats">
          {{ page! + 1 }}/{{ computedPageCount }} {{ $t('nebula.pagination.page') }}
        </div>

        <neb-button type="secondary-neutral" :disabled="page >= computedPageCount - 1" @click="next()">
          <icon name="material-symbols:arrow-right-alt-rounded" />
        </neb-button>
      </div>
    </template>
  </neb-compact>
</template>

<style scoped>
.neb-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}
.page-numbers {
  display: flex;
  align-items: center;
  gap: 2px;
}
.page-stats {
  font-size: var(--text-sm);
  color: var(--neutral-color-900);
}
.truncated {
  padding: var(--space-3);

  &:last-child {
    display: none;
  }
}

.dark-mode {
  .page-stats {
    color: var(--neutral-color-300);
  }
}
</style>
