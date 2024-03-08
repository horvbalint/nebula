<script setup lang="ts">
import { h } from 'vue'
import type { ButtonType } from './neb-button.vue'

const props = withDefaults(defineProps<{
  type?: ButtonType
}>(), {
  type: 'secondary-neutral',
})

const slots = useSlots()
if (!slots || !slots.default)
  throw new Error('"neb-button-group" default slot can not be empty!')

function render() {
  const slotNodes = getSlotsChildren(slots)
  const buttonNodes = slotNodes
    .filter(node => (node.type as Component).name === 'NebButton')

  if (slotNodes.length !== buttonNodes.length)
    console.warn('"neb-button-group" can only contain "neb-button" components!')

  for (const node of buttonNodes) {
    if (!node.props)
      node.props = {}

    node.props = { ...node.props, ...useAttrs() }

    if (!node.props.type)
      node.props.type = props.type
  }

  return h('div', { class: 'neb-button-group' }, buttonNodes)
}
</script>

<template>
  <render />
</template>

<style scoped>
.neb-button-group {
  display: flex;

  & :deep(.neb-button) {
    &:not(:first-child):not(:last-child) {
      border-left: 0 !important;
      border-right: 0 !important;
      border-radius: 0 !important;
    }
    &:not(:first-child) {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    &:not(:last-child) {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
    &:focus {
      z-index: 1;
    }
  }
}
</style>
