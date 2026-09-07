<script setup lang="ts">
const toasts = useNebToasts()
</script>

<template>
  <div class="neb-toasts">
    <transition-group name="toast-list">
      <neb-toast
        v-for="toast in toasts"
        :key="toast.id"
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
  z-index: 101;
  bottom: var(--space-6);
  left: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  /* The stack spans more than the cards themselves once it stretches on
   * mobile, so only the cards should swallow clicks. */
  pointer-events: none;

  /* `neb-toast` keeps a lower, inline-friendly elevation for its static
   * page-element use; the floating stack needs to lift further off the page
   * so it doesn't blend into whatever's rendered behind it. */
  .neb-toast {
    pointer-events: auto;
    width: 380px;
    max-width: 100%;
    box-shadow: var(--neb-shadow-xl);
  }
}

@media (--tablet-viewport) {
  .neb-toasts {
    align-items: stretch;
    padding: 0 var(--space-2) var(--space-2);
    left: 0;
    right: 0;
    bottom: 0;

    .neb-toast {
      width: auto;
    }
    /* A leaving toast is taken out of flow by `.toast-list-leave-active`, which
     * would collapse a stretched, auto-width card mid-animation. */
    .neb-toast.toast-list-leave-active {
      left: var(--space-2);
      right: var(--space-2);
    }
  }
}
</style>
