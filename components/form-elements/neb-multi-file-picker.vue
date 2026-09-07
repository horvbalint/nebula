<script setup lang="ts">
const props = withDefaults(defineProps<{
  required?: boolean
  label?: string
  accept?: string[]
  maxSize?: number
  maxCount?: number
  disabled?: boolean
}>(), {
  required: false,
  disabled: false,
})

const modelValue = defineModel<MaybeFile[] | File[]>({
  default: () => [],
})

const isDraging = ref(false)

const formattedAccept = computed(() => {
  if (!props.accept)
    return null

  return props.accept
    .map(type => type.split('/')[1]!.toUpperCase())
    .filter(type => type !== '*')
    .join(', ')
})

const formattedMaxSize = computed(() => {
  if (!props.maxSize)
    return null

  return nebFormatByteSize(props.maxSize)
})

const { open, onChange, reset } = useFileDialog(({ multiple: true }))
onChange((files) => {
  if (files)
    modelValue.value.push(...files)

  reset()
})

function handleDrop(event: DragEvent) {
  isDraging.value = false

  if (event.dataTransfer)
    modelValue.value.push(...event.dataTransfer.files)
}

function handleRemove(index: number) {
  modelValue.value.splice(index, 1)
}

const fileLists = computed(() => ({
  files: modelValue.value.filter(file => file instanceof File) as File[],
  fileDescriptors: modelValue.value.filter(file => !(file instanceof File)),
}))
</script>

<template>
  <div class="neb-file-picker" :class="{ disabled, 'is-draging': isDraging }">
    <label v-if="label">{{ label }}<span v-if="$props.required" class="required-star">*</span></label>

    <div
      class="picker-area"
      @dragover.prevent="isDraging = true"
      @dragleave.prevent="isDraging = false"
      @drop.prevent="handleDrop($event)"
    >
      <neb-button type="secondary" intent="neutral" square :disabled="disabled" @click="open()">
        <icon name="material-symbols:upload-rounded" />
      </neb-button>

      <div class="text">
        <div class="description">
          <neb-button type="link" :disabled="disabled" @click="open()">
            {{ $t('nebula.multi-file-picker.click') }}
          </neb-button>

          <p>{{ $t('nebula.multi-file-picker.drag') }}</p>
        </div>

        <p v-if="accept || maxSize" class="info">
          <template v-if="accept">
            {{ formattedAccept }}
          </template>

          <template v-if="maxSize">
            (max. {{ formattedMaxSize }})
          </template>
        </p>
      </div>
    </div>

    <div class="selected-files">
      <neb-file-item
        v-for="(file, index) in fileLists.files"
        :key="`${file.name} - ${index}`"
        :file="file"
        @remove="handleRemove(index)"
        @download="nebDownloadFile(file)"
      />

      <neb-file-item
        v-for="(file, index) in fileLists.fileDescriptors"
        :key="`${file.name} - ${index}`"
        :file="file"
        @remove="handleRemove(index)"
      />
    </div>
  </div>
</template>

<style scoped>
.neb-file-picker {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  &.disabled .picker-area {
    background: var(--neb-bg-disabled);
  }
  &.is-draging .picker-area {
    outline: 2px solid var(--neb-text-primary);
  }
}
label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neb-text);
}
.required-star {
  margin-left: var(--space-1);
  color: var(--neb-text-error);
}
.picker-area {
  background: var(--neb-bg);
  border: 1px solid var(--neb-border);
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
  color: var(--neb-text-muted);
  font-size: var(--text-sm);
}
.description {
  display: flex;
  gap: var(--space-1);

  p {
    font-size: var(--text-sm);
  }
}
.selected-files {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
</style>
