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

<style lang="scss" scoped>
.neb-button {
  height: 40px;
  padding: $space-xss $space-s;
  border-radius: $radius-default;
  text-align: center;
  border: none;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  box-shadow: $shadow-xs;
  transition: all $duration-default;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-xs;

  &:disabled {
    cursor: default;
  }
}

.neb-button.primary {
  background: $primary-color-600;
  color: #fff;

  &:hover {
    background: $primary-color-700;
  }
  &:focus {
    background: $primary-color-600;
    box-shadow: $primary-focus-shadow;
  }
  &:disabled {
    background: $primary-color-200;
  }
}

//SECONDARY STYLES
.neb-button.secondary {
  background: $primary-color-50;
  border: 1px solid $primary-color-200;
  color: $primary-color-700;

  &:hover {
    background: $primary-color-100;
    color: $primary-color-800;
  }
  &:focus {
    background: $primary-color-50;
    box-shadow: $primary-focus-shadow;
    color: $primary-color-700;
  }
  &:disabled {
    background: $primary-color-25;
    color: $primary-color-300;
  }
}

.neb-button.secondary-neutral {
  background: #fff;
  border: 1px solid $neutral-color-300;
  color: $neutral-color-700;

  &:hover {
    background: $neutral-color-50;
    color: $neutral-color-800;
  }
  &:focus {
    background: #fff;
    box-shadow: $neutral-focus-shadow;
    color: $neutral-color-700;
  }
  &:disabled {
    background: #fff;
    color: $neutral-color-300;
    border-color: $neutral-color-200;
  }
}

//TERTIARY STYLES
.neb-button.tertiary {
  color: $primary-color-700;
  background: none;
  box-shadow: none;

  &:hover {
    background: $primary-color-50;
    color: $primary-color-800;
  }
  &:focus {
    color: $primary-color-700;
  }
  &:disabled {
    color: $neutral-color-300;
    background: none;
  }
}

.neb-button.tertiary-neutral {
  color: $neutral-color-600;
  background: none;
  box-shadow: none;

  &:hover {
    background: $neutral-color-50;
    color: $neutral-color-700;
  }
  &:focus {
    color: $neutral-color-600;
  }
  &:disabled {
    color: $neutral-color-300;
    background: none;
  }
}

//LINK STYLES
.neb-button.link {
  font-size: $text-xs;
  color: $primary-color-700;
  background: none;
  box-shadow: none;
  padding: 0;

  &:hover {
    color: $primary-color-800;
  }
  &:focus {
    color: $primary-color-700;
  }
  &:disabled {
    color: $neutral-color-300;
  }
}

.neb-button.link-neutral {
  font-size: $text-xs;
  color: $neutral-color-600;
  background: none;
  box-shadow: none;
  padding: 0;

  &:hover {
    color: $neutral-color-700;
  }
  &:focus {
    color: $neutral-color-600;
  }
  &:disabled {
    color: $neutral-color-300;
  }
}
</style>
