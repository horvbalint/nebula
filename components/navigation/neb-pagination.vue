<script setup lang="ts" generic="T">
import type { NebSaveRestoreProps } from '@nebula/composables/neb-save-restore'

const props = withDefaults(defineProps<NebSaveRestoreProps & {
  data: T[] | null
  count?: number
  radius?: number
  sideCount?: number
}>(), {
  radius: 1,
  sideCount: 1,
})

const modelValue = defineModel<T[]>({
  required: false,
})

const page = defineModel('page', {
  default: 0,
})

const itemsPerPage = defineModel('itemsPerPage', {
  default: 10,
})

useNebSaveRestore('neb-pagination', props, {
  page,
  itemsPerPage,
})

watchEffect(() => {
  if (!props.data)
    return

  const startIndex = page.value * itemsPerPage.value
  modelValue.value = props.data.slice(startIndex, startIndex + itemsPerPage.value)
})

const itemCount = computed(() => props.data?.length || props.count || 0)
const computedPageCount = computed(() => Math.ceil(itemCount.value / itemsPerPage.value))

watch(computedPageCount, () => {
  if (page.value >= computedPageCount.value)
    page.value = 0
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
        <section>
          <neb-select
            v-model="itemsPerPage"
            :options="[10, 20, 50, 100, 200]"
            no-search
            :allow-empty="false"
          />

          <p class="shown-range">
            {{ $t('nebula.pagination.showing') }}
            <b>{{ page * itemsPerPage + 1 }}-{{ Math.min(page * itemsPerPage + itemsPerPage, itemCount || 0) }}</b>
            {{ $t('nebula.pagination.of') }} <b>{{ itemCount }}</b>
            {{ $t('nebula.pagination.rows') }}
          </p>
        </section>

        <section>
          <neb-button type="secondary-neutral" :disabled="page === 0" small @click="previous()">
            <icon name="material-symbols:arrow-left-alt-rounded" />
            {{ $t('nebula.pagination.previous') }}
          </neb-button>

          <div class="page-numbers">
            <template v-for="(group, index) in pageGroups" :key="index">
              <neb-button
                v-for="pageNumber in group"
                :key="pageNumber"
                :type="pageNumber - 1 === page ? 'secondary-neutral' : 'tertiary-neutral'"
                small
                @click="handlePageClick(pageNumber - 1)"
              >
                {{ pageNumber }}
              </neb-button>

              <div class="truncated">
                ...
              </div>
            </template>
          </div>

          <neb-button type="secondary-neutral" :disabled="page >= computedPageCount - 1" small @click="next()">
            {{ $t('nebula.pagination.next') }}
            <icon name="material-symbols:arrow-right-alt-rounded" />
          </neb-button>
        </section>
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

  section {
    display: flex;
    align-items: center;
    gap: var(--space-4);

    .neb-select {
      width: 90px;
    }

    .shown-range {
      font-size: var(--text-sm);
      color: var(--neutral-color-500);
      font-weight: 500;
    }
    b {
      font-weight: 600;
    }
  }
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
