<script lang="ts" setup>
const props = withDefaults(defineProps<{
  modelValue: string | number
  leadingIcon?: string
  trailingIcon?: string
  label?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  lazy?: boolean
}>(), {
  required: false,
  disabled: false,
  lazy: false,
})

const emit = defineEmits<{
  'update:modelValue': [id: typeof props.modelValue]
}>()

const input = ref<null | HTMLFormElement>(null)
const { errorsToShow, collectErrors } = useNebValidateNative(input)

const attrs = useAttrs()
const computedAttrs = computed(() => {
  const computedAttrs = { ...attrs } as any

  if (!props.lazy)
    computedAttrs.onInput = emitValue
  else
    computedAttrs.onChange = emitValue

  return computedAttrs
})

const innerValue = ref(props.modelValue)

function emitValue() {
  innerValue.value = input.value!.value
  emit('update:modelValue', input.value!.value)
}

watch(() => props.modelValue, async () => {
  const showErrors = innerValue.value === props.modelValue // if the value was modified from the outside, we don't show the error to the users
  innerValue.value = props.modelValue

  await nextTick()
  collectErrors(showErrors)
})

const computedLeadingIcon = computed(() => {
  switch (attrs.type) {
    case 'email': return 'material-symbols:mail-outline-rounded'
    case 'password': return 'material-symbols:key-outline-rounded'
    default: return props.leadingIcon
  }
})

const errorDict: Partial<Record<keyof ValidityState, string>> = {
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

function focus() {
  input.value!.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="neb-input-component" :class="{ disabled: $props.disabled }">
    <label>
      <span v-if="label">{{ label }} <span v-if="$props.required" class="required-star">*</span></span>

      <div class="neb-input" :class="{ 'has-error': errorsToShow.length }">
        <slot name="leading">
          <icon v-if="computedLeadingIcon" :name="computedLeadingIcon" />
        </slot>

        <input
          ref="input"
          v-bind="computedAttrs"
          :required="$props.required"
          :disabled="$props.disabled"
          :value="$props.modelValue"
        >

        <slot name="trailing">
          <icon
            v-if="errorsToShow.length"
            name="material-symbols:error-outline-rounded"
            color="#F04438"
          />

          <icon v-else-if="$props.trailingIcon" :name="$props.trailingIcon" />
        </slot>
      </div>

      <p v-if="hint" class="hint">{{ $props.hint }}</p>

      <ul v-if="errorsToShow.length" class="error-list">
        <li v-for="error in errorsToShow" :key="error">{{ errorDict[error] }}</li>
      </ul>
    </label>
  </div>
</template>

<style scoped>
.neb-input-component {
  width: 100%;

  &.disabled .neb-input {
    background: var(--neutral-color-50);

    .icon {
      color: var(--neutral-color-400);
    }
    & input {
      color: var(--neutral-color-500);
    }
  }
}
label {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  width: 100%;
  color: var(--neutral-color-800);
}
.required-star {
  color: var(--error-color-500);
}
.neb-input {
  background: var(--white-color);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  height: 40px;
  border-radius: var(--radius-default);
  border: 1px solid var(--neutral-color-300);
  transition: all var(--duration-default);

  &.has-error {
    border-color: var(--error-color-300);

    &:focus-within {
      box-shadow: var(--error-focus-shadow-light);
      border-color: var(--error-color-300);
    }
  }
  &:focus-within {
    border-color: var(--primary-color-300);
    box-shadow: var(--primary-focus-shadow-light);
  }
  & input {
    flex: 1;
    border: none;
    background: inherit;
    height: 100%;
    font-size: var(--text-sm);
    outline: none;
    color: var(--neutral-color-900);

    &:-webkit-autofill,
    &:-webkit-autofill:focus {
      -webkit-box-shadow:0 0 0 50px white inset; /* Change the color to your own background color */
    }
  }
  .icon {
    color: var(--neutral-color-500);
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
  gap: var(--space-1);

  & li {
    color: var(--error-color-500);
    font-size: var(--text-xs);
    font-weight: 400;
    margin-left: var(--space-4);
  }
}

.dark-mode {
  .neb-input-component {
    &.disabled .neb-input {
      background: var(--neutral-color-900);

      .icon {
        color: var(--neutral-color-600);
      }
      & input {
        color: var(--neutral-color-500);
      }
    }
  }
  & label {
    color: var(--neutral-color-300);
  }
  .neb-input {
    background: var(--neutral-color-950);
    border: 1px solid var(--neutral-color-700);

    &.has-error {
      border-color: var(--error-color-700);

      &:focus-within {
        box-shadow: var(--error-focus-shadow-dark);
        border-color: var(--error-color-700);
      }
    }
    &:focus-within {
      border-color: var(--primary-color-700);
      box-shadow: var(--primary-focus-shadow-dark);
    }
    & input {
      color: var(--neutral-color-300);
    }
    & input:-webkit-autofill,
    & input:-webkit-autofill:focus {
      -webkit-box-shadow:0 0 0 50px var(--neutral-color-950) inset; /* Change the color to your own background color */
    }
    .icon {
      color: var(--neutral-color-400);
    }
  }
  .hint {
    color: var(--neutral-color-300);
  }
  .error-list {
    & li {
      color: var(--error-color-700);
    }
  }
}
</style>
