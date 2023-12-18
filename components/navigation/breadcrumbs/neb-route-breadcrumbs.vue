<script lang="ts" setup>
import type { Breadcrumb } from './neb-breadcrumbs.vue'

const props = withDefaults(defineProps<{
  withIcons?: boolean
}>(), {
  withIcons: false,
})

const routeCrumbs = computed(() => {
  const routes = useRoute().matched

  return routes.map((route) => {
    const config = route.meta.nebula || {}

    const crumb: Breadcrumb = { text: config.name!, id: route.path }

    if (props.withIcons)
      crumb.icon = config.icon

    return crumb
  })
})
</script>

<template>
  <neb-breadcrumbs :crumbs="routeCrumbs" @click="navigateTo($event as string)" />
</template>

<style scoped>
</style>
