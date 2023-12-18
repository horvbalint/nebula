import { createResolver } from '@nuxt/kit'
import postcssPresetEnv from 'postcss-preset-env'

// @ts-expect-error - the package has no declaration file or @types package
import postcssGlobalData from '@csstools/postcss-global-data'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  alias: {
    '@nebula': resolve('./'),
  },
  modulesDir: [
    'node_modules',
    resolve('./node_modules'),
  ],
  css: [
    '@nebula/assets/main.css',
    '@nebula/assets/tokens.css',
  ],
  plugins: [
    '@nebula/plugins/neb-expand',
    '@nebula/plugins/neb-blur',
    '@nebula/plugins/vueuse-components',
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
              resolve('./assets/viewports.css'),
            ],
          }),
          postcssPresetEnv,
        ],
      },
    },
    vue: {
      script: {
        defineModel: true,
      },
    },
  },
  components: {
    dirs: [
      {
        path: '@nebula/components',
        pathPrefix: false,
        global: true,
      },
    ],
  },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    'nuxt-icon',
    '@vueuse/nuxt',
    'nuxt-icons',
  ],
  googleFonts: {
    download: true,
    families: {
      Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
  // typescript: {
  //   typeCheck: true,
  // },
})
