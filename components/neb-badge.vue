<script lang="ts" setup>
const props = withDefaults(defineProps<{
  small?: boolean
  color?: 'error' | 'warning' | 'success' | 'info' | 'primary'
}>(), {
  small: false,
})
</script>

<template>
  <div
    class="neb-badge"
    :class="{
      small: props.small,
      error: props.color === 'error',
      warning: props.color === 'warning',
      success: props.color === 'success',
      info: props.color === 'info',
      primary: props.color === 'primary',
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.neb-badge {
  --badge-bg: var(--neb-bg-muted);
  --badge-border: var(--neb-border-subtle);
  --badge-text: var(--neb-text);

  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: var(--badge-bg);
  border: 1px solid var(--badge-border);
  border-radius: var(--radius-default);
  font: var(--neb-font-label-strong);
  color: var(--badge-text);
  width: fit-content;

  &.small {
    padding: 2px var(--space-2);
    font-size: var(--text-xs);
  }
  &.error {
    --badge-bg: var(--neb-bg-error);
    --badge-border: var(--neb-border-error);
    --badge-text: var(--neb-text-error);
  }
  &.warning {
    --badge-bg: var(--neb-bg-warning);
    --badge-border: var(--neb-border-warning);
    --badge-text: var(--neb-text-warning);
  }
  &.success {
    --badge-bg: var(--neb-bg-success);
    --badge-border: var(--neb-border-success);
    --badge-text: var(--neb-text-success);
  }
  &.info {
    --badge-bg: var(--neb-bg-info);
    --badge-border: var(--neb-border-info);
    --badge-text: var(--neb-text-info);
  }
  &.primary {
    --badge-bg: var(--neb-bg-primary);
    --badge-border: var(--neb-border-primary);
    --badge-text: var(--neb-text-primary);
  }
}
</style>
