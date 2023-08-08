import { createResolver } from '@nuxt/kit'
import postcssPresetEnv from 'postcss-preset-env'
import postcssGlobalData from '@csstools/postcss-global-data'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  alias: {
    '@nebula': resolve('./'),
  },
  css: [
    '@nebula/assets/main.css',
    '@nebula/assets/tokens.css',
  ],
  plugins: [
    '@nebula/plugins/neb-expand',
    '@nebula/plugins/neb-blur',
  ],
  nebula: {
    primaryColor: '#9E77ED',
    neutralColor: '#667085',
    errorColor: '#F04438',
    warningColor: '#F79009',
    successColor: '#17B26A',
  },
  vite: {
    css: {
      postcss: {
        plugins: [
          postcssGlobalData({
            files: [
              './assets/viewports.css',
            ],
          }),
          postcssPresetEnv,
        ],
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
    '@vueuse/nuxt',
  ],
  googleFonts: {
    families: {
      Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
})
