export interface NebToastAction {
  text: string
  callback: () => void
}

export interface NebToast {
  type: 'neutral' | 'info' | 'success' | 'warning' | 'error'
  title: string
  description?: string
  timeout?: number
  actions?: NebToastAction[]
}

interface NebToastFull extends NebToast {
  actions: NebToastAction[]
}

export function useNebToasts() {
  return useState('nebToasts', () => [] as NebToastFull[])
}

export function useNebToast(toast: NebToast) {
  const toasts = useNebToasts()

  if (!toast.actions)
    toast.actions = []

  if (toast.type !== 'error')
    toast.timeout = 5000

  toasts.value.push(toast as NebToastFull)
}
