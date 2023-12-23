<script lang="ts" setup generic="T">
withDefaults(defineProps<{
  value?: T
  label?: string
  icon?: string
  align?: 'top' | 'center' | 'bottom'
}>(), {
  icon: 'material-symbols:done-rounded',
  align: 'center',
})

const modelValue = defineModel<T[] | Set<T> | boolean>()
</script>

<template>
  <label class="neb-checkbox" :class="$props.align">
    <input
      v-bind="$attrs"
      v-model="modelValue"
      type="checkbox"
      :value="$props.value"
    >
    <div class="checkmark">
      <Icon :name="$props.icon!" />
    </div>

    <div class="slot-wrapper">
      <slot>
        <p v-if="label">{{ $props.label }}</p>
      </slot>
    </div>
  </label>
</template>

<style scoped>
.neb-checkbox {
  display: flex;
  gap: var(--space-2);
  font-weight: 500;
  cursor: pointer;
  font-size: var(--text-xs);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &.top {
    align-items: flex-start;
  }
  &.center {
    align-items: center;
  }
  &.bottom {
    align-items: flex-end;
  }
}
.neb-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.slot-wrapper {
  flex: 1;
}
.neb-checkbox p {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-color-800);
  user-select: none;
}
.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  background-color: var(--white-color);
  border: 1px solid var(--neutral-color-300);
  border-radius: var(--radius-small);
}
.neb-checkbox:hover input ~ .checkmark {
  background: var(--primary-color-100);
  border-color: var(--primary-color-600);
  transition: all var(--duration-default);
}
.neb-checkbox:focus-within input ~ .checkmark {
  background: var(--white-color);
  border-color: var(--primary-color-300);
  box-shadow: var(--primary-focus-shadow-light);
  transition: all var(--duration-default);
}
.neb-checkbox input:checked ~ .checkmark {
  background: var(--primary-color-50);
  border-color: var(--primary-color-600);
  transition: all var(--duration-default);
}
.checkmark .icon {
  display: none;
  color: var(--primary-color-600);
}
.neb-checkbox input:checked ~ .checkmark .icon {
  display: block;
}

.dark-mode {
  .neb-checkbox p {
    color: var(--neutral-color-300);
  }
  .checkmark {
    background-color: var(--neutral-color-950);
    border: 1px solid var(--neutral-color-700);
  }
  .neb-checkbox:hover input ~ .checkmark {
    background: var(--primary-color-900);
    border-color: var(--primary-color-600);
  }
  .neb-checkbox:focus-within input ~ .checkmark {
    background-color: var(--neutral-color-950);
    border-color: var(--primary-color-700);
    box-shadow: var(--primary-focus-shadow-dark);
  }
  .neb-checkbox input:checked ~ .checkmark {
    background: var(--primary-color-800);
    border-color: var(--primary-color-600);
  }
  .neb-checkbox .checkmark .icon {
    color: var(--primary-color-100);
  }
}
</style>
