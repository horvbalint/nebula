<script setup lang="ts">
defineProps<{
  errors: (keyof ValidityState)[]
}>()
</script>

<template>
  <ul v-if="errors.length" class="error-list">
    <li v-for="error in errors" :key="error">
      {{ $t(`nebula.error-list.${error}`) }}
    </li>
  </ul>
</template>

<style scoped>
.error-list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  & li {
    color: var(--neb-text-error);
    font: var(--neb-font-hint);
    margin-left: var(--space-4);
  }
}
</style>
