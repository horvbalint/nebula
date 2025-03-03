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
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: var(--neutral-color-100);
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--neutral-color-700);
  width: fit-content;

  &.small {
    padding: 2px var(--space-2);
    font-size: var(--text-xs);
  }
  &.error {
    background: var(--error-color-100);
    border: 1px solid var(--error-color-200);
    color: var(--error-color);
  }
  &.warning {
    background: var(--warning-color-100);
    border: 1px solid var(--warning-color-200);
    color: var(--warning-color);
  }
  &.success {
    background: var(--success-color-100);
    border: 1px solid var(--success-color-200);
    color: var(--success-color);
  }
  &.info {
    background: var(--info-color-100);
    border: 1px solid var(--info-color-200);
    color: var(--info-color);
  }
  &.primary {
    background: var(--primary-color-100);
    border: 1px solid var(--primary-color-200);
    color: var(--primary-color);
  }
}

.dark-mode {
  .neb-badge {
    background: var(--neutral-color-900);
    border: 1px solid var(--neutral-color-800);
    color: var(--neutral-color-300);

    &.error {
      background: var(--error-color-950);
      border: 1px solid var(--error-color-800);
      color: var(--error-color-300);
    }
    &.warning {
      background: var(--warning-color-950);
      border: 1px solid var(--warning-color-800);
      color: var(--warning-color-300);
    }
    &.success {
      background: var(--success-color-950);
      border: 1px solid var(--success-color-800);
      color: var(--success-color-300);
    }
    &.info {
      background: var(--info-color-950);
      border: 1px solid var(--info-color-800);
      color: var(--info-color-300);
    }
    &.primary {
      background: var(--primary-color-950);
      border: 1px solid var(--primary-color-800);
      color: var(--primary-color-300);
    }
  }
}
</style>
