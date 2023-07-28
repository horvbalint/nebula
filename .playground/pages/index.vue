<script setup lang="ts">
definePageMeta({
  name: 'Fő oldal',
})

const input = ref('')
const checkbox = ref(false)
</script>

<template>
  <h1>Nebula</h1>

  <neb-input disabled required v-model="input" label="Test input" placeholder="Write here..." />
  <neb-checkbox v-model="checkbox" label="Test checkbox" />

  <div class="buttons">
    <neb-button>Primary</neb-button>
  </div>
</template>

<style scoped lang="scss">
h1 {
  color: $primary-color;
}
.buttons {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: $space-s;
}
</style>
