<script setup lang="ts">
import type { NebToastAction, NebToastParams } from '../../composables/neb-toast'

const props = withDefaults(defineProps<{
  progress?: number
  type: NebToastParams['type']
  title: string
  description?: string
  actions?: NebToastAction[]
  hideActionRow?: boolean
}>(), {
  actions: () => [],
  hideActionRow: false,
})

defineEmits<{
  close: []
}>()

const computedProgress = computed(() => `${(props.progress ?? 0) * 100}%`)

const computedClasses = computed(() => {
  const classes = [props.type] as string[]

  if (props.hideActionRow)
    classes.push('hide-action-row')

  return classes
})

const iconByType = computed(() => {
  switch (props.type) {
    case 'error':
      return 'material-symbols:error-outline-rounded'
    case 'warning':
      return 'material-symbols:warning-outline-rounded'
    case 'success':
      return 'material-symbols:check-circle-outline-rounded'
    default:
      return 'material-symbols:info-outline-rounded'
  }
})
</script>

<template>
  <div
    class="neb-toast"
    :class="computedClasses"
    :role="props.type === 'error' ? 'alert' : 'status'"
    :aria-live="props.type === 'error' ? 'assertive' : 'polite'"
  >
    <div class="toast-main">
      <icon class="toast-icon" :name="iconByType" />

      <div class="toast-content">
        <p class="toast-title">
          {{ props.title }}
        </p>
        <p v-if="props.description" class="toast-description">
          {{ props.description }}
        </p>

        <footer v-if="$slots.footer">
          <slot name="footer" />
        </footer>

        <footer v-else-if="!hideActionRow && props.actions.length">
          <neb-button
            v-for="action in props.actions"
            :key="action.text"
            class="toast-action"
            type="link"
            @click="action.callback()"
          >
            {{ action.text }}
          </neb-button>
        </footer>
      </div>

      <neb-button
        v-if="!hideActionRow"
        class="toast-close"
        type="tertiary"
        :intent="props.type"
        small
        square
        :aria-label="$t('nebula.toast.close')"
        @click="$emit('close')"
      >
        <icon class="close-icon" name="material-symbols:close-rounded" />
      </neb-button>
    </div>

    <span v-if="props.progress !== undefined" class="toast-timer" aria-hidden="true" />
  </div>
</template>

<style scoped>
/* Still no rail, no icon chip. What earns the extra presence over the first
 * flat pass is a one-step-deeper tint (the plain `--neb-bg-*` token instead of
 * `-subtle`), a hairline intent-coloured edge, and a filled icon glyph instead
 * of an outline. Title and body copy stay on neutral tokens (never the intent
 * hue) so they stay legible on every tint at any brand seed; hue otherwise
 * only shows up in the icon, the border, the action link and the timer. */
.neb-toast {
  --toast-bg: var(--neb-bg-primary-subtle);
  --toast-border: var(--neb-border-primary);
  --toast-icon: var(--neb-text-primary);
  --toast-link: var(--neb-text-primary);
  --toast-link-hover: var(--neb-text-primary-hover);
  --toast-accent: var(--neb-bg-primary-solid);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  border-radius: var(--radius-default);
  border: 1px solid var(--toast-border);
  background: var(--toast-bg);
  box-shadow: var(--neb-shadow-md);
  overflow: hidden;
  min-width: 240px;

  &.neutral {
    --toast-bg: var(--neb-bg-subtle);
    --toast-border: var(--neb-border);
    --toast-icon: var(--neb-text-muted);
    --toast-link: var(--neb-text);
    --toast-link-hover: var(--neb-text-muted);
    --toast-accent: var(--neb-bg-neutral-solid);
  }
  &.info {
    --toast-bg: var(--neb-bg-primary-subtle);
    --toast-border: var(--neb-border-primary-strong);
    --toast-icon: var(--neb-text-primary);
    --toast-link: var(--neb-text-primary);
    --toast-link-hover: var(--neb-text-primary-hover);
    --toast-accent: var(--neb-bg-primary-solid);
  }
  &.success {
    --toast-bg: var(--neb-bg-success-subtle);
    --toast-border: var(--neb-border-success-strong);
    --toast-icon: var(--neb-text-success);
    --toast-link: var(--neb-text-success);
    --toast-link-hover: var(--neb-text-success-hover);
    --toast-accent: var(--neb-bg-success-solid);
  }
  &.warning {
    --toast-bg: var(--neb-bg-warning-subtle);
    --toast-border: var(--neb-border-warning-strong);
    --toast-icon: var(--neb-text-warning);
    --toast-link: var(--neb-text-warning);
    --toast-link-hover: var(--neb-text-warning-hover);
    --toast-accent: var(--neb-bg-warning-solid);
  }
  &.error {
    --toast-bg: var(--neb-bg-error-subtle);
    --toast-border: var(--neb-border-error-strong);
    --toast-icon: var(--neb-text-error);
    --toast-link: var(--neb-text-error);
    --toast-link-hover: var(--neb-text-error-hover);
    --toast-accent: var(--neb-bg-error-solid);
  }
}

.toast-main {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.toast-icon {
  flex: none;
  width: var(--icon-md);
  height: var(--icon-md);
  margin-top: 2px;
  color: var(--toast-icon);
}

.toast-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
  min-width: 0;
}
.toast-title {
  font: var(--neb-font-label-strong);
  color: var(--neb-text);
}
.toast-description {
  font: var(--neb-font-body-sm);
  color: var(--neb-text-muted);
  overflow-wrap: anywhere;
}

footer {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-1);
}

/* Actions take the toast's own hue instead of the button's default primary, so
 * a "Retry" inside an error toast doesn't read as an unrelated brand link. The
 * `.neb-toast` prefix is load-bearing: it outweighs the `--btn-*` defaults
 * `neb-button` sets on this same element. */
.neb-toast .toast-action {
  --btn-text: var(--toast-link);
  --btn-text-hover: var(--toast-link-hover);

  font: var(--neb-font-label-strong);
}

.toast-close {
  /* display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  padding: var(--space-1); */
  margin: -4px -4px 0 0;
  /* border: none;
  border-radius: var(--radius-small);
  background: none;
  color: var(--neb-text-muted);
  cursor: pointer;
  outline: 0;
  transition:
    background var(--duration-fast),
    color var(--duration-fast); */

  .icon {
    width: var(--icon-sm);
    height: var(--icon-sm);
  }
  /* &:hover {
    background: var(--neb-bg-raised);
    color: var(--neb-text);
  }
  &:focus-visible {
    color: var(--neb-text);
    box-shadow: var(--neb-ring-neutral);
  } */
}

/* Elapsed-time hairline, clipped by the card's own radius so it reads as part
 * of the surface rather than a bar bolted under it. */
.toast-timer {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: v-bind(computedProgress);
  background: var(--toast-accent);
  opacity: 0.8;
}
</style>
