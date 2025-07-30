<script lang="ts" setup>
const props = defineProps<{
  sources: string[]
}>()

defineEmits(['click'])
const currentSourceIndex = ref(0)
const dotCount = computed(() => props.sources.length)
const isTransitioning = ref(false)
const slideDirection = ref<'next' | 'prev'>('next')

let autoAdvanceInterval: NodeJS.Timeout | null = null

function changeImage(newIndex: number, direction: 'next' | 'prev' = 'next') {
  if (isTransitioning.value)
    return

  slideDirection.value = direction
  isTransitioning.value = true
  currentSourceIndex.value = newIndex

  setTimeout(() => {
    return isTransitioning.value = false
  }, 500)
}

function startAutoAdvance() {
  if (props.sources.length <= 1)
    return

  autoAdvanceInterval = setInterval(() => {
    const nextIndex = (currentSourceIndex.value + 1) % props.sources.length
    changeImage(nextIndex)
  }, 5000)
}

function stopAutoAdvance() {
  if (autoAdvanceInterval) {
    clearInterval(autoAdvanceInterval)
    autoAdvanceInterval = null
  }
}

function handleDotClick(index: number) {
  const direction = index > currentSourceIndex.value ? 'next' : 'prev'
  changeImage(index, direction)

  stopAutoAdvance()
  startAutoAdvance()
}

onMounted(() => {
  startAutoAdvance()
})
onUnmounted(() => {
  stopAutoAdvance()
})
</script>

<template>
  <div class="gallery-card" @click="$emit('click', currentSourceIndex)">
    <div class="open-indicator">
      <icon name="material-symbols:open-in-new-rounded" />
    </div>

    <div class="image-container">
      <div
        class="image-slider"
        :style="{ transform: `translateX(-${currentSourceIndex * 100}%)` }"
      >
        <img
          v-for="(source, index) in sources"
          :key="index"
          :src="source"
          :alt="`Preview image ${index + 1}`"
          loading="lazy"
          onerror="this.style.display = 'none'"
        >
      </div>
    </div>

    <div class="source-counter">
      <icon
        v-for="count in dotCount"
        :key="count"
        name="oui:dot"
        :class="{ active: currentSourceIndex === (count - 1) }"
        @click.stop="handleDotClick(count - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
.gallery-card {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  transition: background-color var(--duration-default) ease-in-out;
  cursor: pointer;

  &:hover .open-indicator {
    transform: translateY(0);
    opacity: 1;

    .icon {
      opacity: 1;
    }
  }
}
.open-indicator {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-3);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
  background: linear-gradient(
    to top,
    rgba(var(--neutral-color-component-900), 0),
    rgba(var(--neutral-color-component-900), 0.85)
  );
  transform: translateY(-100%);
  opacity: 0;
  transition: all var(--duration-default) ease-in-out;
  z-index: 2;

  .icon {
    opacity: 0;
    font-size: 20px !important;
    transition: opacity var(--duration-default) ease-in-out;
  }
}
.image-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.image-slider {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    flex-shrink: 0;
  }
}
.source-counter {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  height: 40px;
  background: linear-gradient(
    to top,
    rgba(var(--neutral-color-component-900), 0.85),
    rgba(var(--neutral-color-component-900), 0.65),
    rgba(var(--neutral-color-component-900), 0.1)
  );
  z-index: 2;

  .icon {
    font-size: 11px !important;
    color: #fff;
    opacity: 0.4;
    transition: all var(--duration-default) ease-in-out;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
    &.active {
      opacity: 1;
      font-size: 14px !important;
    }
  }
}
</style>
