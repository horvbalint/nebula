export type ValidityKey = keyof ValidityState

type ValidatableElement = HTMLElement | ComponentPublicInstance

export interface NebValidatorCallbacks {
  init: (element: ValidatableElement) => void
  onValidityChange: (element: ValidatableElement, errors: ValidityKey[]) => void
  onDestroy: (element: ValidatableElement) => void
}

export const NebValidatorCallbacksInjectKey = Symbol('NebValidatorCallbacksInjectKey') as InjectionKey<NebValidatorCallbacks>
export const NebValidatorErrorsToShowInjectKey = Symbol('NebValidatorErrorsToShowInjectKey') as InjectionKey<Ref<ValidityKey[]>>

export function useNebValidate<T extends ValidatableElement>(
  reference: Ref<T | null>,
  collectErrors: (element: T) => ValidityKey[],
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

export function useNebValidateNative<T extends HTMLInputElement | HTMLTextAreaElement>(reference: Ref<T | null>) {
  return useNebValidate(reference, element => nebGetValidityErrorKeys(element.validity))
}

export function nebGetValidityErrorKeys(validity: ValidityState) {
  const errors = [] as ValidityKey[]
  for (const key in validity) {
    const typedKey = key as ValidityKey
    if (typedKey === 'valid')
      continue

    if (validity[typedKey])
      errors.push(typedKey)
  }

  return errors
}
