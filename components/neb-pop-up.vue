<script lang="ts" setup>
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <teleport v-if="modelValue" to="body">
    <div class="neb-pop-up-component">
      <div class="content-wrapper">
        <slot />
      </div>

      <div class="topper" @click="$emit('update:modelValue', false)" />
    </div>
  </teleport>
</template>

<style scoped>
.neb-pop-up-component {
  position: fixed;
  z-index: 100;

  .content-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  .topper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(var(--neutral-color-component-200), 0.8);
    z-index: 1;
    display: none;
  }
}
</style>

<style lang="scss">
.neb-pop-up-component:last-child {
  .topper {
    display: block !important;
  }
}
</style>
