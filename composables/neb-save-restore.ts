export interface NebSaveRestoreProps {
  enableSaveRestore?: boolean
  saveKey?: string
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

  const fullSaveKey = `${props.saveKey}-${name}`

  // Load saved state from localStorage
  const savedState = localStorage.getItem(fullSaveKey)
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

  // Watch for changes and save to localStorage
  watch(
    () => refsObject,
    () => {
      const stateToSave: Record<string, any> = {}
      for (const key in refsObject) {
        stateToSave[key] = refsObject[key]!.value
      }
      try {
        localStorage.setItem(fullSaveKey, JSON.stringify(stateToSave))
      }
      catch (e) {
        console.error('Failed to save state:', e)
      }
    },
    { deep: true },
  )
}
