<script setup lang="ts">
import type { NebToastAction, NebToastParams } from '@nebula/composables/neb-toast'

const props = withDefaults(defineProps<{
  progress?: Ref<number>
  type: NebToastParams['type']
  title: string
  description?: string
  actions: NebToastAction[]
}>(), {
  // @ts-expect-error - figure out the type error
  actions: [] as NebToastAction[],
})

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="neb-toast" :class="props.type">
    <div class="toast-wrapper">
      <div class="toast-type-icon">
        <icon name="material-symbols:info-outline-rounded" />
      </div>

      <div class="toast-content">
        <div class="toast-content-text">
          <h6>{{ props.title }}</h6>
          <p>{{ props.description }}</p>
        </div>

        <footer>
          <neb-button type="link" @click="$emit('close')">
            Bezárás
          </neb-button>

          <neb-button
            v-for="action in props.actions"
            :key="action.text"
            type="link"
            @click="action.callback()"
          >
            {{ action.text }}
          </neb-button>
        </footer>
      </div>
    </div>

    <div class="close-icon" @click="$emit('close')">
      <icon name="mdi:close" />
    </div>
  </div>
</template>

<style>
.neb-toast {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--space-4);
  gap: var(--space-12);
  border-radius: var(--radius-default);

  &.info {
    border: 1px solid var(--primary-color-300);
    background: var(--primary-color-25);

    .toast-type-icon {
      color: var(--primary-color-600);

      &:before {
        border-color: var(--primary-color-300);
      }
      &:after {
        border-color: var(--primary-color-200);
      }
    }
    .toast-content {
      h6 {
        color: var(--primary-color-700);
      }
      p {
        color: var(--primary-color-600);
      }
    }
    .close-icon {
      color: var(--primary-color-400);

      &:hover * {
        color: var(--primary-color-600);
      }
    }
  }
  &.error {
    border: 1px solid var(--error-color-300);
    background: var(--error-color-25);

    .toast-type-icon {
      color: var(--error-color-600);

      &:before {
        border-color: var(--error-color-400);
      }
      &:after {
        border-color: var(--error-color-200);
      }
    }
    .toast-content {
      h6 {
        color: var(--error-color-700);
      }
      p {
        color: var(--error-color-600);
      }
    }
    .close-icon {
      color: var(--error-color-400);

      &:hover * {
        color: var(--error-color-600);
      }
    }
  }
}
.toast-wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}
.toast-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  h6 {
    font-size: var(--text-sm);
    font-weight: 600;
  }
  p {
    font-size: var(--text-sm);
    font-weight: 400;
  }
}
.toast-content-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.toast-type-icon {
  position: relative;

  &:before {
    content: '';
    display: block;
    position: absolute;
    transform: scale(1.3);
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border: 2px solid var(--neutral-color-300);
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
    border: 1px solid var(--neutral-color-50);
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

  * {
    height: 20px;
    width: 20px;
  }
}

.dark-mode {
  .neb-toast {
    color: var(--neutral-color-300);
  }
}
</style>
