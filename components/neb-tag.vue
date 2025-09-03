<script lang="ts" setup>
defineProps<{
  onRemove?: () => void
}>()

defineEmits<{
  remove: []
}>()
</script>

<template>
  <div class="neb-tag" @click.middle="$emit('remove')">
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
  border: 1px solid var(--neutral-color-200);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-color-700);

  .icon {
    width: 16px;
    height: 16px;
    color: var(--neutral-color-500);
    cursor: pointer;
    transition: color var(--duration-default);

    &:hover {
      color: var(--neutral-color-800);
    }
  }
}

.dark-mode {
  .neb-tag {
    border: 1px solid var(--neutral-color-700);
    color: var(--neutral-color-300);

    .icon {
      color: var(--neutral-color-500);

      &:hover {
        color: var(--neutral-color-200);
      }
    }
  }
}
</style>
