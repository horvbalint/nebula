<script setup lang="ts">
import type { MaybeFile } from '@nebula/composables/neb-file'

const props = withDefaults(defineProps<{
  modelValue: MaybeFile[]
  required?: boolean
  label?: string
  accept?: string[]
  maxSize?: number
  maxCount?: number
}>(), {
  required: false,
  multiple: false,
})

const { files, open, reset, onChange } = useFileDialog()

const formattedAccept = computed(() => {
  if (!props.accept)
    return null

  return props.accept
    .map(type => type.split('/')[1].toUpperCase())
    .filter(type => type !== '*')
    .join(', ')
})

const formattedMaxSize = computed(() => {
  if (!props.maxSize)
    return null

  return nebBytesToSize(props.maxSize)
})
</script>

<template>
  <div class="neb-file-picker">
    <label v-if="label">{{ label }}<span v-if="$props.required" class="required-star">*</span></label>

    <div class="picker">
      <neb-button type="secondary-neutral" square @click="open()">
        <icon name="material-symbols:upload-rounded" />
      </neb-button>

      <div class="text">
        <div class="description">
          <neb-button type="link" @click="open()">
            Kattints
          </neb-button>

          <p>a feltöltéshez, vagy húzd ide a fájlokat.</p>
        </div>

        <p v-if="accept || maxSize" class="info">
          <template v-if="accept">
            {{ formattedAccept }}
          </template>

          <template v-if="maxSize">
            (max: {{ formattedMaxSize }})
          </template>
        </p>
      </div>
    </div>

    <div class="files">
      <neb-file-item
        v-for="(file, index) in modelValue"
        :key="`${file.name} - ${index}`"
        :file="file"
        remove
        download
      />
    </div>
  </div>
</template>

<style scoped>
.neb-file-picker {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-color-800);
}
.required-star {
  margin-left: var(--space-1);
  color: var(--error-color-500);
}
.picker {
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  padding: var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}
.text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  text-align: center;
  color: var(--neutral-color-600);
}
.description {
  display: flex;
  gap: var(--space-1);
}

.dark-mode {
  label {
    color: var(--neutral-color-300);
  }
  .picker {
    border: 1px solid var(--neutral-color-700);
  }
  .text {
    color: var(--neutral-color-400);
  }
}
</style>
