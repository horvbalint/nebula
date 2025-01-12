export interface ConfirmModal {
  title: string
  description: string
  okText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'danger'
  icon?: string
}

interface OpenModal {
  config: ConfirmModal
  resolve: (value: boolean | PromiseLike<boolean>) => void
}

export function getConfirmModals() {
  return useState<OpenModal[]>('confirmModals', () => [])
}

export function useNebConfirm(config: ConfirmModal): Promise<boolean> {
  return new Promise((resolve) => {
    const modals = getConfirmModals()

    modals.value.push({
      config: {
        type: 'danger',
        icon: 'material-symbols:delete-outline-rounded',
        ...config,
      },
      resolve,
    })
  })
}
