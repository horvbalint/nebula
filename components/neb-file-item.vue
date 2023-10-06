<script setup lang="ts">
import type { MaybeFile } from '@nebula/composables/neb-file'

const props = withDefaults(defineProps<{
  file: MaybeFile
  remove: boolean
  download: boolean
}>(), {
  remove: false,
  download: false,
})

defineEmits(['remove'])

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
      <neb-button v-if="download" type="tertiary-neutral" small square>
        <icon name="material-symbols:download-rounded" />
      </neb-button>

      <neb-button v-if="remove" type="tertiary-neutral" small square @click="$emit('remove')">
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
  background: var(--white-color);
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
    background: var(--neutral-color-975);
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
