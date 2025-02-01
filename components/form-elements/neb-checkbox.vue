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
const input = templateRef('input')

function handleClick() {
  input.value.click()
}
</script>

<template>
  <div class="neb-checkbox" :class="$props.align">
    <input
      v-bind="$attrs"
      ref="input"
      v-model="modelValue"
      type="checkbox"
      :value="$props.value"
    >
    <div class="checkmark" @click="handleClick()">
      <Icon :name="$props.icon!" />
    </div>

    <div class="right-side">
      <div class="label-wrapper" @click="handleClick()">
        <slot>
          <p v-if="label">
            {{ $props.label }}
          </p>
        </slot>
      </div>

      <div v-if="$slots.content" class="content-wrapper">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.neb-checkbox {
  display: flex;
  gap: var(--space-2);
  font-weight: 500;
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
  display: none;
}
.right-side {
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
  background-color: #fff;
  border: 1px solid var(--neutral-color-300);
  border-radius: var(--radius-small);
  cursor: pointer;
}
.neb-checkbox:hover input ~ .checkmark {
  background: var(--primary-color-100);
  border-color: var(--primary-color-600);
  transition: all var(--duration-default);
}
.neb-checkbox:focus-within input ~ .checkmark {
  background: #fff;
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
.label-wrapper {
  cursor: pointer;
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
