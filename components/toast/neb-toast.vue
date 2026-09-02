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

const computedProgress = computed(() => {
  if (!props.progress)
    return 0

  return `${props.progress * 100}%`
})

const computedClasses = computed(() => {
  const classes = [props.type] as string[]

  if (props.hideActionRow)
    classes.push('hide-action-row')

  return classes
})

const iconByType = computed(() => {
  switch (props.type) {
    case 'error':
      return 'material-symbols:report-outline-rounded'
    case 'success':
      return 'material-symbols:check-circle-outline-rounded'
    case 'warning':
      return 'material-symbols:report-outline-rounded'
    default:
      return 'material-symbols:info-outline-rounded'
  }
})
</script>

<template>
  <div class="neb-toast hide-action" :class="computedClasses">
    <div class="toast-wrapper">
      <div class="toast-type-icon">
        <icon :name="iconByType" />
      </div>

      <div class="toast-content">
        <div class="toast-content-text">
          <h6>{{ props.title }}</h6>
          <p>{{ props.description }}</p>
        </div>

        <footer v-if="$slots.footer">
          <slot name="footer" />
        </footer>

        <footer v-else-if="!hideActionRow">
          <neb-button class="toast-button" type="link" color @click="$emit('close')">
            {{ $t('nebula.toast.close') }}
          </neb-button>

          <neb-button
            v-for="action in props.actions"
            :key="action.text"
            class="toast-button"
            type="link"
            @click="action.callback()"
          >
            {{ action.text }}
          </neb-button>
        </footer>
      </div>

      <icon v-if="!hideActionRow" class="close-icon" name="material-symbols:close-rounded" @click="$emit('close')" />
    </div>

    <hr class="timer-line">
  </div>
</template>

<style scoped>
.neb-toast {
  --toast-border: var(--neb-border-primary-alert);
  --toast-bg: var(--neb-bg-primary);
  --toast-icon: var(--neb-text-primary);
  --toast-icon-ring1: var(--neb-border-primary-strong);
  --toast-icon-ring2: var(--neb-border-primary);
  --toast-close: var(--neb-text-primary);
  --toast-close-hover: var(--neb-text-primary-hover);
  --toast-button: var(--neb-text-primary);
  --toast-timer: var(--neb-bg-primary-solid);
  --toast-title: var(--neb-text-primary);
  --toast-body: var(--neb-text-primary);

  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
  position: relative;
  border-radius: var(--radius-large);
  overflow: hidden;
  box-shadow: var(--neb-shadow-md);
  border: var(--toast-border);
  background: var(--toast-bg);
  animation: bottom-left var(--duration-default) forwards;
  min-width: 250px;

  &.error {
    --toast-border: var(--neb-border-error-alert);
    --toast-bg: var(--neb-bg-error);
    --toast-icon: var(--neb-text-error);
    --toast-icon-ring1: var(--neb-border-error-strong);
    --toast-icon-ring2: var(--neb-border-error);
    --toast-close: var(--neb-text-error);
    --toast-close-hover: var(--neb-text-error-hover);
    --toast-button: var(--neb-text-error);
    --toast-timer: var(--neb-bg-error-solid);
    --toast-title: var(--neb-text-error);
    --toast-body: var(--neb-text-error);
  }
  &.success {
    --toast-border: var(--neb-border-success-alert);
    --toast-bg: var(--neb-bg-success);
    --toast-icon: var(--neb-text-success);
    --toast-icon-ring1: var(--neb-border-success-strong);
    --toast-icon-ring2: var(--neb-border-success);
    --toast-close: var(--neb-text-success);
    --toast-close-hover: var(--neb-text-success-hover);
    --toast-button: var(--neb-text-success);
    --toast-timer: var(--neb-bg-success-solid);
    --toast-title: var(--neb-text-success);
    --toast-body: var(--neb-text-success);
  }
  &.warning {
    --toast-border: var(--neb-border-warning-alert);
    --toast-bg: var(--neb-bg-warning);
    --toast-icon: var(--neb-text-warning);
    --toast-icon-ring1: var(--neb-border-warning-strong);
    --toast-icon-ring2: var(--neb-border-warning);
    --toast-close: var(--neb-text-warning);
    --toast-close-hover: var(--neb-text-warning-hover);
    --toast-button: var(--neb-text-warning);
    --toast-timer: var(--neb-bg-warning-solid);
    --toast-title: var(--neb-text-warning);
    --toast-body: var(--neb-text-warning);
  }

  .toast-type-icon {
    color: var(--toast-icon);
  }
  .close-icon {
    color: var(--toast-close);

    &:hover {
      color: var(--toast-close-hover);
    }
  }
  .toast-button {
    color: var(--toast-button);
  }
  .timer-line {
    background: var(--toast-timer);
  }
  .toast-content-text {
    h6 {
      color: var(--toast-title);
    }
    p {
      color: var(--toast-body);
    }
  }
}

.toast-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-4);
}
.toast-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-3);
}
.toast-content-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  h6 {
    font-size: var(--text-sm);
    font-weight: 700;
  }
  p {
    font-size: var(--text-sm);
    font-weight: 400;
    line-height: 1.5;
  }
}

.toast-type-icon {
  margin-top: var(--space-1);
  position: relative;
  height: 24px;
  width: 24px;

  &:before {
    content: '';
    display: block;
    position: absolute;
    transform: scale(1.3);
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border: 2px solid var(--toast-icon-ring1);
    border-radius: 50%;
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    transform: scale(1.7);
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border: 1px solid var(--toast-icon-ring2);
    border-radius: 50%;
  }
}
footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.close-icon {
  cursor: pointer;
  height: 20px;
  width: 20px;
}
.timer-line {
  border: none;
  height: 2px;
  width: v-bind(computedProgress);
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
