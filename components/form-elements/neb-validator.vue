<script lang="ts" setup>
import type { ValidatableElement } from '@nebula/composables/neb-validate'

type ValidityKey = keyof ValidityState

defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
  'update:modelValue': [isValid: boolean]
  'update:errors': [errors: typeof readonlyErrorStates]
}>()

const errorStates = new Map<ValidatableElement, ValidityKey[]>()
const readonlyErrorStates = readonly(errorStates)

function emitErrors() {
  emit('update:modelValue', !readonlyErrorStates.size)
  emit('update:errors', readonlyErrorStates)
}

function onValidityChange(element: ValidatableElement, errors: ValidityKey[]) {
  if (errors.length)
    errorStates.set(element, errors)
  else
    errorStates.delete(element)

  emitErrors()
}

function onDestroy(element: ValidatableElement) {
  errorStates.delete(element)
  emitErrors()
}

function init(element: ValidatableElement) {
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
