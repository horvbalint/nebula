<script lang="ts" setup>
const props = withDefaults(defineProps<{
  modelValue: boolean | any
  closedValue?: boolean | any
  centerContent?: boolean
}>(), {
  closedValue: false,
  centerContent: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const popup = ref<null | HTMLElement>(null)

function handleClick(event: MouseEvent) {
  if (event.target === popup.value)
    emit('update:modelValue', props.closedValue)
}
</script>

<template>
  <teleport v-if="modelValue" to="body">
    <div
      ref="popup"
      class="neb-pop-up"
      :class="{ 'center-content': centerContent }"
      @click="handleClick($event)"
    >
      <slot />
    </div>
  </teleport>
</template>

<style scoped>
.neb-pop-up {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 100;
  overflow: auto;
  overscroll-behavior: none;
  animation: fade var(--duration-default) forwards;

  display: flex;
  flex-direction: column;
  align-items: center;

  &.center-content {
    justify-content: center;
  }
  &:last-child {
    background: rgba(var(--neutral-color-component), 0.7);
    backdrop-filter: blur(6px);
  }
}

.dark-mode {
  .neb-pop-up {
    background: rgba(var(--neutral-color-component-800), 0.7);
  }
}

@keyframes fade {
  0% {
    opacity: .5;
  }
  100% {
    opacity: 1;
  }
}
</style>
