import 'vue-router'

export type NebSaveRestoreStorage = 'local' | 'session'

export interface NebulaNavSettings {
  name?: string
  skipFromMenu?: boolean
  icon?: string
  group?: string
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
