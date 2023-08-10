<script setup lang="ts">
const toasts = useNebToasts()
</script>

<template>
  <div class="neb-toasts">
    <neb-toast
      v-for="toast in toasts"
      :key="toast.title"
      :type="toast.type"
      :title="toast.title"
      :description="toast.description"
      :progress="toast.timeout?.progress"
      :actions="toast.actions"
      @close="toast.destroy()"
      @mouseenter="toast.pause()"
      @mouseleave="toast.resume()"
    />
  </div>
</template>

<style scoped>
.neb-toasts {
  position: fixed;
  bottom: var(--space-6);
  left: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>
