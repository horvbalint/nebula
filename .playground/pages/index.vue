<script setup lang="ts">
const temp = ref('')
</script>

<template>
  <div class="wrapper">
    <neb-wysiwyg-editor v-model="temp" />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--space-10);
  width: 100%;
  height: 100vh;
}
</style>
