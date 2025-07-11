<script lang="ts" setup>
const props = withDefaults(defineProps<{
  modelValue: boolean | any
  closedValue?: boolean | any
  centerContent?: boolean
  closeOnBackgroundClick?: boolean
}>(), {
  closedValue: false,
  centerContent: false,
  closeOnBackgroundClick: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const popup = ref<null | HTMLElement>(null)
let oldOverflowValue = ''

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    oldOverflowValue = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = oldOverflowValue
  }
}, { immediate: true })

onBeforeUnmount(() => {
  document.body.style.overflow = oldOverflowValue
})

function handleClick(event: MouseEvent) {
  if (!props.closeOnBackgroundClick)
    return

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
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
