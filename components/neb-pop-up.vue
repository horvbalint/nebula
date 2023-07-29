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
      <slot />
    </div>

    <div class="topper" @click="$emit('update:modelValue', false)" />
  </teleport>
</template>

<style lang="scss" scoped>
.neb-pop-up-component {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
}
.topper {
  display: none;
}
</style>

<style lang="scss">
body .topper:last-child {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($neutral-color-200, 0.8);
  z-index: 100;
}
</style>
