<script lang="ts" setup>
const wrapper = ref(null)

const normalModeElement = ref(null as null | Element)
function setNormalModeRef(ref: Element | ComponentPublicInstance | null) {
  if (ref === null)
    normalModeElement.value = null
  else if ('$el' in ref)
    normalModeElement.value = ref.$el
  else
    normalModeElement.value = ref
}

const compactMode = useNebCompact(wrapper, normalModeElement)
</script>

<template>
  <div ref="wrapper">
    <slot v-if="!compactMode" name="normal-mode" :set-normal-mode-ref="setNormalModeRef" />
    <slot v-else name="compact-mode" />
  </div>
</template>
