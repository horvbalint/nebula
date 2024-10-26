export default defineAppConfig({
  nebula: {
    nebCompact: {
      debounce: {
        delay: 100,
        maxWait: 200,
      },
    },
    homePath: '/',
  },
  icon: {
    size: '24px',
    class: 'icon',
  },
})

// declare module '@nuxt/schema' {
//   interface AppConfigInput {
//     nebula?: {
//     }
//   }
// }
