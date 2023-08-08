type RefElement = Ref<HTMLElement | null>

export function useNebFlexCompact(container: RefElement, target: RefElement) {
  const compactMode = ref(false)

  onMounted(() => {
    startTargetObserver(compactMode, container, target)
  })

  return compactMode
}

function startTargetObserver(compactMode: Ref<boolean>, container: RefElement, target: RefElement) {
  const targetObserver = new ResizeObserver(debounce(() => {
    if (target.value!.clientWidth === target.value!.scrollWidth)
      return

    targetObserver.disconnect()
    compactMode.value = true

    const missingFromTargetWidth = target.value!.scrollWidth - target.value!.clientWidth
    const minContainerWidth = container.value!.clientWidth + missingFromTargetWidth
    startContainerObserver(minContainerWidth, compactMode, container, target)
  }))

  targetObserver.observe(target.value!)
}

function startContainerObserver(minContainerWidth: number, compactMode: Ref<boolean>, container: RefElement, target: RefElement) {
  const containerObserver = new ResizeObserver(debounce(() => {
    if (container.value!.clientWidth <= minContainerWidth)
      return

    containerObserver.disconnect()
    compactMode.value = false
    nextTick(() => startTargetObserver(compactMode, container, target))
  }))

  containerObserver.observe(container.value!)
}

function debounce(callback: any) {
  const { nebula } = useAppConfig()

  const delay = nebula.nebFlex.debounce.delay
  const maxWait = nebula.nebFlex.debounce.maxWait

  return useDebounceFn(callback, delay, { maxWait })
}
