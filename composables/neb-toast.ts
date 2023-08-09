export interface NebToastAction {
  text: string
  callback: () => void
}

export interface NebToastParams {
  type: 'neutral' | 'info' | 'success' | 'warning' | 'error'
  title: string
  description?: string
  timeout?: number
  actions?: NebToastAction[]
}

export interface NebToast extends NebToastParams {
  id: number
  actions: NebToastAction[]
  controlls?: {
    duration: number
    lastTickAt: number
    paused: boolean
    progress: Ref<number>
    pause: () => void
    resume: () => void
    loop: () => void
  }
}

let toastId = 0

export function useNebToasts() {
  return useState('nebToasts', () => [] as NebToast[])
}

export function useNebToast(toastParams: NebToastParams) {
  const toasts = useNebToasts()

  if (toastParams.type !== 'error')
    toastParams.timeout = 5000

  const toast = {
    ...toastParams,
    id: toastId++,
    actions: toastParams.actions || [],
  } as NebToast

  if (toastParams.timeout) {
    addTimeoutLogic(toast, toastParams.timeout)
    toast.controlls!.resume()
  }

  toasts.value.push(toast)
}

function addTimeoutLogic(toast: NebToast, timeout: number) {
  toast.controlls = {
    duration: timeout,
    lastTickAt: 0,
    paused: false,
    progress: ref(0),
    resume: () => {
      if (!toast.controlls)
        throw new Error('"resume" cannot be called on NebToast that was created without the "timeout" parameter')

      if (toast.controlls.progress.value === 1)
        return

      toast.controlls.paused = false
      toast.controlls.lastTickAt = performance.now()

      toast.controlls.loop()
    },
    pause: () => {
      if (!toast.controlls)
        throw new Error('"pause" cannot be called on NebToast that was created without the "timeout" parameter')

      toast.controlls.paused = true
    },
    loop: () => {
      if (!toast.controlls)
        throw new Error('NebToast: error during timeout loop, timeout was removed.')

      const currentMs = performance.now()
      const elapsedMs = currentMs - toast.controlls.lastTickAt
      const elapsedProgress = elapsedMs / toast.controlls.duration

      toast.controlls.progress.value = Math.min(toast.controlls.progress.value + elapsedProgress, 1)
      toast.controlls.lastTickAt = currentMs

      if (!toast.controlls.paused && toast.controlls.progress.value !== 1)
        requestAnimationFrame(toast.controlls.loop.bind(toast))
    },
  }
}
