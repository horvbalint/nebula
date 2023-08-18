<script setup lang="ts">
import { flip, offset, shift, useFloating } from '@floating-ui/vue'
import type { UseFloatingOptions } from '@floating-ui/vue'
import type { OnClickOutsideOptions } from '@vueuse/core'

const props = defineProps<{
  floatingOptions?: UseFloatingOptions
}>()

const floatingOptions: UseFloatingOptions = {
  middleware: [offset(8), flip(), shift({ padding: 4 })], // TODO: use the --space-1 and --space-2 css vars
  ...props.floatingOptions,
}

const trigger = ref(null)
const dropdown = ref(null)

const { floatingStyles } = useFloating(trigger, dropdown, floatingOptions)

const clickOutsideOptions: OnClickOutsideOptions = {
  ignore: [trigger],
}

const isOpen = ref(false)
function toggle() {
  isOpen.value = !isOpen.value
}

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

defineExpose({
  toggle,
})
</script>

<template>
  <div class="neb-dropdown">
    <div ref="trigger" class="trigger-wrapper">
      <slot name="trigger" :toggle="toggle" :open="open" :close="close" />
    </div>

    <div v-if="isOpen" ref="dropdown" v-on-click-outside="[toggle, clickOutsideOptions]" class="dropdown" :style="floatingStyles">
      <slot name="content" :toggle="toggle" :open="open" :close="close" />
    </div>
  </div>
</template>

<style scoped>
.trigger-wrapper {
  width: fit-content
}
</style>
