import 'vue-router'

interface NebulaNavSettings {
  name?: string
  skipFromMenu?: boolean
}

declare module 'vue-router' {
  interface RouteMeta {
    nebula?:NebulaNavSettings
  }
}

declare module '#app' {
  interface PageMeta {
    nebula?: NebulaNavSettings
  }
}

export {}

