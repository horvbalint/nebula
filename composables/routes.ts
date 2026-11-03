import type { NebulaNavSettings } from '@nebula/global'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/** A navigation entry, as rendered by `neb-header-nav` and `neb-side-nav`. */
export interface Route {
  name: string
  path: string
  subRoutes?: Route[]
  icon?: string
  group?: string
}

export function generateNavTree(): Route[] {
  const router = useRouter()

  return router.getRoutes()
    .filter((route) => {
      const navSettings: NebulaNavSettings = route.meta.nebula || {}
      return !!route.name && !navSettings.skipFromMenu
    })
    .map((route) => {
      const navSettings: NebulaNavSettings = route.meta.nebula || {}

      return {
        path: route.path,
        name: navSettings.name || route.name?.toString() || '',
        icon: navSettings.icon,
        group: navSettings.group,
      }
    })
}

export function useRouteGrouping(routes: MaybeRefOrGetter<Route[]>) {
  return computed(() => {
    const groups: Record<string, Route[]> = {}
    const ungrouped: Route[] = []

    for (const route of toValue(routes)) {
      if (route.group) {
        if (!groups[route.group])
          groups[route.group] = []

        groups[route.group]!.push(route)
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

function normalizeRoutePath(path: string) {
  return path.replace(/\/+$/, '') || '/'
}

function isRoutePathPrefix(prefix: string, path: string) {
  return path === prefix || path.startsWith(prefix === '/' ? '/' : `${prefix}/`)
}

/**
 * Returns the path of the leaf route the current path belongs to. The longest
 * matching prefix wins, so `/admin` and `/admin/users` can both be menu items
 * without `/admin/users/12` lighting up both.
 */
export function findActiveRoutePath(routes: Route[], currentPath: string): string | null {
  const path = normalizeRoutePath(currentPath)
  let best: string | null = null

  for (const route of routes) {
    const candidate = route.subRoutes?.length
      ? findActiveRoutePath(route.subRoutes, path)
      : normalizeRoutePath(route.path)

    if (candidate && isRoutePathPrefix(candidate, path) && candidate.length > (best?.length ?? -1))
      best = candidate
  }

  return best
}

export function isActiveRoute(route: Route, activePath: string | null) {
  return !!activePath && normalizeRoutePath(route.path) === activePath
}

export function routeContainsActive(route: Route, activePath: string | null): boolean {
  return !!route.subRoutes?.some(r => isActiveRoute(r, activePath) || routeContainsActive(r, activePath))
}
