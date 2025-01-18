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

const emit = defineEmits(['update:modelValue'])
const isDraging = ref(false)

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

  return nebFormatByteSize(props.maxSize)
})

const selectedFiles = ref<File[]>([])

const { open, onChange, reset } = useFileDialog(({ multiple: true }))
onChange((files) => {
  if (files)
    selectedFiles.value.push(...files)

  reset()
})

function handleDrop(event: DragEvent) {
  isDraging.value = false

  if (event.dataTransfer)
    selectedFiles.value.push(...event.dataTransfer.files)
}

function handleRemove(index: number) {
  selectedFiles.value.splice(index, 1)
}

watch(
  selectedFiles,
  () => emit('update:modelValue', [...selectedFiles.value]),
  { deep: true },
)
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
      <neb-button type="secondary-neutral" square :disabled="disabled" @click="open()">
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
        v-for="(file, index) in selectedFiles"
        :key="`${file.name} - ${index}`"
        :file="file"
        @remove="handleRemove(index)"
        @download="nebDownloadFile(file)"
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
    background: var(--neutral-color-50);
  }
  &.is-draging .picker-area {
    outline: 2px solid var(--primary-color);
  }
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
.picker-area {
  background: #fff;
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
