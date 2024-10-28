<script setup lang="ts">
import type { MaybeFile } from '@nebula/composables/neb-file'

const props = defineProps<{
  file: MaybeFile
  onRemove?: ($event: MaybeFile) => void
  onDownload?: ($event: MaybeFile) => void
}>()

defineEmits(['remove', 'download'])

const formattedFileSize = computed(() => nebBytesToSize(props.file.size))
</script>

<template>
  <div class="neb-file-item">
    <div class="file-info">
      <icon name="material-symbols:docs-outline" />

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
</template>

<style scoped>
.neb-file-item {
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  padding: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  background: #fff;
}
.file-info {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);

  .icon {
    color: var(--neutral-color-400);
  }
}
.file-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  p {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--neutral-color-700);
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
