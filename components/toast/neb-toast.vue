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
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
  position: relative;
  border-radius: var(--radius-large);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 2px solid var(--neutral-color-200);
  animation: bottom-left var(--duration-default) forwards;

  &.info {
    border: 2px solid var(--primary-color);
    background: var(--primary-color-100);

    .toast-type-icon {
      color: var(--primary-color-600);

      &:before {
        border-color: var(--primary-color-300);
      }
      &:after {
        border-color: var(--primary-color-200);
      }
    }
    .close-icon {
      color: var(--primary-color-400);

      &:hover {
        color: var(--primary-color-600);
      }
    }
    .toast-button {
      color: var(--primary-color-700);
    }
    .timer-line {
      background: var(--primary-color-600);
    }
  }
  &.error {
    border: 2px solid var(--error-color);
    background: var(--error-color-100);

    .toast-type-icon {
      color: var(--error-color-600);

      &:before {
        border-color: var(--error-color-300);
      }
      &:after {
        border-color: var(--error-color-200);
      }
    }
    .close-icon {
      color: var(--error-color-400);

      &:hover {
        color: var(--error-color-600);
      }
    }
    .toast-button {
      color: var(--error-color-700);
    }
    .timer-line {
      background: var(--error-color-600);
    }
  }
  &.success {
    border: 2px solid var(--success-color);
    background: var(--success-color-100);

    .toast-type-icon {
      color: var(--success-color-500);

      &:before {
        border-color: var(--success-color-300);
      }
      &:after {
        border-color: var(--success-color-200);
      }
    }
    .close-icon {
      color: var(--success-color-400);

      &:hover {
        color: var(--success-color-600);
      }
    }
    .toast-button {
      color: var(--success-color-600);
    }
    .timer-line {
      background: var(--success-color-600);
    }
  }
  &.warning {
    border: 2px solid var(--warning-color);
    background: var(--warning-color-100);

    .toast-type-icon {
      color: var(--warning-color-500);

      &:before {
        border-color: var(--warning-color-300);
      }
      &:after {
        border-color: var(--warning-color-200);
      }
    }
    .close-icon {
      color: var(--warning-color-400);

      &:hover {
        color: var(--warning-color-600);
      }
    }
    .toast-button {
      color: var(--warning-color-600);
    }
    .timer-line {
      background: var(--warning-color-600);
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
    color: var(--neutral-color-900);
  }
  p {
    font-size: var(--text-sm);
    font-weight: 400;
    color: var(--neutral-color-800);
    line-height: 1.5;
  }
}

.toast-type-icon {
  margin-top: var(--space-1);
  position: relative;
  height: 24px;
  color: var(--neutral-color-500);
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
    border: 2px solid var(--neutral-color-200);
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
    border: 1px solid var(--neutral-color-100);
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

.dark-mode {
  .info {
    border: 1px solid var(--primary-color-800);
    background: var(--primary-color-950);

    .toast-type-icon {
      color: var(--primary-color-600);

      &:before {
        border-color: var(--primary-color-800);
      }
      &:after {
        border-color: var(--primary-color-900);
      }
    }
    .toast-content {
      h6 {
        color: var(--primary-color-200);
      }
      p {
        color: var(--primary-color-300);
      }
    }
    .close-icon {
      color: var(--primary-color-200);

      &:hover {
        color: var(--primary-color-400);
      }
    }
    .toast-button {
      color: var(--primary-color-500);
    }
    .timer-line {
      background: var(--primary-color-500);
    }
  }
  .success {
    border: 1px solid var(--success-color-700);
    background: var(--success-color-950);

    .toast-type-icon {
      color: var(--success-color-600);

      &:before {
        border-color: var(--success-color-800);
      }
      &:after {
        border-color: var(--success-color-900);
      }
    }
    .toast-content {
      h6 {
        color: var(--success-color-200);
      }
      p {
        color: var(--success-color-300);
      }
    }
    .close-icon {
      color: var(--success-color-200);

      &:hover {
        color: var(--success-color-400);
      }
    }
    .toast-button {
      color: var(--success-color-500);
    }
    .timer-line {
      background: var(--success-color-500);
    }
  }
  .warning {
    border: 1px solid var(--warning-color-800);
    background: var(--warning-color-950);

    .toast-type-icon {
      color: var(--warning-color-600);

      &:before {
        border-color: var(--warning-color-800);
      }
      &:after {
        border-color: var(--warning-color-900);
      }
    }
    .toast-content {
      h6 {
        color: var(--warning-color-200);
      }
      p {
        color: var(--warning-color-300);
      }
    }
    .close-icon {
      color: var(--warning-color-200);

      &:hover {
        color: var(--warning-color-400);
      }
    }
    .toast-button {
      color: var(--warning-color-500);
    }
    .timer-line {
      background: var(--warning-color-500);
    }
  }
  .error {
    border: 1px solid var(--error-color-800);
    background: var(--error-color-950);

    .toast-type-icon {
      color: var(--error-color-700);

      &:before {
        border-color: var(--error-color-800);
      }
      &:after {
        border-color: var(--error-color-900);
      }
    }
    .toast-content {
      h6 {
        color: var(--error-color-200);
      }
      p {
        color: var(--error-color-300);
      }
    }
    .close-icon {
      color: var(--error-color-200);

      &:hover {
        color: var(--error-color-400);
      }
    }
    .toast-button {
      color: var(--error-color-500);
    }
    .timer-line {
      background: var(--error-color-500);
    }
  }
}
</style>
