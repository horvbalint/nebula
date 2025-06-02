import type { Route } from '@nebula/components/navigation/header-nav/neb-header-nav.vue'

export function generateNavTree() {
  const router = useRouter()

  return router.getRoutes()
    .filter((route) => {
      const navSettings = route.meta.nebula || {}
      return !!route.name && !navSettings.skipFromMenu
    })
    .map((route) => {
      const navSettings = route.meta.nebula || {}

      return {
        path: route.path,
        name: navSettings.name || route.name?.toString() || '',
        group: navSettings.group,
      }
    })
}

export function useRouteGrouping(routes: Route[]) {
  return computed(() => {
    const groups: Record<string, Route[]> = {}
    const ungrouped: Route[] = []

    for (const route of routes) {
      if (route.group) {
        if (!groups[route.group])
          groups[route.group] = []

        groups[route.group].push(route)
      }
      else {
        ungrouped.push(route)
      }
    }

    return {
      groups,
      ungrouped,
      groupNames: Object.keys(groups),
    }
  })
}
