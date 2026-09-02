<script lang="ts" setup>
import type { Props } from '../avatar/neb-avatar.vue'

defineProps<{
  avatar?: Props
  title?: string
  text?: string
}>()
</script>

<template>
  <div class="neb-avatar-card">
    <neb-avatar v-bind="$props.avatar" />

    <div class="texts">
      <h6>{{ title }}</h6>
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<style scoped>
.neb-avatar-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.texts {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  h6 {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--neb-text);
    width: fit-content;
  }
  p {
    font-size: var(--text-sm);
    font-weight: 400;
    color: var(--neb-text-subtle);
    width: fit-content;
  }
}
</style>
