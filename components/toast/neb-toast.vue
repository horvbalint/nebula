<script setup lang="ts">
import type { NebToast, NebToastAction } from '@nebula/composables/neb-toast'

const props = withDefaults(
  defineProps<NebToast>(), {
    // @ts-expect-error - figure out the type error
    actions: [] as NebToastAction[],
  })

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="neb-toast" :class="props.type">
    <p>{{ props.title }}</p>
    <p>{{ props.description }}</p>

    <div>
      <neb-button type="link" @click="$emit('close')">
        Bezárás
      </neb-button>

      <neb-button
        v-for="action in props.actions"
        :key="action.text"
        type="link"
        @click="action.callback()"
      >
        {{ action.text }}
      </neb-button>
    </div>
  </div>
</template>

<style>
.neb-toast {
  padding: var(--space-4);
  border-radius: var(--radius-default);

  &.info {
    border: 1px solid var(--primary-color);
  }
}

.dark-mode {
  .neb-toast {
    color: var(--neutral-color-300);
  }
}
</style>
