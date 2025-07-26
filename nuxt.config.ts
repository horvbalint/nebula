import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcssGlobalData from '@csstools/postcss-global-data'
import postcssPresetEnv from 'postcss-preset-env'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  alias: {
    '@nebula': join(currentDir, './'),
  },

  modulesDir: [
    'node_modules',
    join(currentDir, './node_modules'),
  ],

  css: [
    '@nebula/assets/main.css',
    '@nebula/assets/tokens.css',
  ],
  nebula: {
    primaryColor: '#7c4ddb',
    errorColor: '#F04438',
    warningColor: '#F79009',
    successColor: '#198754',
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700, 800],
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        'dayjs',
        'dayjs/plugin/localeData',
        'dayjs/locale/hu',
        'dayjs/plugin/isBetween',
      ],
    },
    css: {
      postcss: {
        plugins: [
          postcssGlobalData({
            files: [
              join(currentDir, './assets/viewports.css'),
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
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    'nuxt-typed-router',
  ],
  icon: {
    customCollections: [
      {
        prefix: 'nebula',
        dir: join(currentDir, './assets/icons/nebula'),
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
})
