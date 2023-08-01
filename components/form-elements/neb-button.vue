<script lang="ts" setup>
withDefaults(defineProps<{
  loading?: boolean
  type?: 'primary' | 'secondary' | 'secondary-neutral' | 'tertiary' | 'tertiary-neutral' | 'link' | 'link-neutral'
}>(), {
  loading: false,
  type: 'primary',
})
</script>

<template>
  <button class="neb-button" :class="type">
    <slot v-if="!loading" />

    <icon v-else name="eos-icons:loading" />
  </button>
</template>

<style scoped>
.neb-button {
  height: 40px;
  padding: var(--space-xss) var(--space-s);
  border-radius: var(--radius-default);
  text-align: center;
  border: none;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: all var(--duration-default);
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);

  &:disabled {
    cursor: default;
  }
}

.neb-button.primary {
  background: var(--primary-color-600);
  color: #fff;

  &:hover {
    background: var(--primary-color-700);
  }
  &:focus {
    background: var(--primary-color-600);
    box-shadow: var(--primary-focus-shadow);
  }
  &:disabled {
    background: var(--primary-color-200);
  }
}

/* SECONDARY STYLES */
.neb-button.secondary {
  background: var(--primary-color-50);
  border: 1px solid var(--primary-color-200);
  color: var(--primary-color-700);

  &:hover {
    background: var(--primary-color-100);
    color: var(--primary-color-800);
  }
  &:focus {
    background: var(--primary-color-50);
    box-shadow: var(--primary-focus-shadow);
    color: var(--primary-color-700);
  }
  &:disabled {
    background: var(--primary-color-25);
    color: var(--primary-color-300);
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
    box-shadow: var(--neutral-focus-shadow);
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
  color: var(--primary-color-700);
  background: none;
  box-shadow: none;

  &:hover {
    background: var(--primary-color-50);
    color: var(--primary-color-800);
  }
  &:focus {
    color: var(--primary-color-700);
  }
  &:disabled {
    color: var(--neutral-color-300);
    background: none;
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
}

/* LINK STYLES */
.neb-button.link {
  font-size: var(--text-xs);
  color: var(--primary-color-700);
  background: none;
  box-shadow: none;
  padding: 0;

  &:hover {
    color: var(--primary-color-800);
  }
  &:focus {
    color: var(--primary-color-700);
  }
  &:disabled {
    color: var(--neutral-color-300);
  }
}

.neb-button.link-neutral {
  font-size: var(--text-xs);
  color: var(--neutral-color-600);
  background: none;
  box-shadow: none;
  padding: 0;

  &:hover {
    color: var(--neutral-color-700);
  }
  &:focus {
    color: var(--neutral-color-600);
  }
  &:disabled {
    color: var(--neutral-color-300);
  }
}
</style>
