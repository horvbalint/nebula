<script lang="ts" setup>
const props = withDefaults(defineProps<{
  modelValue: string | number | undefined
  leadingIcon?: string
  trailingIcon?: string
  label?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  lazy?: boolean
  autoHeight?: boolean
}>(), {
  required: false,
  disabled: false,
  lazy: false,
  autoHeight: false,
})

const emit = defineEmits<{
  'update:modelValue': [id: typeof props.modelValue]
}>()

const input = useTemplateRef('input')
const { errorsToShow, collectErrors } = useNebValidateNative(input)

const attrs = useAttrs()
const computedAttrs = computed(() => {
  const computedAttrs = {
    ...attrs,
    placeholder: attrs.placeholder || props.label,
  } as any

  if (!props.lazy)
    computedAttrs.onInput = emitValue
  else
    computedAttrs.onChange = emitValue

  return computedAttrs
})

const innerValue = ref(props.modelValue)

function emitValue() {
  if (attrs.type === 'number')
    innerValue.value = input.value!.valueAsNumber
  else
    innerValue.value = input.value!.value

  emit('update:modelValue', innerValue.value)
}

watch(() => props.modelValue, async () => {
  const showErrors = innerValue.value === props.modelValue // if the value was modified from the outside, we don't show the error to the users
  innerValue.value = props.modelValue

  await nextTick()
  collectErrors({ showErrors })
})

const computedLeadingIcon = computed(() => {
  switch (attrs.type) {
    case 'email': return 'material-symbols:mail-outline-rounded'
    case 'tel': return 'material-symbols:call-outline-rounded'
    case 'password': return 'material-symbols:key-outline-rounded'
    default: return props.leadingIcon
  }
})

function focus() {
  input.value!.focus()
}

function blur() {
  input.value!.blur()
}

defineExpose({ focus, blur, input })
</script>

<template>
  <div class="neb-input" :class="{ 'disabled': $props.disabled, 'has-error': errorsToShow.length }">
    <label>
      <span v-if="label">{{ label }} <span v-if="$props.required" class="required-star">*</span></span>

      <div class="input" :class="{ 'auto-height': autoHeight }">
        <slot name="leading">
          <icon v-if="computedLeadingIcon" :name="computedLeadingIcon" />
        </slot>

        <input
          ref="input"
          v-bind="computedAttrs"
          :required="$props.required"
          :disabled="$props.disabled"
          :value="$props.modelValue"
          step="any"
        >

        <slot name="trailing">
          <icon
            v-if="errorsToShow.length"
            name="material-symbols:error-outline-rounded"
            class="error-icon"
          />

          <icon v-else-if="$props.trailingIcon" :name="$props.trailingIcon" />
        </slot>
      </div>

      <p v-if="hint" class="hint">{{ $props.hint }}</p>

      <neb-error-list :errors="errorsToShow" />
    </label>
  </div>
</template>

<style scoped>
.neb-input {
  width: 100%;

  &.has-error {
    label {
      color: var(--error-color);
    }
    .input {
      border-color: var(--error-color-300);
      background: var(--error-color-50);

      &:focus-within {
        box-shadow: var(--error-focus-shadow-light);
        border-color: var(--error-color-300);
      }
    }
  }
  &.disabled .input {
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
.input {
  background: #fff;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  height: 40px;
  border-radius: var(--radius-default);
  border: 1px solid var(--neutral-color-300);
  transition: all var(--duration-default);

  & input {
    min-width: 100px;
  }
  &.auto-height {
    height: auto;
    min-height: 40px;
  }
  &:focus-within {
    border-color: var(--primary-color-300);
    box-shadow: var(--primary-focus-shadow-light);
  }
  & input {
    flex: 1;
    width: 100%;
    border: none;
    background: inherit;
    height: 100%;
    font-size: var(--text-sm);
    outline: none;
    color: var(--neutral-color-900);

    &::placeholder {
      color: var(--neutral-color-500);
    }
    &:-webkit-autofill,
    &:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 50px white inset; /* Change the color to your own background color */
    }
  }
  .icon {
    color: var(--neutral-color-500);

    &.error-icon {
      color: var(--error-color-500);
    }
  }
}
.hint {
  font-size: var(--text-xs);
  color: var(--neutral-color-600);
  font-weight: 400;
}

.dark-mode {
  .neb-input {
    &.has-error {
      label {
        color: var(--error-color);
      }
      .input {
        border-color: var(--error-color-700);
        background: var(--error-color-950);

        &:focus-within {
          box-shadow: var(--error-focus-shadow-light);
          border-color: var(--error-color-700);
        }
      }
    }
    &.disabled .input {
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
  .input {
    background: var(--neutral-color-950);
    border: 1px solid var(--neutral-color-700);
    &:focus-within {
      border-color: var(--primary-color-700);
      box-shadow: var(--primary-focus-shadow-dark);
    }
    & input {
      color: var(--neutral-color-300);
    }
    & input:-webkit-autofill,
    & input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 50px var(--neutral-color-950) inset; /* Change the color to your own background color */
    }
    .icon {
      color: var(--neutral-color-400);
    }
  }
  .hint {
    color: var(--neutral-color-300);
  }
}
</style>
