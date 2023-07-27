<script setup lang="ts">
const input = ref('')
const checkbox = ref(false)
</script>

<template>
  <h1>Nebula</h1>

  <n-input v-model="input" label="Test input" placeholder="Write here..." />
  <n-checkbox v-model="checkbox" label="Test checkbox" />
  <n-button>Submit</n-button>
</template>

<style scoped lang="scss">
h1 {
  color: $primary-color;
}
</style>
