import type { NebSaveRestoreStorage } from '@nebula/global'

export type { NebSaveRestoreStorage }

export interface NebSaveRestoreProps {
  enableSaveRestore?: boolean
  saveKey?: string
  /**
   * Where to persist the saved state.
   * - `'local'` (default): survives browser restarts (localStorage)
   * - `'session'`: cleared when the browser/tab is closed (sessionStorage)
   *
   * Falls back to `useAppConfig().nebula.nebSaveRestore.storage` when omitted.
   */
  saveRestoreStorage?: NebSaveRestoreStorage
}

type Validators<T extends Record<string, Ref<any>>> = {
  [K in keyof T]?: (value: T[K]['value']) => boolean
}

export function useNebSaveRestore<T extends Record<string, Ref<any>>>(
  name: string,
  props: NebSaveRestoreProps,
  refsObject: T,
  validators: Validators<T> = {},
): void {
  if (!props.enableSaveRestore || !props.saveKey)
    return

  const configStorage = useAppConfig().nebula?.nebSaveRestore?.storage as NebSaveRestoreStorage | undefined
  const storageMode = props.saveRestoreStorage ?? configStorage
  const storage: Storage = storageMode === 'session'
    ? sessionStorage
    : localStorage

  const fullSaveKey = `${props.saveKey}-${name}`

  // Load saved state from storage
  const savedState = storage.getItem(fullSaveKey)
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState)
      for (const key in refsObject) {
        if (key in parsedState) {
          if (validators[key] && !validators[key](parsedState[key]))
            continue

          refsObject[key]!.value = parsedState[key]
        }
      }
    }
    catch (e) {
      console.error('Failed to parse saved state:', e)
    }
  }

  // Watch for changes and save to storage
  watch(
    () => refsObject,
    () => {
      const stateToSave: Record<string, any> = {}
      for (const key in refsObject) {
        stateToSave[key] = refsObject[key]!.value
      }
      try {
        storage.setItem(fullSaveKey, JSON.stringify(stateToSave))
      }
      catch (e) {
        console.error('Failed to save state:', e)
      }
    },
    { deep: true },
  )
}
