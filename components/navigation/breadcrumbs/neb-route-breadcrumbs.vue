<script lang="ts" setup>
import type { NebulaNavSettings } from '@nebula/global'
import type { Breadcrumb } from './neb-breadcrumbs.vue'

const props = withDefaults(defineProps<{
  withIcons?: boolean
}>(), {
  withIcons: false,
})

const routeCrumbs = computed(() => {
  const routes = useRoute().matched

  return routes.map((route) => {
    const config: NebulaNavSettings = route.meta.nebula || {}

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
