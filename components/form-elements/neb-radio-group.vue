<script setup lang="ts">
interface Option {
  text: string
  value: unknown
}

defineProps<{
  options: Option[]
}>()

const modelValue = defineModel<unknown>({
  required: true,
})

function getButtonType(option: Option) {
  if (option.value === modelValue.value)
    return 'secondary'
  else
    return 'secondary-neutral'
}
</script>

<template>
  <neb-button-group>
    <neb-button
      v-for="(option, index) in options"
      :key="index"
      class="button"
      :type="getButtonType(option)"
    >
      <input v-model="modelValue" :value="option.value" type="radio" class="radio">
      {{ option.text }}
    </neb-button>
  </neb-button-group>
</template>

<style scoped>
.button {
  position: relative;
}

input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  cursor: pointer;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
}
</style>
