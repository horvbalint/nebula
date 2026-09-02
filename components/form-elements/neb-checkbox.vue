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
const input = useTemplateRef('input')

function handleClick() {
  input.value!.click()
}

defineExpose({
  handleClick,
})
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
  color: var(--neb-text);
  user-select: none;
}
.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  background-color: var(--neb-bg);
  border: 1px solid var(--neb-border);
  border-radius: var(--radius-small);
  cursor: pointer;
}
.neb-checkbox:hover input ~ .checkmark {
  background: var(--neb-bg-primary-hover);
  border-color: var(--neb-text-primary);
  transition: all var(--duration-default);
}
.neb-checkbox:focus-within input ~ .checkmark {
  background: var(--neb-bg);
  border-color: var(--neb-border-focus);
  box-shadow: var(--neb-ring-primary);
  transition: all var(--duration-default);
}
.neb-checkbox input:checked ~ .checkmark {
  background: var(--neb-bg-primary-subtle);
  border-color: var(--neb-text-primary);
  transition: all var(--duration-default);
}
.checkmark .icon {
  display: none;
  color: var(--neb-text-primary);
}
.neb-checkbox input:checked ~ .checkmark .icon {
  display: block;
}
.label-wrapper {
  cursor: pointer;
}
</style>
