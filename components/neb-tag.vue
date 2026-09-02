<script lang="ts" setup>
withDefaults(defineProps<{
  small?: boolean
  onRemove?: () => void
}>(), {
  small: false,
})

defineEmits<{
  remove: []
}>()
</script>

<template>
  <div class="neb-tag" :class="{ small }" @click.middle="$emit('remove')">
    <slot />

    <icon v-if="onRemove" name="material-symbols:close-rounded" @click="$emit('remove')" />
  </div>
</template>

<style scoped>
.neb-tag {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  width: fit-content;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-default);
  border: 1px solid var(--neb-border);
  font: var(--neb-font-label);
  color: var(--neb-text);

  &.small {
    padding: 2px var(--space-2);
    font-size: var(--text-xs);
  }

  .icon {
    width: 16px;
    height: 16px;
    color: var(--neb-text-muted);
    cursor: pointer;
    transition: color var(--duration-default);

    &:hover {
      color: var(--neb-text);
    }
  }
}
</style>
