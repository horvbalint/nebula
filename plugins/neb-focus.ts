export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('neb-focus', {
    created(el: HTMLElement, { value }) {
      if (value)
        el.focus()
    },
    updated(el: HTMLElement, { value, oldValue }) {
      if (!value || value === oldValue)
        return

      el.focus()
    },
  })
})
