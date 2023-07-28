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
    scss: true,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@nebula/modules/stylesheets/colors.scss" as *; @use "@nebula/assets/tokens.scss" as *;',
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
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    'nuxt-icon',
  ],
  googleFonts: {
    download: true,
    families: {
      Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
})
