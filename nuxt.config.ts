import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  alias: {
    '@nebula': resolve('./'),
  },
  css: [
    '@nebula/assets/main.scss',
  ],
  nebula: {
    primaryColor: '#9E77ED',
    neutralColor: '#667085',
    errorColor: '#F04438',
    warningColor: '#F79009',
    successColor: '#17B26A',
    colorResolution: 25,
    scss: true,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@nebula/modules/runtime/colors.scss" as *; @use "@nebula/assets/tokens.scss" as *;',
        },
      },
    },
  },
  components: {
    dirs: [
      {
        path: '@nebula/components',
        pathPrefix: false,
      },
    ],
  },
  googleFonts: {
    families: {
      Roboto: true,
    },
  },
})
