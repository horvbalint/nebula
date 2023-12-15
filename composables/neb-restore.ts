export interface RestoreProps<State> {
  restoreId?: string
  restoreState?: State
  restore?: boolean
}

type RestoreFunction<State> = (state: State) => void
type StoreFunction<State> = () => State

interface Params<State> {
  props: RestoreProps<State>
  store: StoreFunction<State>
  restore: RestoreFunction<State>
}

export function useNebRestore<State>({ props, store, restore }: Params<State>) {
  if (!props.restore)
    return

  load(props, restore)

  if (props.restoreId)
    window.addEventListener('beforeunload', () => save(props.restoreId!, store))
    // onBeforeUnmount(() => save(props.restoreId!, store))
}

function load<State>(props: RestoreProps<State>, restore: RestoreFunction<State>) {
  if (props.restoreState) {
    restore(props.restoreState)
  }
  else {
    const jsonState = localStorage.getItem(props.restoreId!)!
    const state = JSON.parse(jsonState)
    restore(state)
  }
}

function save<State>(id: string, store: StoreFunction<State>) {
  const state = store()
  const jsonState = JSON.stringify(state)
  localStorage.setItem(id, jsonState)
}
