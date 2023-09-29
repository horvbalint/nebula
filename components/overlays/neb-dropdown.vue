<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import type { UseFloatingOptions } from '@floating-ui/vue'
import type { OnClickOutsideOptions } from '@vueuse/core'

const props = defineProps<{
  floatingOptions?: UseFloatingOptions
  fullWidth?: boolean
}>()

const floatingOptions: UseFloatingOptions = {
  middleware: [offset(8), flip({ padding: 4 }), shift({ padding: 4 })], // TODO: use the --space-1 and --space-2 css vars
  whileElementsMounted: autoUpdate,
  ...props.floatingOptions,
}

const trigger = ref<HTMLElement | null>(null)
const dropdown = ref<HTMLElement | null>(null)

const { floatingStyles } = useFloating(trigger, dropdown, floatingOptions)

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
}

function close(event?: PointerEvent) {
  if (event?.target && trigger.value!.contains(event.target as Node))
    return

  isOpen.value = false
}

defineExpose({
  toggle,
  open,
  close,
  isOpen: readonly(isOpen),
})
</script>

<template>
  <div class="neb-dropdown" :class="{ 'full-width': fullWidth }">
    <div ref="trigger" class="trigger-wrapper">
      <slot name="trigger" :toggle="toggle" :open="open" :close="close" />
    </div>

    <div
      v-if="isOpen"
      ref="dropdown"
      v-on-click-outside="[close, clickOutsideOptions]"
      :style="floatingStyles"
      class="dropdown"
    >
      <div class="neb-overlay-transition">
        <slot name="content" :toggle="toggle" :open="open" :close="close" />
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
.trigger-wrapper {
  width: fit-content;
}
.dropdown {
  z-index: 1;
}
</style>
