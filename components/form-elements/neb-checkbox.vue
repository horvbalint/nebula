<script lang="ts" setup generic="T">
withDefaults(defineProps<{
  value?: T
  label?: string
  icon?: string
}>(), {
  icon: 'material-symbols:done-rounded',
})

const modelValue = defineModel()
</script>

<template>
  <label class="neb-checkbox">
    <input
      v-model="modelValue"
      type="checkbox"
      :value="$props.value"
    >
    <div class="checkmark">
      <icon :name="$props.icon" />
    </div>

    <slot>
      <p v-if="label">{{ $props.label }}</p>
    </slot>
  </label>
</template>

<style scoped>
.neb-checkbox {
  display: flex;
  gap: var(--space-2);
  font-weight: 500;
  align-items: center;
  cursor: pointer;
  font-size: var(--text-xs);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.neb-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
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
  .neb-checkbox .checkmark:after {
    left: 6px;
    top: 2px;
    width: 4px;
    height: 9px;
    border: solid var(--primary-color-300);
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

}
</style>
