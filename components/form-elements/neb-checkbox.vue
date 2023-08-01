<script lang="ts" setup generic="T">
const props = defineProps<{
  modelValue: boolean | T[]
  value?: T
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: typeof props.modelValue]
}>()

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue))
    return props.modelValue.includes(props.value!)

  return props.modelValue === true
})

function handleChange(event: Event) {
  const checkbox = event.target! as HTMLInputElement
  const isInputChecked = checkbox.checked

  if (Array.isArray(props.modelValue)) {
    const newValue = [...props.modelValue]

    if (isInputChecked)
      newValue.push(props.value!)
    else
      newValue.splice(newValue.indexOf(props.value!), 1)

    emit('update:modelValue', newValue)
  }
  else {
    emit('update:modelValue', isInputChecked)
  }
}
</script>

<template>
  <label class="container">
    <slot>{{ label }}</slot>

    <input
      type="checkbox"
      :checked="isChecked"
      :value="value"
      @change="handleChange($event)"
    >
    <span class="checkmark" />
  </label>
</template>

<style scoped>
.container {
  display: flex;
  position: relative;
  padding-left: 24px;
  height: 17px;
  font-weight: 500;
  align-items: center;
  cursor: pointer;
  font-size: var(--text-xs);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 16px;
  width: 16px;
  background-color: #fff;
  border: 1px solid var(--neutral-color-300);
  border-radius: var(--radius-small);
}
.container:hover input ~ .checkmark {
  background: var(--primary-color-100);
  border-color: var(--primary-color-600);
  transition: all var(--duration-default);
}
.container:focus-within input ~ .checkmark {
  background: #fff;
  border-color: var(--primary-color-300);
  box-shadow: var(--primary-focus-shadow);
  transition: all var(--duration-default);
}
.container input:checked ~ .checkmark {
  background: var(--primary-color-50);
  border-color: var(--primary-color-600);
  transition: all var(--duration-default);
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container input:checked ~ .checkmark:after {
  display: block;
}
.container .checkmark:after {
  left: 4px;
  top: 0px;
  width: 4px;
  height: 9px;
  border: solid var(--primary-color-600);
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
