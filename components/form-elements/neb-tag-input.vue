<script setup lang="ts">
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

function handleAdd() {
  if (!props.modelValue.includes(currentValue.value))
    emitValue([...props.modelValue, currentValue.value])

  currentValue.value = ''
}

function removeItem(item: Item) {
  const newValue = props.modelValue.filter(i => i !== item)
  emitValue(newValue)
}

const input = ref<null | HTMLInputElement>(null)
const { collectErrors, errorsToShow } = useNebValidate(input, () => {
  if (props.required && !props.modelValue.length)
    return ['valueMissing']
  else
    return []
})
provide(NebValidatorErrorsToShowInjectKey, errorsToShow)

const lastEmitted = ref<Item[] | null>(null)
function emitValue(list: Item[]) {
  lastEmitted.value = list
  emit('update:modelValue', list)
}
watch(() => props.modelValue, () => {
  const showErrors = lastEmitted.value === props.modelValue
  collectErrors(showErrors)
})
</script>

<template>
  <neb-input
    ref="input"
    v-model="currentValue"
    :label="label"
    lazy
    auto-height
    :placeholder="$t('nebula.tag-input.placeholder')"
    :hint="$t('nebula.tag-input.hint')"
    :required="$props.required"
    :disabled="$props.disabled"
    @change="handleAdd()"
  >
    <template #leading>
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
