export default defineAppConfig({
  nebula: {
    nebFlex: {
      debounce: {
        delay: 100,
        maxWait: 200,
      },
    },
    homePath: '/',
  },
  nuxtIcon: {
    size: '24px',
  },
})

// declare module '@nuxt/schema' {
//   interface AppConfigInput {
//     nebula?: {
//     }
//   }
// }
