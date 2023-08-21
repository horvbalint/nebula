<script setup lang="ts">
interface Tab {
  text: string
  icon?: string
  disabled?: boolean
  count?: number
}

const props = withDefaults(defineProps<{
  tabs: Record<string, Tab | string>
  mode?: 'horizontal' | 'vertical'
  fullWidth?: boolean
}>(), {
  mode: 'horizontal',
  fullWidth: false,
})

const modelValue = defineModel()

const computedTabs = computed(() => {
  const tabs: Record<string, Tab> = {}

  for (const key in props.tabs) {
    if (typeof props.tabs[key] === 'string')
      tabs[key] = { text: props.tabs[key] as string }
    else
      tabs[key] = props.tabs[key] as Tab
  }

  return tabs
})
</script>

<template>
  <ul class="neb-tabs">
    <li
      v-for="(tab, key) in computedTabs"
      :key="key"
      :class="{ active: modelValue === key, disabled: tab.disabled }"
    >
      <input v-model="modelValue" type="radio" :value="key">

      <slot :key="key" :tab="tab">
        <icon v-if="tab.icon" :name="tab.icon" />
        <p>{{ tab.text }}</p>
        <span v-if="tab.count">{{ tab.count }}</span>
      </slot>
    </li>
  </ul>
</template>

<style scoped>
li.active {
  color: red;
}
</style>
