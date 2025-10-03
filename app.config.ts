export default defineAppConfig({
  nebula: {
    nebCompact: {
      debounce: {
        delay: 20,
        maxWait: 100,
      },
    },
    nebSelect: {
      emptyValue: null,
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
