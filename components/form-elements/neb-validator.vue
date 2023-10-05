<script lang="ts" setup>
type ValidityKey = keyof ValidityState

defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
  'update:modelValue': [isValid: boolean]
  'update:errors': [errors: typeof readonlyErrorStates]
}>()

const errorStates = new Map<HTMLElement, ValidityKey[]>()
const readonlyErrorStates = readonly(errorStates)

function emitErrors() {
  emit('update:modelValue', !readonlyErrorStates.size)
  emit('update:errors', readonlyErrorStates)
}

function onValidityChange(element: HTMLElement, errors: ValidityKey[]) {
  if (errors.length)
    errorStates.set(element, errors)
  else
    errorStates.delete(element)

  emitErrors()
}

function onDestroy(element: HTMLElement) {
  errorStates.delete(element)
  emitErrors()
}

function init(element: HTMLElement) {
  onBeforeUnmount(() => onDestroy(element))
}

provide(NebValidatorCallbacksInjectKey, {
  init,
  onValidityChange,
  onDestroy,
})
</script>

<template>
  <slot />
</template>
