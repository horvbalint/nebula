<script setup lang="ts">
import type { MaybeFile } from '@nebula/composables/neb-file'

const props = defineProps<{
  file: MaybeFile
  onRemove?: ($event: MaybeFile) => void
  onDownload?: ($event: MaybeFile) => void
}>()

defineEmits(['remove', 'download'])

const formattedFileSize = computed(() => nebBytesToSize(props.file.size))
const isImage = computed(() => props.file.type.startsWith('image/'))
const imageUrl = computed(() => {
  if (!isImage.value || !(props.file instanceof File))
    return null
  else
    return URL.createObjectURL(props.file)
})
</script>

<template>
  <div class="neb-file-item">
    <img v-if="imageUrl" class="preview-image" :src="imageUrl">

    <div class="right-side">
      <div class="file-info">
        <icon v-if="!imageUrl" name="material-symbols:docs-outline" />

        <div class="file-text">
          <p>{{ file.name }}</p>
          <span>{{ formattedFileSize }}</span>
        </div>
      </div>

      <div class="actions">
        <neb-button v-if="props.onDownload" type="tertiary-neutral" small square @click="props.onDownload(file)">
          <icon name="material-symbols:download-rounded" />
        </neb-button>

        <neb-button v-if="props.onRemove" type="tertiary-neutral" small square @click="props.onRemove(file)">
          <icon name="material-symbols:delete-outline-rounded" />
        </neb-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neb-file-item {
  overflow: hidden;
  display: flex;
  align-items: stretch;
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  background: #fff;
  height: fit-content;
}
.right-side {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
}
.preview-image {
  width: 50px;
  object-fit: cover;
}
.file-info {
  flex: 1;
  display: flex;
  align-items: start;
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
.actions {
  display: flex;
  gap: var(--space-1);

  .icon {
    cursor: pointer;
  }
}

.dark-mode {
  .neb-file-item {
    border: 1px solid var(--neutral-color-700);
    background: var(--neutral-color-950);
  }
  .file-text {
    p {
      color: var(--neutral-color-300);
    }
    span {
      color: var(--neutral-color-400);
    }
  }
}
</style>
