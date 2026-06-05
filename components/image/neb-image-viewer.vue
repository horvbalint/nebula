<script lang="ts" setup>
import type { PanzoomObject } from '@panzoom/panzoom'
import Panzoom from '@panzoom/panzoom'

const props = withDefaults(defineProps<{
  sources: string[]
  initialIndex?: number
  title?: string
}>(), {
  initialIndex: 0,
})

const modelValue = defineModel<boolean>({
  required: true,
})

const currentSourceIndex = ref(props.initialIndex)
const currentSource = computed(() => props.sources[currentSourceIndex.value])
const nextSourceIndex = computed(() => (currentSourceIndex.value + 1) % props.sources.length)
const prevSourceIndex = computed(() => (currentSourceIndex.value - 1 + props.sources.length) % props.sources.length)

const zoomLevel = ref(1)

const minZoom = 1
const maxZoom = 4
const zoomStep = 0.5
const zoomOptions = [
  { label: '100%', value: 1 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2 },
  { label: '300%', value: 3 },
  { label: '400%', value: 4 },
]

const imageContainerRef = ref<HTMLElement | null>(null)
const panzoomRef = ref<HTMLElement | null>(null)

let pz: PanzoomObject | null = null

function initPanzoom() {
  if (!panzoomRef.value || !imageContainerRef.value)
    return

  pz?.destroy()

  pz = Panzoom(panzoomRef.value, {
    maxScale: maxZoom,
    minScale: minZoom,
    contain: 'outside',
  })

  imageContainerRef.value.addEventListener('wheel', pz.zoomWithWheel)

  panzoomRef.value.addEventListener('panzoomchange', (e: Event) => {
    zoomLevel.value = Math.round((e as CustomEvent).detail.scale * 100) / 100
  })
}

watch(modelValue, (isOpen: boolean) => {
  if (isOpen) {
    nextTick(() => {
      initPanzoom()
      zoomLevel.value = 1
    })
  }
  else {
    if (pz && imageContainerRef.value)
      imageContainerRef.value.removeEventListener('wheel', pz.zoomWithWheel)
    pz?.destroy()
    pz = null
  }
}, { immediate: true })

watch(currentSourceIndex, () => {
  zoomLevel.value = 1
  nextTick(() => pz?.reset({ animate: false }))
})

function resetView() {
  pz?.reset({ animate: true })
  zoomLevel.value = 1
}

function zoomIn() {
  const next = Math.min(maxZoom, Math.round((zoomLevel.value + zoomStep) * 10) / 10)
  pz?.zoom(next, { animate: true })
}

function zoomOut() {
  const next = Math.max(minZoom, Math.round((zoomLevel.value - zoomStep) * 10) / 10)
  pz?.zoom(next, { animate: true })
}

function setZoom(value: number) {
  pz?.zoom(value, { animate: true })
}

function toggleZoom() {
  if (zoomLevel.value <= 1)
    pz?.zoom(2, { animate: true })
  else
    resetView()
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      modelValue.value = false
      break
    case 'ArrowLeft':
      currentSourceIndex.value = prevSourceIndex.value
      break
    case 'ArrowRight':
      currentSourceIndex.value = nextSourceIndex.value
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (pz && imageContainerRef.value)
    imageContainerRef.value.removeEventListener('wheel', pz.zoomWithWheel)
  pz?.destroy()
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <neb-pop-up v-model="modelValue">
    <div class="pop-up-wrapper" :style="`background-image: url(${currentSource})`">
      <div class="blur-layer" />

      <header>
        <div class="title-container">
          <neb-button type="link-neutral" class="close-button" @click="modelValue = false">
            <icon name="material-symbols:close-rounded" />
          </neb-button>

          <div class="title-wrapper">
            <icon name="material-symbols:filter-outline-rounded" />
            <h6>{{ title }}</h6>
          </div>
        </div>

        <div class="zoom-controls">
          <neb-tooltip :title="$t('nebula.imageViewer.zoomOut')">
            <neb-button type="link-neutral" small :disabled="zoomLevel <= minZoom" @click="zoomOut">
              <icon name="material-symbols:do-not-disturb-on-outline-rounded" />
            </neb-button>
          </neb-tooltip>

          <div class="zoom-select">
            <neb-select
              :model-value="zoomLevel"
              :options="zoomOptions"
              label-key="label"
              track-by-key="value"
              use-only-tracked-key
              no-search
              @update:model-value="(v) => setZoom(v as number)"
            />
          </div>

          <neb-tooltip :title="$t('nebula.imageViewer.zoomIn')">
            <neb-button type="link-neutral" small :disabled="zoomLevel >= maxZoom" @click="zoomIn">
              <icon name="material-symbols:add-circle-outline-rounded" />
            </neb-button>
          </neb-tooltip>

          <neb-tooltip :title="$t('nebula.imageViewer.resetZoom')">
            <neb-button type="link-neutral" small @click="resetView">
              <icon name="material-symbols:fit-screen-rounded" />
            </neb-button>
          </neb-tooltip>
        </div>
      </header>

      <main>
        <neb-button type="link-neutral" class="controll-button desktop" @click="currentSourceIndex = prevSourceIndex">
          <icon name="material-symbols:chevron-left-rounded" />
        </neb-button>

        <div ref="imageContainerRef" class="image-container" @dblclick="toggleZoom">
          <div ref="panzoomRef" class="panzoom-target">
            <img
              :src="currentSource"
              loading="lazy"
            >
          </div>
        </div>

        <neb-button type="link-neutral" class="controll-button desktop" @click="currentSourceIndex = nextSourceIndex">
          <icon name="material-symbols:chevron-right-rounded" />
        </neb-button>

        <div class="mobile-arrows">
          <neb-button type="link-neutral" class="controll-button" @click="currentSourceIndex = prevSourceIndex">
            <icon name="material-symbols:chevron-left-rounded" />
          </neb-button>

          <neb-button type="link-neutral" class="controll-button" @click="currentSourceIndex = nextSourceIndex">
            <icon name="material-symbols:chevron-right-rounded" />
          </neb-button>
        </div>
      </main>
    </div>
  </neb-pop-up>
</template>

<style scoped>
.pop-up-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  position: relative;
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.blur-layer {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(60px);
  background-color: rgba(0, 0, 0, 0.5);
}
.title-container {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
header {
  width: 100%;
  display: flex;
  z-index: 1;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  background: rgba(var(--neutral-color-component-950), 0.85);
  padding: var(--space-5) var(--space-8);
}

main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 0 var(--space-6);
}

.image-container {
  flex: 1;
  align-self: stretch;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.panzoom-target {
  width: 100%;
  height: 100%;
  position: relative;
  touch-action: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: var(--radius-small);
  object-fit: contain;
  transition: transform 0.2s ease-out;
  user-select: none;
  display: block;
}
.title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);

  h6 {
    font-size: var(--text-lg);
    font-weight: 500;
    color: var(--neutral-color-200);
    margin: 0;
  }
  .icon {
    color: var(--neutral-color-200);
  }
}
.zoom-controls {
  display: flex;
  align-items: center;
  gap: var(--space-4);

  .icon {
    font-size: 26px !important;
    color: var(--neutral-color-300);
  }

  .separator {
    width: 1px;
    height: 24px;
    background-color: var(--neutral-color-600);
    margin: 0 var(--space-2);
  }
}
.close-button {
  .icon {
    color: #fff;
    font-size: 24px !important;
  }
}
.controll-button {
  .icon {
    color: #fff;
    font-size: 58px !important;
  }
}
.zoom-select {
  width: 120px;
}
.mobile-arrows {
  display: none;
}
@media (--tablet-viewport) {
  header {
    padding: var(--space-4) var(--space-3);
  }
  .zoom-controls {
    display: none;
  }
  .title-wrapper {
    h6 {
      font-size: var(--text-sm);
    }
    .icon {
      display: none;
    }
  }
  main {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 var(--space-3);
  }
  .mobile-arrows {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: var(--space-3);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-12);
  }
  .desktop {
    display: none;
  }
}
</style>
