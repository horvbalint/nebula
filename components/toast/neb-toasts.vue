<script setup lang="ts">
const toasts = useNebToasts()
</script>

<template>
  <div class="neb-toasts">
    <transition-group name="toast-list">
      <neb-toast
        v-for="toast in toasts"
        :key="toast"
        class="toast-move"
        :type="toast.type"
        :title="toast.title"
        :description="toast.description"
        :progress="toast.timeout?.progress"
        :actions="toast.actions"
        @close="toast.destroy()"
        @mouseenter="toast.pause()"
        @mouseleave="toast.resume()"
      />
    </transition-group>
  </div>
</template>

<style scoped>
.neb-toasts {
  position: fixed;
  bottom: var(--space-6);
  left: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
</style>
