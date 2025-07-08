<script lang="ts" setup>
const props = defineProps<{
  sources: string[]
}>()

const currentSourceIndex = ref(0)
const currentSource = computed(() => props.sources[currentSourceIndex.value])
const dotCount = computed(() => {
  return props.sources.length
})
</script>

<template>
  <div class="preview-card">
    <div class="open-indicator">
      <icon name="material-symbols:open-in-new-rounded" />
    </div>

    <img :src="currentSource" alt="Preview image card" onerror="this.style.display = 'none'">

    <div class="source-counter">
      <icon
        v-for="count in dotCount"
        :key="count"
        name="oui:dot"
        :class="{ active: currentSourceIndex === (count - 1) }"
        @click="currentSourceIndex = count - 1"
      />
    </div>
  </div>
</template>

<style scoped>
.preview-card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: background-color var(--duration-default) ease-in-out;
  cursor: pointer;

  &:hover .open-indicator {
    background: linear-gradient(
      to top,
      rgba(var(--neutral-color-component-900), 0),
      rgba(var(--neutral-color-component-900), 0.7)
    );

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

  .icon {
    opacity: 0;
    font-size: 20px !important;
  }
}
.preview-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
    rgba(var(--neutral-color-component-900), 0.7),
    rgba(var(--neutral-color-component-900), 0)
  );

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
