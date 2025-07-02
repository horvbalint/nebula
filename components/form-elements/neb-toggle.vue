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
  color: var(--neutral-color-800);
  user-select: none;
}
.neb-toggle-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;

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
    background: var(--neutral-color-300);
  }
  &:focus-within .slider {
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
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background: #fff;
  box-shadow: var(--shadow-sm);
  -webkit-transition: var(--duration-default);
  transition: var(--duration-default);
}
input:checked + .slider {
  background: var(--primary-color);

  &:hover {
    background: var(--primary-color-600);
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

.dark-mode {
  .neb-toggle {
    p {
      color: var(--neutral-color-300);
    }
  }

  .neb-toggle-switch {
    &:hover .slider {
      background: var(--neutral-color-600);
    }
    &:focus-within .slider {
      box-shadow: var(--primary-focus-shadow-dark);
    }
  }
  .slider {
    background: var(--neutral-color-700);
  }
  .slider:before {
    background: var(--neutral-color-950);
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

@media (--tablet-viewport) {
  .toggle-text {
    font-size: var(--text-sm) !important;
  }
}
</style>
