<script lang="ts" setup>
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="neb-content-separator" :class="{ gapped: text || $slots.default }">
    <hr>

    <slot>
      <h6 v-if="text">
        {{ text }}
      </h6>
    </slot>

    <hr>
  </div>
</template>

<style scoped>
.neb-content-separator {
  display: flex;
  align-items: center;

  &.gapped {
    gap: var(--space-2);
  }
  h6 {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--neutral-color-600);
  }
}
hr {
  flex: 1;
  height: 1px;
  background: var(--neutral-color-200);
  border: none;
}

.dark-mode {
  .neb-content-separator h6 {
    color: var(--neutral-color-400);
  }
  hr {
    background: var(--neutral-color-800);
  }
}
</style>
