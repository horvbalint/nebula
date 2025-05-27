<script setup lang="ts" generic="T">
import type { AsyncDataRequestStatus } from '#app'
import type { NebSaveRestoreProps } from '../../composables/neb-save-restore'

const props = withDefaults(defineProps<NebSaveRestoreProps & {
  data: T[] | null
  count?: number
  radius?: number
  sideCount?: number
  status?: AsyncDataRequestStatus
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
const pageCount = computed(() => Math.ceil(itemCount.value / itemsPerPage.value))

watch(pageCount, () => {
  if (props.status === 'success' && page.value >= pageCount.value)
    page.value = 0
})

const desiredButtonCount = computed(() => {
  // This is the max number of buttons that can occur in the pagination component, we always try to show this many buttons
  const maxButtonCount = props.sideCount * 2
    + props.radius * 2
    + 2 // separators
    + 1 // current page

  return Math.min(maxButtonCount, pageCount.value)
})

const buttons = computed(() => {
  if (!pageCount.value)
    return []

  const state = {
    left: 0,
    right: 0,
    middle: {
      start: 0,
      end: 0,
    },
  }

  // radius around the current page
  state.middle.start = Math.max(1, page.value + 1 - props.radius)
  state.middle.end = Math.min(pageCount.value, page.value + 1 + props.radius)

  // left side
  const distanceFromRadiusStart = state.middle.start - props.sideCount
  if (distanceFromRadiusStart >= 3)
    state.left = props.sideCount
  else
    state.middle.start = 1

  // // right side
  const distanceFromRadiusEnd = (pageCount.value - props.sideCount + 1) - state.middle.end
  if (distanceFromRadiusEnd >= 3)
    state.right = props.sideCount
  else
    state.middle.end = pageCount.value

  const buttonCount = state.left + state.right + (state.middle.end - state.middle.start + 1) + Number(!!state.left) + Number(!!state.right)
  const missingButtonCount = desiredButtonCount.value - buttonCount

  if (missingButtonCount > 0) {
    if (page.value < pageCount.value / 2)
      state.middle.end += missingButtonCount
    else
      state.middle.start -= missingButtonCount
  }

  if (state.left + 2 >= state.middle.start) {
    state.middle.start = 1
    state.left = 0
  }

  if (state.middle.end + 1 >= pageCount.value - state.right) {
    state.middle.end = pageCount.value
    state.right = 0
  }

  const buttons: (number | '...')[] = []

  if (state.left) {
    for (let i = 1; i <= state.left; i++)
      buttons.push(i)

    buttons.push('...')
  }

  for (let i = state.middle.start; i <= state.middle.end; i++)
    buttons.push(i)

  if (state.right) {
    buttons.push('...')

    for (let i = state.right - 1; i >= 0; i--)
      buttons.push(pageCount.value - i)
  }

  return buttons
})

function handlePageClick(pageIndex: number) {
  page.value = pageIndex
}

function previous() {
  if (page.value === 0)
    return

  handlePageClick(page.value - 1)
}

function next() {
  if (page.value === pageCount.value)
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
            <template v-for="button in buttons" :key="button">
              <div v-if="button === '...'" class="separator">
                ...
              </div>

              <neb-button
                v-else
                class="page-number"
                :type="button - 1 === page ? 'secondary-neutral' : 'tertiary-neutral'"
                small
                @click="handlePageClick(button - 1)"
              >
                {{ button }}
              </neb-button>
            </template>
          </div>

          <neb-button type="secondary-neutral" :disabled="page >= pageCount - 1" small @click="next()">
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
          {{ page! + 1 }}/{{ pageCount }} {{ $t('nebula.pagination.page') }}
        </div>

        <neb-button type="secondary-neutral" :disabled="page >= pageCount - 1" @click="next()">
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
.separator,
.page-number {
  width: 35px;
  text-align: center;
}

.dark-mode {
  .page-stats {
    color: var(--neutral-color-300);
  }
}
</style>
