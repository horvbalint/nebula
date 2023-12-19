import 'vue-router'

interface NebulaNavSettings {
  name?: string
  skipFromMenu?: boolean
  icon?: string
}

declare module 'vue-router' {
  interface RouteMeta {
    nebula?: NebulaNavSettings
  }
}

declare module '#app' {
  interface PageMeta {
    nebula?: NebulaNavSettings
  }
}

export {}
