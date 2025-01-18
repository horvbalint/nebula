<script setup lang="ts">
import type { MaybeFile } from '../../composables/neb-file'

const props = defineProps<{
  label?: string
  hint?: string
  required?: boolean
  maxSize?: number
  accept?: string
}>()

const modelValue = defineModel<MaybeFile | File | null>({
  default: null,
})

const singleFilePicker = templateRef('singleFilePicker')
const { errorsToShow, collectErrors } = useNebValidate(singleFilePicker, () => {
  const errors: (keyof ValidityState)[] = []

  if (props.required && !modelValue.value)
    errors.push('valueMissing')

  if (props.maxSize && modelValue.value instanceof File && modelValue.value.size > props.maxSize)
    errors.push('badInput')

  return errors
})

let innerValue = modelValue.value
function emitValue(value: File | null) {
  innerValue = value
  modelValue.value = value
}

const { open, onChange } = useFileDialog({ multiple: false, accept: props.accept })
onChange((files) => {
  if (files?.length)
    emitValue(files[0])
})

watch(modelValue, () => {
  const showErrors = innerValue === modelValue.value
  innerValue = modelValue.value

  collectErrors(showErrors)
})

const formattedMaxSize = computed(() => {
  if (!props.maxSize)
    return null

  return nebFormatByteSize(props.maxSize)
})
</script>

<template>
  <div ref="singleFilePicker" class="single-file-picker">
    <label v-if="$props.label">
      {{ $props.label }}
      <span v-if="props.maxSize">
        ({{ $t('nebula.single-file-picker.maxSize', { size: formattedMaxSize }) }})
      </span>
      <span v-if="$props.required" class="required-star">*</span>
    </label>

    <div v-if="!modelValue" class="empty-picker" @click="open()">
      <div class="file-info">
        <icon name="material-symbols:docs-outline" />

        <div class="file-text">
          <p>{{ $t('nebula.single-file-picker.empty.title') }}</p>
          <span>{{ $t('nebula.single-file-picker.empty.description') }}</span>
        </div>
      </div>

      <neb-button type="tertiary-neutral" small square>
        <icon name="material-symbols:upload-rounded" />
      </neb-button>
    </div>

    <neb-file-item v-else :file="modelValue" @remove="emitValue(null)">
      <template #actions>
        <neb-button
          type="tertiary-neutral"
          small
          square
          @click="open()"
        >
          <icon name="material-symbols:refresh-rounded" />
        </neb-button>
      </template>
    </neb-file-item>

    <p v-if="hint" class="hint">
      {{ $props.hint }}
    </p>

    <neb-error-list :errors="errorsToShow" />
  </div>
</template>

<style scoped>
.single-file-picker {
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
.empty-picker {
  overflow: hidden;
  display: flex;
  align-items: stretch;
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  background: #fff;
  height: 55px;
  padding: var(--space-2) var(--space-4);
}
.file-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-2);

  .icon {
    color: var(--neutral-color-400);
  }
}
.file-text {
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  p {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--neutral-color-700);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span {
    font-size: var(--text-sm);
    color: var(--neutral-color-600);
  }
}
</style>
