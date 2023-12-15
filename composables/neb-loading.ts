interface LoadingProps {
  loading: boolean
}

export function useNebLoading(props: LoadingProps, init: () => void) {
  if (!props.loading)
    init()
  else
    watchOnce(() => props.loading, () => init())
}
