<script setup lang="ts">
const toasts = useNebToasts()

function removeToast(index: number) {
  toasts.value.splice(index, 1)
}
</script>

<template>
  <div class="neb-toasts">
    <neb-toast
      v-for="(toast, index) in toasts"
      :key="toast.title"
      :type="toast.type"
      :title="toast.title"
      :description="toast.description"
      :progress="toast.controlls?.progress"
      :actions="toast.actions"
      @close="removeToast(index)"
      @mouseenter="toast.controlls?.pause()"
      @mouseleave="toast.controlls?.resume()"
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
