<script setup lang="ts">
interface Option {
  icon?: string
  text?: string
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

const radioNode = ref<HTMLInputElement[]>([])
</script>

<template>
  <neb-button-group>
    <neb-button
      v-for="(option, index) in options"
      :key="index"
      class="button"
      :type="getButtonType(option)"
      @click="radioNode[index].click()"
    >
      <input ref="radioNode" v-model="modelValue" tabindex="-1" :value="option.value" type="radio" class="radio">

      <icon v-if="option.icon" :name="option.icon" />
      {{ option.text }}
    </neb-button>
  </neb-button-group>
</template>

<style scoped>
.button {
  position: relative;
}
.icon {
  width: 20px;
  height: 20px;
}
input {
  display: none;
}
</style>
