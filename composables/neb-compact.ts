type RefElement = Ref<Element | ComponentPublicInstance | null>

export function useNebCompact(container: RefElement, target: RefElement) {
  const compactMode = ref(false)
  let observer: null | ResizeObserver = null

  const containerEl = computed(() => getElement(container.value))
  const targetEl = computed(() => getElement(target.value))

  onMounted(() => startTargetObserver())
  onBeforeUnmount(() => {
    if (observer)
      observer.disconnect()
  })

  function startTargetObserver() {
    observer = new ResizeObserver(debounce(() => {
      if (targetEl.value!.clientWidth === targetEl.value!.scrollWidth)
        return

      observer!.disconnect()
      compactMode.value = true

      const missingFromTargetWidth = targetEl.value!.scrollWidth - targetEl.value!.clientWidth
      const minContainerWidth = containerEl.value!.clientWidth + missingFromTargetWidth
      startContainerObserver(minContainerWidth)
    }))

    observer.observe(targetEl.value!)
  }

  function startContainerObserver(minContainerWidth: number) {
    observer = new ResizeObserver(debounce(() => {
      if (containerEl.value!.clientWidth <= minContainerWidth)
        return

      observer!.disconnect()
      compactMode.value = false
      nextTick(() => startTargetObserver())
    }))

    observer.observe(containerEl.value!)
  }

  return compactMode
}

function debounce(callback: any) {
  const { nebula } = useAppConfig()

  const delay = nebula.nebCompact.debounce.delay
  const maxWait = nebula.nebCompact.debounce.maxWait

  return useDebounceFn(callback, delay, { maxWait })
}

function getElement(ref: Element | ComponentPublicInstance | null) {
  if (ref === null)
    return null
  else if ('$el' in ref)
    return ref.$el
  else
    return ref
}
