type RefElement = Ref<Element | null>

export function useNebCompact(container: RefElement, target: RefElement) {
  const compactMode = ref(false)
  let observer: null | ResizeObserver = null

  onMounted(() => startTargetObserver())
  onBeforeUnmount(() => {
    if (observer)
      observer.disconnect()
  })

  function startTargetObserver() {
    observer = new ResizeObserver(debounce(() => {
      if (target.value!.clientWidth === target.value!.scrollWidth)
        return

      observer!.disconnect()
      compactMode.value = true

      const missingFromTargetWidth = target.value!.scrollWidth - target.value!.clientWidth
      const minContainerWidth = container.value!.clientWidth + missingFromTargetWidth
      startContainerObserver(minContainerWidth)
    }))

    observer.observe(target.value!)
  }

  function startContainerObserver(minContainerWidth: number) {
    observer = new ResizeObserver(debounce(() => {
      if (container.value!.clientWidth <= minContainerWidth)
        return

      observer!.disconnect()
      compactMode.value = false
      nextTick(() => startTargetObserver())
    }))

    observer.observe(container.value!)
  }

  return compactMode
}

function debounce(callback: any) {
  const { nebula } = useAppConfig()

  const delay = nebula.nebFlex.debounce.delay
  const maxWait = nebula.nebFlex.debounce.maxWait

  return useDebounceFn(callback, delay, { maxWait })
}
