<script lang="ts" setup>
export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'link'
export type ButtonIntent = 'primary' | 'neutral' | 'success' | 'error' | 'warning' | 'info'

withDefaults(defineProps<{
  loading?: boolean
  type?: ButtonType
  intent?: ButtonIntent
  small?: boolean
  square?: boolean
  fullWidth?: boolean
}>(), {
  loading: false,
  type: 'primary',
  intent: 'primary',
  small: false,
  square: false,
})
</script>

<script lang="ts">
export default defineComponent({
  name: 'NebButton',
})
</script>

<template>
  <button class="neb-button" :class="{ [type]: true, [`intent-${intent}`]: true, small, square, 'full-width': fullWidth }">
    <slot v-if="!loading" />

    <icon v-else name="eos-icons:loading" />
  </button>
</template>

<style scoped>
/* Every variant below reads the `--btn-*` intent slots, so `.intent-*` only has
 * to remap the slots instead of restating each state. The slots themselves
 * resolve through the semantic layer, which is what makes this component work
 * in dark mode without a `.dark-mode` block. */
.neb-button {
  --btn-bg-solid: var(--neb-bg-primary-solid);
  --btn-bg-solid-hover: var(--neb-bg-primary-solid-hover);
  --btn-bg-solid-disabled: var(--neb-bg-primary-solid-disabled);
  --btn-bg-soft: var(--neb-bg-primary-subtle);
  --btn-bg-soft-hover: var(--neb-bg-primary-hover);
  --btn-border: var(--neb-border-primary-strong);
  --btn-text: var(--neb-text-primary);
  --btn-text-hover: var(--neb-text-primary-hover);
  --btn-ring: var(--neb-ring-primary);

  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-default);
  text-align: center;
  border: none;
  font: var(--neb-font-label-strong);
  cursor: pointer;
  box-shadow: var(--neb-shadow-xs);
  transition: all var(--duration-fast);
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  user-select: none;
  white-space: nowrap;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  &.full-width {
    width: 100%;
  }
  &.small {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-default);
    max-height: 40px;
  }
  &.square {
    padding: var(--space-3);
  }
  &.small.square {
    padding: var(--space-1);
    border-radius: var(--radius-small);
  }
  /* INTENT SLOTS */
  &.intent-neutral {
    --btn-bg-solid: var(--neb-bg-neutral-solid);
    --btn-bg-solid-hover: var(--neb-bg-neutral-solid-hover);
    --btn-bg-solid-disabled: var(--neb-bg-neutral-solid-disabled);
    --btn-bg-soft: var(--neb-bg);
    --btn-bg-soft-hover: var(--neb-bg-hover);
    --btn-border: var(--neb-border);
    --btn-text: var(--neb-text-muted);
    --btn-text-hover: var(--neb-text);
    --btn-ring: var(--neb-ring-neutral);
  }
  &.intent-error {
    --btn-bg-solid: var(--neb-bg-error-solid);
    --btn-bg-solid-hover: var(--neb-bg-error-solid-hover);
    --btn-bg-solid-disabled: var(--neb-bg-error-solid-disabled);
    --btn-bg-soft: var(--neb-bg-error-subtle);
    --btn-bg-soft-hover: var(--neb-bg-error-hover);
    --btn-border: var(--neb-border-error-strong);
    --btn-text: var(--neb-text-error);
    --btn-text-hover: var(--neb-text-error-hover);
    --btn-ring: var(--neb-ring-error);
  }
  &.intent-success {
    --btn-bg-solid: var(--neb-bg-success-solid);
    --btn-bg-solid-hover: var(--neb-bg-success-solid-hover);
    --btn-bg-solid-disabled: var(--neb-bg-success-solid-disabled);
    --btn-bg-soft: var(--neb-bg-success-subtle);
    --btn-bg-soft-hover: var(--neb-bg-success-hover);
    --btn-border: var(--neb-border-success-strong);
    --btn-text: var(--neb-text-success);
    --btn-text-hover: var(--neb-text-success-hover);
    --btn-ring: var(--neb-ring-primary);
  }
  &.intent-warning {
    --btn-bg-solid: var(--neb-bg-warning-solid);
    --btn-bg-solid-hover: var(--neb-bg-warning-solid-hover);
    --btn-bg-solid-disabled: var(--neb-bg-warning-solid-disabled);
    --btn-bg-soft: var(--neb-bg-warning-subtle);
    --btn-bg-soft-hover: var(--neb-bg-warning-hover);
    --btn-border: var(--neb-border-warning-strong);
    --btn-text: var(--neb-text-warning);
    --btn-text-hover: var(--neb-text-warning-hover);
    --btn-ring: var(--neb-ring-primary);
  }
  &.intent-info {
    --btn-bg-solid: var(--neb-bg-info-solid);
    --btn-bg-solid-hover: var(--neb-bg-info-solid-hover);
    --btn-bg-solid-disabled: var(--neb-bg-info-solid-disabled);
    --btn-bg-soft: var(--neb-bg-info-subtle);
    --btn-bg-soft-hover: var(--neb-bg-info-hover);
    --btn-border: var(--neb-border-info-strong);
    --btn-text: var(--neb-text-info);
    --btn-text-hover: var(--neb-text-info-hover);
    --btn-ring: var(--neb-ring-primary);
  }
}

/* PRIMARY STYLES */
.neb-button.primary {
  background: var(--btn-bg-solid);
  color: var(--neb-text-on-solid);

  &:hover {
    background: var(--btn-bg-solid-hover);
  }
  &:focus {
    background: var(--btn-bg-solid-hover);
    box-shadow: var(--btn-ring);
  }
  &:disabled {
    background: var(--btn-bg-solid-disabled);
  }
}

/* SECONDARY STYLES */
.neb-button.secondary {
  background: var(--btn-bg-soft);
  border: 1px solid var(--btn-border);
  color: var(--btn-text);

  &:hover {
    background: var(--btn-bg-soft-hover);
    color: var(--btn-text-hover);
  }
  &:focus {
    background: var(--btn-bg-soft);
    box-shadow: var(--btn-ring);
    color: var(--btn-text-hover);
  }
  &:disabled {
    background: var(--neb-bg-disabled);
    color: var(--neb-text-disabled);
    border: 1px solid var(--neb-border-disabled);
  }
}

/* TERTIARY STYLES */
.neb-button.tertiary {
  color: var(--btn-text);
  background: none;
  box-shadow: none;

  &:hover {
    background: var(--btn-bg-soft-hover);
    color: var(--btn-text-hover);
  }
  &:focus {
    color: var(--btn-text-hover);
  }
  &:disabled {
    color: var(--neb-text-disabled);
    background: none;
  }
}

/* LINK STYLES */
.neb-button.link {
  font: var(--neb-font-label);
  color: var(--btn-text);
  background: none;
  box-shadow: none;
  padding: 0;
  height: auto;

  &:hover {
    color: var(--btn-text-hover);
  }
  &:focus {
    color: var(--btn-text-hover);
  }
  &:disabled {
    color: var(--neb-text-disabled);
  }
}
</style>
