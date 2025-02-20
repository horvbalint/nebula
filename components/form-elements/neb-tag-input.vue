<script setup lang="ts">
import type { ValidityKey } from '@nebula/composables/neb-validate'

type Item = string | number

const props = withDefaults(defineProps<{
  modelValue: Item[] | undefined
  label: string
  disabled?: boolean
  required?: boolean
}>(), {
  modelValue: () => [],
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [list: Item[]]
}>()

const currentValue = ref('')

const input = templateRef('input')
function handleAdd() {
  if (!currentValue.value.length || !input.value?.input?.validity.valid)
    return

  if (!props.modelValue.includes(currentValue.value))
    emitValue([...props.modelValue, currentValue.value])

  currentValue.value = ''
}

function removeItem(item: Item) {
  const newValue = props.modelValue.filter(i => i !== item)
  emitValue(newValue)
}

const { collectErrors, errorsToShow } = useNebValidate(input, (params: { inputValidate: boolean } | undefined) => {
  const errors = new Set<ValidityKey>()

  if (input.value?.input) {
    for (const key of nebGetValidityErrorKeys(input.value.input.validity))
      errors.add(key)
  }

  if (!params?.inputValidate && props.required && !props.modelValue.length)
    errors.add('valueMissing')

  return [...errors]
})
provide(NebValidatorErrorsToShowInjectKey, errorsToShow)

const lastEmitted = ref<Item[] | null>(null)
function emitValue(list: Item[]) {
  lastEmitted.value = list
  emit('update:modelValue', list)
}
watch(() => props.modelValue, () => {
  const showErrors = lastEmitted.value === props.modelValue
  collectErrors({ showErrors })
})

watch(currentValue, () => collectErrors({ params: { inputValidate: true } }))
</script>

<template>
  <neb-input
    ref="input"
    v-model="currentValue"
    :label="label"
    auto-height
    :placeholder="$t('nebula.tag-input.placeholder')"
    :hint="$t('nebula.tag-input.hint')"
    :required="$props.required"
    :disabled="$props.disabled"
    v-bind="$attrs"
    @change="handleAdd()"
  >
    <template #leading>
      <slot name="leading" />

      <neb-tag v-for="item in modelValue" :key="item" @remove="removeItem(item)">
        {{ item }}
      </neb-tag>
    </template>

    <template #trailing>
      <slot name="trailing" />
    </template>
  </neb-input>
</template>

<style scoped>
</style>
