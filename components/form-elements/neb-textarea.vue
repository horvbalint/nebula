<script lang="ts" setup>
const props = withDefaults(defineProps<{
  modelValue: string | number | undefined
  label?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  lazy?: boolean
  minHeight?: number
  resize?: string
}>(), {
  required: false,
  disabled: false,
  lazy: false,
  minHeight: 100,
  resize: 'vertical',
})

const emit = defineEmits<{
  'update:modelValue': [id: typeof props.modelValue]
}>()

const textarea = useTemplateRef('textarea')
const { errorsToShow, collectErrors } = useNebValidateNative(textarea)

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
  innerValue.value = textarea.value!.value
  emit('update:modelValue', textarea.value!.value)
}

watch(() => props.modelValue, async () => {
  const showErrors = innerValue.value === props.modelValue // if the value was modified from the outside, we don't show the error to the users
  innerValue.value = props.modelValue

  await nextTick()
  collectErrors({ showErrors })
})

defineExpose({
  textarea,
})
</script>

<template>
  <div class="neb-textarea" :class="{ disabled: $props.disabled }">
    <label>
      <span v-if="label">{{ label }} <span v-if="$props.required" class="required-star">*</span></span>

      <div class="textarea-wrapper" :class="{ 'has-error': errorsToShow.length }">
        <textarea
          ref="textarea"
          v-bind="computedAttrs"
          :required="$props.required"
          :disabled="$props.disabled"
          :value="$props.modelValue"
          :style="{
            minHeight: `${$props.minHeight}px`,
            resize: $props.resize,
          }"
        />
      </div>

      <footer v-if="hint || computedAttrs.maxlength">
        <p v-if="hint" class="hint">{{ $props.hint }}</p>
        <span v-if="computedAttrs.maxlength">{{ $props.modelValue?.toString().length }}/{{ computedAttrs.maxlength }}</span>
      </footer>

      <neb-error-list :errors="errorsToShow" />
    </label>
  </div>
</template>

<style scoped>
.neb-textarea {
  width: 100%;

  &.disabled .textarea-wrapper {
    background: var(--neb-bg-disabled);

    .icon {
      color: var(--neb-text-disabled);
    }
    & textarea {
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
.textarea-wrapper {
  background: var(--neb-bg);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-default);
  border: 1px solid var(--neb-border);
  transition: all var(--duration-default);

  &.has-error {
    border-color: var(--neb-border-invalid);

    &:focus-within {
      box-shadow: var(--neb-ring-error);
      border-color: var(--neb-border-invalid);
    }
  }
  &:focus-within {
    border-color: var(--neb-border-focus);
    box-shadow: var(--neb-ring-primary);
  }
  & textarea {
    flex: 1;
    border: none;
    background: inherit;
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
  }
}
.hint {
  font: var(--neb-font-hint);
  color: var(--neb-text-muted);
}
footer {
  display: flex;
  justify-content: space-between;

  span {
    font-size: var(--text-sm);
    color: var(--neb-text-muted);
    font-weight: 500;
  }
}
</style>
