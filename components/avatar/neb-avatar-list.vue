<script setup lang="ts">
import { h } from 'vue'
import NebAvatar from '../avatar/neb-avatar.vue'

const props = withDefaults(defineProps<{
  max?: number
  size?: string
}>(), {
  max: 3,
  size: '40px',
})

const slots = defineSlots<{
  default: (props: object) => any
}>()

if (!slots || !slots.default)
  throw new Error('"neb-avatar-list" default slot can not be empty!')

const slotNodes = getSlotsChildren(slots)
const avatarNodes = slotNodes
  .filter(node => (node.type as Component).name === 'NebAvatar')

if (slotNodes.length !== avatarNodes.length)
  console.warn('"neb-avatar-list" can only contain "neb-avatar" components!')

const childNodes = avatarNodes.slice(0, props.max)

for (const node of childNodes) {
  if (node.props)
    node.props.size = props.size
}

const truncated = avatarNodes.length - props.max
if (truncated > 0)
  childNodes.push(h(NebAvatar, { text: `+${truncated}`, size: props.size }))

const render = () => h('div', { class: 'neb-avatar-list' }, childNodes)
</script>

<template>
  <render />
</template>

<style scoped>
.neb-avatar-list {
  display: flex;
  align-items: center;

  :deep(.neb-avatar) {
    margin-left: -8px;
    border: 3px solid transparent;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
