<script lang="ts" setup>
const wrapper = ref(null)

const normalModeElement = ref(null as null | Element | ComponentPublicInstance)
const compactMode = useNebCompact(wrapper, normalModeElement)

function setNormalModeRef(ref: Element | ComponentPublicInstance | null) {
  normalModeElement.value = ref
}
</script>

<template>
  <div ref="wrapper" class="neb-compact">
    <slot v-if="!compactMode" name="normal-mode" :set-normal-mode-ref="setNormalModeRef" />
    <slot v-else name="compact-mode" />
  </div>
</template>

<style scoped>
.neb-compact {
  width: 100%;
}
</style>
