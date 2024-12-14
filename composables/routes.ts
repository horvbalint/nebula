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
      }
    })
}
