<script lang="ts" setup>
defineProps<{
  triggerText: string
  active: boolean
}>()

const isExpanded = ref(false)
const { isMobile } = useAppBreakpoints()
</script>

<template>
  <div class="neb-header-nav-expand-items">
    <neb-button class="trigger" :type="active ? 'tertiary' : 'tertiary-neutral'" :full-width="isMobile" @click="isExpanded = !isExpanded">
      <icon name="material-symbols:keyboard-arrow-down-rounded" />

      {{ triggerText }}
    </neb-button>

    <div v-neb-expand="isExpanded" class="sub-menu-list">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.trigger {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.neb-header-nav-expand-items {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.sub-menu-list {
  padding-left: var(--space-4);
}
</style>
