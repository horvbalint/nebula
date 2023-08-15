import { vOnClickOutside } from '@vueuse/components'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('on-click-outside', vOnClickOutside)
})
