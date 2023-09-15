<template>
  <div>
    <NuxtPage/>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  nebula: {
    name: 'Nested',
    skipFromMenu: false,
    icon: 'svg-spinners:bars-scale'
  }
})
</script>