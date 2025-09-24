type Id = string

const expandIds = new Set<Id>()
const callbacks = new Map<Id, () => void>()

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('neb-expand', {
    created(el: HTMLElement, { value }) {
      if (!value) {
        el.style.overflow = 'hidden'
        el.style.height = '0'
        el.style.boxSizing = 'content-box'
      }

      el.dataset.nebExpandId = generateId()
    },
    updated(el: HTMLElement, { value, oldValue }) {
      if (value === oldValue)
        return

      if (callbacks.has(el.dataset.nebExpandId!)) {
        el.removeEventListener('transitionend', callbacks.get(el.dataset.nebExpandId!)!)
        callbacks.delete(el.dataset.nebExpandId!)
      }

      if (!value)
        close(el)
      else
        open(el)
    },
    beforeUnmount(el: HTMLElement) {
      el.removeEventListener('transitionend', callbacks.get(el.dataset.nebExpandId!)!)
    },
  })
})

function open(el: HTMLElement) {
  const backupTransition = el.style.transition

  el.style.transition = 'height .2s'
  el.style.overflow = 'hidden'
  el.style.height = `${el.scrollHeight}px`

  const callback = () => {
    el.style.transition = backupTransition
    el.style.height = 'unset'
    el.style.overflow = 'unset'
  }

  el.addEventListener('transitionend', callback, { once: true })
  callbacks.set(el.dataset.nebExpandId!, callback)
}

function close(el: HTMLElement) {
  const backupTransition = el.style.transition
  el.style.height = `${el.clientHeight}px`

  requestAnimationFrame(() => {
    el.style.transition = 'height .2s'
    el.style.overflow = 'hidden'
    el.style.height = '0'

    const callback = () => el.style.transition = backupTransition
    el.addEventListener('transitionend', callback, { once: true })
    callbacks.set(el.dataset.nebExpandId!, callback)
  })
}

function generateId(): Id {
  const id = Math.random().toString()

  if (expandIds.has(id))
    return generateId()

  expandIds.add(id)
  return id
}
