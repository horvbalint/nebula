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
    font: var(--neb-font-label);
    color: var(--neb-text-subtle);
  }
}
hr {
  flex: 1;
  height: 1px;
  background: var(--neb-border-subtle);
  border: none;
}
</style>
