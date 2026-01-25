<script setup lang="ts">
import type { UseFloatingOptions } from '@floating-ui/vue'
import type { OnClickOutsideOptions } from '@vueuse/core'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'

const props = defineProps<{
  floatingOptions?: UseFloatingOptions
  fullWidth?: boolean
}>()

const emit = defineEmits<{
  close: []
  open: []
}>()

const floatingOptions: UseFloatingOptions = {
  middleware: [offset(8), flip({ padding: 4 }), shift({ padding: 4 })], // TODO: use the --space-1 and --space-2 css vars
  whileElementsMounted: autoUpdate,
  ...props.floatingOptions,
}

const trigger = ref<HTMLElement | null>(null)
const dropdown = ref<HTMLElement | null>(null)

const { floatingStyles, placement } = useFloating(trigger, dropdown, floatingOptions)

const clickOutsideOptions: OnClickOutsideOptions = {
  ignore: [trigger],
}

const isOpen = ref(false)
function toggle(event?: PointerEvent) {
  if (event?.target && trigger.value!.contains(event.target as Node)) // TODO: debug vueuse onClickOutside, when clicking in an input that has a focus event
    return

  isOpen.value = !isOpen.value
}

function open(event?: PointerEvent) {
  if (event?.target && trigger.value!.contains(event.target as Node))
    return

  isOpen.value = true
  emit('open')
}

function close(event?: PointerEvent) {
  if (event?.target && trigger.value!.contains(event.target as Node))
    return

  isOpen.value = false
  emit('close')
}

const readOnlyIsOpen = readonly(isOpen)

defineExpose({
  toggle,
  open,
  close,
  isOpen: readOnlyIsOpen,
})
</script>

<template>
  <div class="neb-dropdown" :class="{ 'full-width': fullWidth }">
    <div ref="trigger" class="trigger-wrapper">
      <slot name="trigger" :toggle :open :close :is-open="readOnlyIsOpen" />
    </div>

    <div
      v-if="isOpen"
      ref="dropdown"
      v-on-click-outside="[close, clickOutsideOptions]"
      :style="floatingStyles"
      class="dropdown"
    >
      <div class="neb-overlay-transition">
        <slot name="content" :placement :toggle :open :close :is-open="readOnlyIsOpen" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.neb-dropdown {
  position: relative;

  &.full-width {
    width: 100%;
    .trigger-wrapper {
      width: 100%;
    }
    .dropdown {
      width: 100%;
    }
  }
}
.dropdown {
  z-index: 2;
}
</style>
