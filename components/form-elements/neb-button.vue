<script lang="ts" setup>
export type ButtonType = 'primary' | 'secondary' | 'secondary-neutral' | 'tertiary' | 'tertiary-neutral' | 'link' | 'link-neutral'

withDefaults(defineProps<{
  loading?: boolean
  type?: ButtonType
  small?: boolean
  square?: boolean
  destructive?: boolean
  adjective?: boolean
}>(), {
  loading: false,
  type: 'primary',
  small: false,
  square: false,
  destructive: false,
  adjective: false,
})
</script>

<script lang="ts">
export default defineComponent({
  name: 'NebButton',
})
</script>

<template>
  <button class="neb-button" :class="{ [type]: true, small, square, destructive, adjective }">
    <slot v-if="!loading" />

    <icon v-else name="eos-icons:loading" />
  </button>
</template>

<style scoped>
.neb-button {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-default);
  text-align: center;
  border: none;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
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
}

.neb-button.primary {
  background: var(--primary-color);
  color: #fff;

  &:hover {
    background: var(--primary-color-600);
  }
  &:focus {
    background: var(--primary-color-600);
    box-shadow: var(--primary-focus-shadow-light);
  }
  &:disabled {
    background: var(--primary-color-200);
  }
  &.destructive {
    background: var(--error-color-600);
    color: #fff;

    &:hover {
      background: var(--error-color-700);
    }
    &:focus {
      background: var(--error-color-600);
      box-shadow: var(--error-focus-shadow-light);
    }
    &:disabled {
      background: var(--error-color-200);
    }
  }
}

/* SECONDARY STYLES */
.neb-button.secondary {
  background: var(--primary-color-50);
  border: 1px solid var(--primary-color-300);
  color: var(--primary-color-600);

  &:hover {
    background: var(--primary-color-100);
    color: var(--primary-color-700);
  }
  &:focus {
    background: var(--primary-color-50);
    box-shadow: var(--primary-focus-shadow-light);
    color: var(--primary-color-700);
  }
  &:disabled {
    background: var(--neutral-color-50);
    color: var(--neutral-color-300);
    border: 1px solid var(--neutral-color-100);
  }
  &.destructive {
    background: var(--error-color-50);
    border: 1px solid var(--error-color-300);
    color: var(--error-color-600);

    &:hover {
      background: var(--error-color-100);
      color: var(--error-color-700);
    }
    &:focus {
      background: var(--error-color-50);
      box-shadow: var(--error-focus-shadow-light);
      color: var(--error-color-600);
    }
    &:disabled {
      background: var(--neutral-color-50);
      color: var(--neutral-color-300);
      border: 1px solid var(--neutral-color-100);
    }
  }
}

.neb-button.secondary-neutral {
  background: #fff;
  border: 1px solid var(--neutral-color-300);
  color: var(--neutral-color-700);

  &:hover {
    background: var(--neutral-color-50);
    color: var(--neutral-color-800);
  }
  &:focus {
    background: #fff;
    box-shadow: var(--neutral-focus-shadow-light);
    color: var(--neutral-color-700);
  }
  &:disabled {
    background: #fff;
    color: var(--neutral-color-300);
    border-color: var(--neutral-color-200);
  }
}

/* TERTIARY STYLES */
.neb-button.tertiary {
  color: var(--primary-color-600);
  background: none;
  box-shadow: none;

  &:hover {
    background: var(--primary-color-50);
    color: var(--primary-color-700);
  }
  &:focus {
    color: var(--primary-color-700);
  }
  &:disabled {
    color: var(--neutral-color-300);
    background: none;
  }
  &.destructive {
    color: var(--error-color-600);
    background: none;
    box-shadow: none;

    &:hover {
      background: var(--error-color-50);
      color: var(--error-color-600);
    }
    &:focus {
      color: var(--error-color-600);
    }
    &:disabled {
      color: var(--neutral-color-300);
      background: none;
    }
  }
}

.neb-button.tertiary-neutral {
  color: var(--neutral-color-600);
  background: none;
  box-shadow: none;

  &:hover {
    background: var(--neutral-color-50);
    color: var(--neutral-color-700);
  }
  &:focus {
    color: var(--neutral-color-600);
  }
  &:disabled {
    color: var(--neutral-color-300);
    background: none;
  }

  &.destructive {
    color: var(--error-color-600);
    background: none;
    box-shadow: none;

    &:hover {
      background: var(--error-color-50);
      color: var(--error-color-600);
    }
    &:focus {
      color: var(--error-color-600);
    }
    &:disabled {
      color: var(--neutral-color-300);
      background: none;
    }
  }
  &.adjective {
    color: var(--success-color-600);
    background: none;
    box-shadow: none;

    &:hover {
      background: var(--success-color-50);
      color: var(--success-color-700);
    }
    &:focus {
      color: var(--success-color-600);
    }
    &:disabled {
      color: var(--neutral-color-300);
      background: none;
    }
  }
}

/* LINK STYLES */
.neb-button.link {
  font-size: var(--text-sm);
  color: var(--primary-color-600);
  background: none;
  box-shadow: none;
  padding: 0;
  height: auto;

  &:hover {
    color: var(--primary-color-700);
  }
  &:focus {
    color: var(--primary-color-700);
  }
  &:disabled {
    color: var(--neutral-color-300);
  }
  &.destructive {
    color: var(--error-color-600);
    background: none;
    box-shadow: none;

    &:hover {
      color: var(--error-color-700);
    }
    &:focus {
      color: var(--error-color-700);
    }
    &:disabled {
      color: var(--neutral-color-300);
    }
  }
}

.neb-button.link-neutral {
  font-size: var(--text-sm);
  color: var(--neutral-color-600);
  background: none;
  box-shadow: none;
  padding: 0;
  height: auto;

  &:hover {
    color: var(--neutral-color-700);
  }
  &:focus {
    color: var(--neutral-color-600);
  }
  &:disabled {
    color: var(--neutral-color-300);
  }
  &.destructive {
    color: var(--error-color);

    &:hover {
      background: var(--error-color-700);
    }
    &:focus {
      background: var(--error-color-600);
    }
    &:disabled {
      background: var(--error-color-200);
    }
  }
}

.dark-mode {
  .neb-button.primary {
    background: var(--primary-color-700);

    &:hover {
      background: var(--primary-color-600);
    }
    &:focus {
      box-shadow: var(--primary-focus-shadow-dark);
    }
    &:disabled {
      opacity: 0.6;
      background: var(--primary-color-950);
      color: var(--neutral-color-300);
    }
    &.destructive {
      background: var(--error-color-900);

      &:hover {
        background: var(--error-color-800);
      }
      &:focus {
        background: var(--error-color-700);
      }
      &:disabled {
        background: var(--error-color-950);
      }
    }
  }
  /* SECONDARY STYLES */
  .neb-button.secondary {
    background: var(--primary-color-950);
    border: 1px solid var(--primary-color-800);
    color: var(--primary-color-100);

    &:hover {
      background: var(--primary-color-900);
    }
    &:focus {
      background: var(--primary-color-950);
      box-shadow: var(--primary-focus-shadow-dark);
      color: var(--primary-color-100);
    }
    &:disabled {
      opacity: 0.6;
      background: var(--primary-color-950);
      color: var(--neutral-color-300);
    }
  }

  .neb-button.secondary-neutral {
    background: var(--neutral-color-950);
    border: 1px solid var(--neutral-color-700);
    color: var(--neutral-color-300);

    &:hover {
      background: var(--neutral-color-900);
      color: var(--neutral-color-300);
    }
    &:focus {
      background: var(--neutral-color-950);
      box-shadow: var(--neutral-focus-shadow-dark);
      color: var(--neutral-color-300);
    }
    &:disabled {
      opacity: 0.6;
      background: var(--neutral-color-950);
      color: var(--neutral-color-300);
      border-color: var(--neutral-color-700);
    }
  }

  /* TERTIARY STYLES */
  .neb-button.tertiary {
    color: var(--primary-color-500);

    &:hover {
      background: var(--primary-color-950);
      color: var(--primary-color-200);
    }
    &:focus {
      color: var(--primary-color-300);
    }
    &:disabled {
      opacity: 0.6;
      color: var(--primary-color-500);
    }
  }

  .neb-button.tertiary-neutral {
    color: var(--neutral-color-300);

    &:hover {
      background: var(--neutral-color-900);
      color: var(--neutral-color-200);
    }
    &:focus {
      color: var(--neutral-color-300);
    }
    &:disabled {
      opacity: 0.6;
      color: var(--neutral-color-300);
    }
  }

  /* LINK STYLES */
  .neb-button.link {
    color: var(--primary-color-500);

    &:hover {
      color: var(--primary-color-300);
    }
    &:focus {
      color: var(--primary-color-300);
    }
    &:disabled {
      opacity: 0.6;
      color: var(--neutral-color-300);
    }
  }

  .neb-button.link-neutral {
    color: var(--neutral-color-300);

    &:hover {
      color: var(--neutral-color-200);
    }
    &:focus {
      color: var(--neutral-color-200);
    }
    &:disabled {
      opacity: 0.6;
      color: var(--neutral-color-300);
    }
  }
}
</style>
