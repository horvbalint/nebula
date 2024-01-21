<script setup lang="ts">
</script>

<template>
  <div class="wrapper">
    <neb-toggle size="large" label="Valami van a levegoben"/>
    <neb-toggle label="Valami van a levegoben"/>
    <neb-toggle size="small" label="Valami van a levegoben"/>
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
