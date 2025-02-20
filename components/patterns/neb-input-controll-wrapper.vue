<script lang="ts" setup>
withDefaults(defineProps<{
  required?: boolean
  label?: string
  vertical?: boolean
}>(), {
  required: false,
  vertical: false,
})
</script>

<template>
  <div class="neb-input-controll-wrapper">
    <label>{{ label }} <span v-if="$props.required" class="required-star">*</span></label>

    <div class="controlls" :class="{ vertical }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.neb-input-controll-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--neutral-color-800);
  }
}
.controlls {
  display: flex;
  align-items: center;
  gap: var(--space-3);

  &.vertical {
    align-items: flex-start;
    flex-direction: column;
  }
}
.required-star {
  color: var(--error-color-500);
}
</style>
