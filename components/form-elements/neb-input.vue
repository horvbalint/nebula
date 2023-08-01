<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  modelValue: string | number
  leadingIcon?: string
  trailingIcon?: string
  label?: string
  hint?: string
  required?: boolean
  disabled?: boolean
}>(), {
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [id: typeof props.modelValue]
  validate: [errors: Errors[]]
}>()

type Errors = keyof ValidityState
const errors = ref([] as Errors[])

const errorDict: Partial<Record<Errors, string>> = {
  badInput: 'Hibás érték!',
  patternMismatch: 'A mező nem megfelelő formátumú!',
  rangeOverflow: 'A beírt érték túl nagy!',
  rangeUnderflow: 'A beírt érték túl alacsony!',
  stepMismatch: 'A lépésköz nem megfelelő!',
  tooLong: 'A beírt szöveg túl hosszú!',
  tooShort: 'A beírt szöveg túl rövid!',
  typeMismatch: 'A mező nem megfelelő formátumú!',
  valueMissing: 'A mező kitöltése kötelező!',
}

const attrs = useAttrs()
const computedLeadingIcon = computed(() => {
  switch (attrs.type) {
    case 'email': return 'material-symbols:mail-outline-rounded'
    case 'password': return 'material-symbols:key-outline-rounded'
    default: return props.leadingIcon
  }
})

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.value)
}

const input = ref(null as null | HTMLInputElement)
function checkValidity() {
  errors.value = []

  let key: Errors
  for (key in input.value!.validity) {
    if (key === 'valid' || errors.value.includes(key))
      continue

    if (input.value!.validity[key])
      errors.value.push(key)
  }

  emit('validate', errors.value)
}
</script>

<template>
  <div class="neb-input-component">
    <label>
      <span>{{ label }} <span v-if="$props.required" class="required-star">*</span></span>

      <div class="neb-input" :class="{ 'has-error': errors.length }">
        <slot name="leading">
          <icon v-if="computedLeadingIcon" :name="computedLeadingIcon" />
        </slot>

        <input
          ref="input"
          v-bind="$attrs"
          :required="$props.required"
          :disabled="$props.disabled"
          :value="$props.modelValue"
          @input="handleInput($event)"
          @blur="checkValidity()"
        >

        <slot name="trailing">
          <icon
            v-if="errors.length"
            name="material-symbols:error-outline-rounded"
            color="#F04438"
          />

          <icon v-else-if="$props.trailingIcon" :name="$props.trailingIcon" />
        </slot>
      </div>

      <p v-if="hint" class="hint">{{ $props.hint }}</p>

      <ul v-if="errors.length" class="error-list">
        <li v-for="error in errors" :key="error">{{ errorDict[error] }}</li>
      </ul>
    </label>
  </div>
</template>

<style scoped>
.neb-input-component {
  width: 100%;
}
label {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  font-weight: 500;
  width: 100%;
}
.required-star {
  color: var(--error-color-500);
}
.neb-input {
  background: #fff;
  display: flex;
  align-items: center;
  gap: var(--space-xxs);
  padding: var(--space-xs) var(--space-xss);
  height: 40px;
  border-radius: var(--radius-default);
  border: 1px solid var(--neutral-color-300);
  transition: all var(--duration-default);

  &.has-error {
    border-color: var(--error-color-300);

    &:focus-within {
      box-shadow: var(--error-focus-shadow);
      border-color: var(--error-color-300);
    }
  }
  &:focus-within {
    border-color: var(--primary-color-300);
    box-shadow: var(--primary-focus-shadow);
  }
  & input {
    flex: 1;
    border: none;
    background: inherit;
    height: 100%;
    font-size: var(--text-sm);
    outline: none;
    color: var(--neutral-color-900);
  }
  & input:-webkit-autofill,
  & input:-webkit-autofill:focus {
    -webkit-box-shadow:0 0 0 50px white inset; /* Change the color to your own background color */
  }
  .icon {
    color: var(--neutral-color-600);
  }
}
.hint {
  font-size: var(--text-xs);
  color: var(--neutral-color-600);
  font-weight: 400;
}
.error-list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xxs);

  & li {
    color: var(--error-color-500);
    font-size: var(--text-xs);
    font-weight: 400;
  }
}
</style>
