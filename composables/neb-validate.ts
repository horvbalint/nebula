type ValidityKey = keyof ValidityState
type ComponentType = abstract new (...args: any) => any // This is the constraint on InstanceType's generic argument

export interface NebValidatorCallbacks {
  init: (element: HTMLElement) => void
  onValidityChange: (element: HTMLElement, errors: ValidityKey[]) => void
  onDestroy: (element: HTMLElement) => void
}

export const NebValidatorCallbacksInjectKey = Symbol('NebValidatorCallbacksInjectKey') as InjectionKey<NebValidatorCallbacks>
export const NebValidatorErrorsToShowInjectKey = Symbol('NebValidatorErrorsToShowInjectKey') as InjectionKey<Ref<ValidityKey[]>>

export function useNebValidate<T extends ComponentType>(
  reference: Ref<HTMLElement | InstanceType<T> | null>,
  collectErrors: (element: HTMLElement) => ValidityKey[],
) {
  const injectedErrorsToShow = inject(NebValidatorErrorsToShowInjectKey, null)

  if (injectedErrorsToShow) {
    return { errorsToShow: injectedErrorsToShow, collectErrors: () => {} }
  }
  else {
    const validatorCallbacks = inject(NebValidatorCallbacksInjectKey, null)
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

    return { errorsToShow, collectErrors: wrappedCollectErrors }
  }
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
