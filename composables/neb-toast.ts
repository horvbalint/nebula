export interface NebToastAction {
  text: string
  callback: () => void
}

export interface NebToastParams {
  type: 'neutral' | 'info' | 'success' | 'warning' | 'error'
  title: string
  description?: string
  timeout?: number | null
  actions?: NebToastAction[]
}

let toastId = 0

export class NebToast {
  id: number
  type: NebToastParams['type']
  title: string
  description?: string
  actions: NebToastAction[]
  timeout?: {
    duration: number
    lastTickAt: number
    paused: boolean
    progress: number
  }

  constructor(toast: NebToastParams) {
    this.id = toastId++
    this.type = toast.type
    this.title = toast.title
    this.description = toast.description
    this.actions = toast.actions || []

    if (toast.timeout === undefined && toast.type !== 'error')
      toast.timeout = 5000

    if (toast.timeout) {
      this.timeout = reactive({
        duration: toast.timeout,
        lastTickAt: 0,
        paused: false,
        progress: 0,
      })

      this.resume()
    }
  }

  resume() {
    if (!this.timeout)
      return

    if (this.timeout.progress === 1)
      return

    this.timeout.paused = false
    this.timeout.lastTickAt = performance.now()

    this.loop()
  }

  pause() {
    if (!this.timeout)
      return

    this.timeout.paused = true
  }

  private loop() {
    if (!this.timeout)
      throw new Error('NebToast: error during timeout loop, timeout was removed.')

    const currentMs = performance.now()
    const elapsedMs = currentMs - this.timeout.lastTickAt
    const elapsedProgress = elapsedMs / this.timeout.duration

    this.timeout.progress = Math.min(this.timeout.progress + elapsedProgress, 1)
    this.timeout.lastTickAt = currentMs

    if (this.timeout.progress === 1)
      this.destroy()
    else if (!this.timeout.paused)
      requestAnimationFrame(this.loop.bind(this))
  }

  destroy() {
    const toasts = useNebToasts()

    const index = toasts.value.findIndex(t => t.id === this.id)
    if (index !== -1)
      toasts.value.splice(index, 1)
  }
}

export function useNebToasts() {
  return useState('nebToasts', () => [] as NebToast[])
}

export function useNebToast(toastParams: NebToastParams) {
  const toasts = useNebToasts()

  const toast = new NebToast(toastParams)
  toasts.value.push(toast)

  return toast
}
