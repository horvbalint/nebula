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

const button = ref(null)
const dropdown = ref(null)

const { floatingStyles } = useFloating(button, dropdown, floatingOptions)

const clickOutsideOptions: OnClickOutsideOptions = {
  ignore: [button],
}

const open = ref(false)
function toggle() {
  open.value = !open.value
}
</script>

<template>
  <div ref="button" class="button-wrapper">
    <slot name="button" :toggle="toggle" />
  </div>

  <div v-if="open" ref="dropdown" v-on-click-outside="[toggle, clickOutsideOptions]" class="dropdown" :style="floatingStyles">
    <slot name="content" :toggle="toggle" />
  </div>
</template>

<style scoped>
.button-wrapper {
  width: fit-content
}
</style>
