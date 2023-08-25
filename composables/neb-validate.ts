type ValidityKey = keyof ValidityState

export interface NebValidatorCallbacks {
  init: (element: HTMLElement) => void
  onValidityChange: (element: HTMLElement, errors: ValidityKey[]) => void
  onDestroy: (element: HTMLElement) => void
}

export const NebValidatorInjectKey = Symbol('nebValidatorInjectKey') as InjectionKey<NebValidatorCallbacks>

export function useNebValidate(
  reference: Ref<HTMLElement | null>,
  collectErrors: (element: HTMLElement) => ValidityKey[],
) {
  const validatorCallbacks = inject(NebValidatorInjectKey, null)
  const errorsToShow = ref([] as ValidityKey[])

  function wrappedCollectErrors(show = true) {
    if (!reference.value)
      throw new Error('useNebValidate: can not validate with "ref" that points "null"!')

    const errors = collectErrors(reference.value)

    if (validatorCallbacks)
      validatorCallbacks.onValidityChange(reference.value, errors)

    if (show || !errors.length)
      errorsToShow.value = errors
  }

  onMounted(() => {
    wrappedCollectErrors(false)

    if (validatorCallbacks) {
      if (reference.value === null)
        throw new Error('useNebValidate: failed to connect to the parent "neb-validator" because the given "ref" points to null')

      validatorCallbacks.init(reference.value)
    }
  })

  return { errorsToShow, collectErrors: wrappedCollectErrors, validatorCallbacks }
}

export function useNebValidateNative(reference: Ref<HTMLFormElement | null>) {
  return useNebValidate(reference, (element) => {
    const errors = [] as ValidityKey[]
    const validity = (element as HTMLFormElement).validity

    for (const key in validity) {
      const typedKey = key as ValidityKey // The loop variable can't be typed in TS currently

      if (typedKey === 'valid')
        continue

      if (validity[typedKey])
        errors.push(typedKey)
    }

    return errors
  })
}
