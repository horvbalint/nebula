import postcssGlobalData from '@csstools/postcss-global-data'
import { createResolver } from '@nuxt/kit'

import postcssPresetEnv from 'postcss-preset-env'

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
  nebula: {
    primaryColor: '#7c4ddb',
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
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    'nuxt-typed-router',
  ],
  icon: {
    customCollections: [
      {
        prefix: 'nebula',
        dir: resolve('./assets/icons/nebula'),
      },
    ],
  },

  // typescript: {
  //   typeCheck: true,
  // },
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json',
      },
      {
        code: 'hu',
        file: 'hu.json',
      },
    ],
    strategy: 'no_prefix',
  },

  compatibilityDate: '2024-08-15',
})
