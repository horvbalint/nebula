<template>
  <div>
    <NuxtPage/>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  nebula: {
    name: 'Nested 2',
    skipFromMenu: true,
    icon: 'svg-spinners:blocks-wave'
  }
})
</script>