<script lang="ts" setup>
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
const rotation = ref(0)
const minZoom = 0.5
const maxZoom = 2
const zoomStep = 0.5
const zoomOptions = [
  { label: '50%', value: 0.5 },
  { label: '100%', value: 1 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2 },
]

watch(currentSourceIndex, () => {
  resetZoom()
  rotation.value = 0
})
function resetZoom() {
  zoomLevel.value = 1
}
function rotateLeft() {
  rotation.value = (rotation.value - 90)
}
function rotateRight() {
  rotation.value = (rotation.value + 90)
}
function zoomIn() {
  zoomLevel.value = Math.min(maxZoom, zoomLevel.value + zoomStep)
}

function zoomOut() {
  zoomLevel.value = Math.max(minZoom, zoomLevel.value - zoomStep)
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
              v-model="zoomLevel"
              :options="zoomOptions"
              label-key="label"
              track-by-key="value"
              use-only-tracked-key
            />
          </div>

          <neb-tooltip :title="$t('nebula.imageViewer.zoomIn')">
            <neb-button type="link-neutral" small :disabled="zoomLevel >= maxZoom" @click="zoomIn">
              <icon name="material-symbols:add-circle-outline-rounded" />
            </neb-button>
          </neb-tooltip>

          <neb-tooltip :title="$t('nebula.imageViewer.resetZoom')">
            <neb-button type="link-neutral" small @click="resetZoom">
              <icon name="material-symbols:fit-screen-rounded" />
            </neb-button>
          </neb-tooltip>

          <div class="separator" />

          <neb-tooltip :title="$t('nebula.imageViewer.rotateLeft')">
            <neb-button type="link-neutral" small @click="rotateLeft">
              <icon name="material-symbols:rotate-left-rounded" />
            </neb-button>
          </neb-tooltip>

          <neb-tooltip :title="$t('nebula.imageViewer.rotateRight')">
            <neb-button type="link-neutral" small @click="rotateRight">
              <icon name="material-symbols:rotate-right-rounded" />
            </neb-button>
          </neb-tooltip>
        </div>
      </header>

      <main>
        <neb-button type="link-neutral" class="controll-button desktop" @click="currentSourceIndex = prevSourceIndex">
          <icon name="material-symbols:chevron-left-rounded" />
        </neb-button>

        <div class="image-container">
          <img
            :src="currentSource"
            :style="{ transform: `scale(${zoomLevel}) rotate(${rotation}deg)` }"
            loading="lazy"
          >
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
  backdrop-filter: blur(30px);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

img {
  border-radius: var(--radius-small);
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease-out;
  user-select: none;
  cursor: pointer;
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
