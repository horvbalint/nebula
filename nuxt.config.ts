import { createResolver } from '@nuxt/kit'

import PostCssNested from 'postcss-nested'
import PostCssCustomMedia from 'postcss-custom-media'
import PostcssGlobalData from '@csstools/postcss-global-data'

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
          PostcssGlobalData({
            files: [
              './assets/viewports.css',
            ],
          }),
          PostCssNested,
          PostCssCustomMedia,
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
  ],
  googleFonts: {
    download: true,
    families: {
      Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
})
