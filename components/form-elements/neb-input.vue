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
  <div class="neb-input" :class="{ 'disabled': $props.disabled, 'has-error': errorsToShow.length }" tabindex="-1" @focus="input?.focus()">
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
      color: var(--neb-text-error);
    }
    .input {
      border-color: var(--neb-border-invalid);
      background: var(--neb-bg-error-subtle);

      &:focus-within {
        box-shadow: var(--neb-ring-error);
        border-color: var(--neb-border-invalid);
      }
    }
  }
  &.disabled .input {
    background: var(--neb-bg-disabled);

    .icon {
      color: var(--neb-text-disabled);
    }
    & input {
      color: var(--neb-text-subtle);
    }
  }
}
label {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font: var(--neb-font-label);
  width: 100%;
  color: var(--neb-text);
}
.required-star {
  color: var(--neb-text-error);
}
.input {
  background: var(--neb-bg);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  height: 40px;
  border-radius: var(--radius-default);
  border: 1px solid var(--neb-border);
  transition: all var(--duration-default);
  min-width: 100px;

  & {
    min-width: 100px;
  }
  &.auto-height {
    height: auto;
    min-height: 40px;
  }
  &:focus-within {
    border-color: var(--neb-border-focus);
    box-shadow: var(--neb-ring-primary);
  }
  & input {
    flex: 1;
    width: 100%;
    border: none;
    background: inherit;
    height: 100%;
    font-size: var(--text-sm);
    outline: none;
    color: var(--neb-text);

    &::placeholder {
      color: var(--neb-text-subtle);
    }
    &:-webkit-autofill,
    &:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 50px var(--neb-bg) inset; /* Change the color to your own background color */
      -webkit-text-fill-color: var(--neb-text);
    }
  }
  .icon {
    color: var(--neb-text-muted);

    &.error-icon {
      color: var(--neb-text-error);
    }
  }
}
.hint {
  font: var(--neb-font-hint);
  color: var(--neb-text-muted);
}
</style>
