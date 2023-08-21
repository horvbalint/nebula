<script lang="ts" setup>
defineProps<{
  label?: string
}>()
const modelValue = defineModel()
</script>

<template>
  <label class="neb-toggle">
    <div class="neb-toggle-switch">
      <input v-model="modelValue" type="checkbox">
      <span class="slider" />
    </div>
    <slot>
      <p>{{ label }}</p>
    </slot>
  </label>
</template>

<style scoped>
.neb-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);

  p {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--neutral-color-800);
    user-select: none;
  }
}
.neb-toggle-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;

  &:hover .slider{
    background: var(--neutral-color-300);
  }
  &:focus-within .slider{
    box-shadow: var(--primary-focus-shadow-light);
  }
}
.neb-toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  border-radius: 12px;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--neutral-color-200);
  -webkit-transition: var(--duration-default);
  transition: var(--duration-default);
}
.slider:before {
  border-radius: 50%;
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background: var(--white-color);
  box-shadow: var(--shadow-sm);
  -webkit-transition: var(--duration-default);
  transition: var(--duration-default);
}
input:checked + .slider {
  background: var(--primary-color-600);

  &:hover {
    background: var(--primary-color-700);
  }
}
input:disabled {
  & + .slider {

    &:before {
      background: var(--neutral-color-50);
    }
    &:hover {
      background: var(--neutral-color-200);
    }
  }
}
input:checked + .slider:before {
  -webkit-transform: translateX(16px);
  -ms-transform: translateX(16px);
  transform: translateX(16px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}

.dark-mode {
  .neb-toggle {
    p {
      color: var(--neutral-color-300);
    }
  }

  .neb-toggle-switch {
    &:hover .slider{
      background: var(--neutral-color-600);
    }
    &:focus-within .slider{
      box-shadow: var(--primary-focus-shadow-dark);
    }
  }
  .slider {
    background: var(--neutral-color-700);
  }
  .slider:before {
    background: var(--neutral-color-975);
  }
  input:checked + .slider {
    &:hover {
      background: var(--primary-color-500);
    }
  }
  input:disabled {
    & + .slider {

      &:before {
        background: var(--neutral-color-950);
      }
      &:hover {
        background: var(--neutral-color-700);
      }
    }
  }
}
</style>
