<script setup lang="ts">
import type { MaybeFile } from '@nebula/composables/neb-file'
import DocumentFile from '@nebula/assets/icons/document-file.svg'

const props = withDefaults(defineProps<{
  file: MaybeFile
  remove: boolean
  download: boolean
}>(), {
  remove: false,
  download: false,
})

const formattedFileSize = computed(() => nebBytesToSize(props.file.size))
</script>

<template>
  <div class="neb-file-item">
    <div class="file-info">
      <img :src="DocumentFile">

      <div class="file-text">
        <p>{{ file.name }}</p>
        <span>{{ formattedFileSize }}</span>
      </div>
    </div>

    <div class="actions">
      <neb-button v-if="download" type="tertiary-neutral" small square>
        <icon name="material-symbols:download-rounded" />
      </neb-button>
      <neb-button v-if="remove" type="tertiary-neutral" small square>
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
}
.file-info {
display: flex;
gap: var(--space-2);
}
.file-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  p {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--neutral-color-800);
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
  }
}
</style>
