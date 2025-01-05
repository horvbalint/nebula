import type { AsyncDataRequestStatus } from '#app'

export function nebCombineStatuses(...statuses: Ref<AsyncDataRequestStatus>[]) {
  return computed(() => {
    for (const status of statuses) {
      if (status.value === 'idle')
        return 'idle'

      if (status.value === 'pending')
        return 'pending'

      if (status.value === 'error')
        return 'error'
    }

    return 'success'
  })
}
