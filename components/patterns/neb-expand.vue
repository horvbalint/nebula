<script setup lang="ts">
const props = defineProps<{ when: boolean }>()
</script>

<template>
  <Transition name="expand" mode="out-in">
    <div v-if="props.when" class="expand-wrapper">
      <div class="expand-content">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.expand-wrapper {
  display: grid;
  grid-template-rows: 1fr;
}
.expand-enter-active,
.expand-leave-active {
  transition: grid-template-rows var(--duration-default) ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  grid-template-rows: 0fr;
}
.expand-content {
  min-height: 0;
}
</style>
