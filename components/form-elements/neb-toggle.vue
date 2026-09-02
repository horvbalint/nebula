<script lang="ts" setup>
withDefaults(defineProps<{
  label?: string
  size?: 'small' | 'normal' | 'large'
}>(), {
  size: 'normal',
})
const modelValue = defineModel()
</script>

<template>
  <label class="neb-toggle">
    <div class="neb-toggle-switch" :class="{ [size]: true }">
      <input v-model="modelValue" type="checkbox">
      <span class="slider" />
    </div>
    <slot>
      <p class="toggle-text">{{ label }}</p>
    </slot>
  </label>
</template>

<style scoped>
.neb-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.toggle-text {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neb-text);
  user-select: none;
}
.neb-toggle-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;

  &.normal {
    width: 45px;
    height: 26px;

    .slider {
      border-radius: 15px;

      &:before {
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
      }
    }
    input:checked + .slider:before {
      -webkit-transform: translateX(19px);
      -ms-transform: translateX(19px);
      transform: translateX(19px);
    }
    ~ .toggle-text {
      font-size: var(--text-md);
    }
  }
  &.large {
    width: 54px;
    height: 30px;

    .slider {
      border-radius: 18px;

      &:before {
        height: 24px;
        width: 24px;
        left: 3px;
        bottom: 3px;
      }
    }
    input:checked + .slider:before {
      -webkit-transform: translateX(24px);
      -ms-transform: translateX(24px);
      transform: translateX(24px);
    }
    ~ .toggle-text {
      font-size: var(--text-lg);
    }
  }
  &:hover .slider {
    background: var(--neb-border-strong);
  }
  &:focus-within .slider {
    box-shadow: var(--neb-ring-primary);
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
  background: var(--neb-border);
  -webkit-transition: var(--duration-default);
  transition: var(--duration-default);
}
.slider:before {
  border-radius: 50%;
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background: var(--neb-bg);
  box-shadow: var(--neb-shadow-sm);
  -webkit-transition: var(--duration-default);
  transition: var(--duration-default);
}
input:checked + .slider {
  background: var(--neb-bg-primary-solid);

  &:hover {
    background: var(--neb-bg-primary-solid-hover);
  }
}
input:disabled {
  & + .slider {
    &:before {
      background: var(--neb-bg-disabled);
    }
    &:hover {
      background: var(--neb-border);
    }
  }
}
input:checked + .slider:before {
  -webkit-transform: translateX(16px);
  -ms-transform: translateX(16px);
  transform: translateX(16px);
}

@media (--tablet-viewport) {
  .toggle-text {
    font-size: var(--text-sm) !important;
  }
}
</style>
