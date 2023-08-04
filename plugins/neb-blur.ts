declare global {
  interface MouseEvent {
    nebFromBlurException?: boolean
  }
}

type Id = string
interface BlurState {
  elementHandler: (event: MouseEvent) => void
  windowHandler: (event: MouseEvent) => void
}

const blurIds = new Set<Id>()
const blurStates = new Map<Id, BlurState>()

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('neb-blur', {
    mounted(el: HTMLElement, { value: callback }) {
      const blurState = {
        elementHandler: (event: MouseEvent) => event.nebFromBlurException = true,
        windowHandler: (event: MouseEvent) => {
          if (!event.nebFromBlurException)
            callback()
        },
      }

      el.addEventListener('click', blurState.elementHandler)
      window.addEventListener('click', blurState.windowHandler)

      el.dataset.nebBlurId = generateId()
      blurStates.set(el.dataset.nebBlurId, blurState)
    },
    beforeUnmount(el: HTMLElement) {
      const blurState = blurStates.get(el.dataset.nebBlurId!)!

      el.removeEventListener('click', blurState.elementHandler)
      window.removeEventListener('click', blurState.windowHandler)
    },
  })
})

function generateId(): Id {
  const id = Math.random().toString()

  if (blurIds.has(id))
    return generateId()

  blurIds.add(id)
  return id
}
