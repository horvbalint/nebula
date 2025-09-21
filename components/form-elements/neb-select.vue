<script
  setup
  lang="ts"
  generic="
    TrackByKey extends PropertyKey,
    LabelKey extends PropertyKey,
    T extends PropertyKey | ObjectOption<TrackByKey, LabelKey>
  "
>
import type { UseFloatingOptions } from '@floating-ui/vue'
import * as JsSearch from 'js-search'
import NebDropdown from '../overlays/neb-dropdown.vue'

export type ObjectOption<TrackByKey extends PropertyKey, LabelKey extends PropertyKey> = {
  [x in TrackByKey | LabelKey]: PropertyKey;
}

type ModelValue = PropertyKey | ObjectOption<TrackByKey, LabelKey>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue: undefined | null | ModelValue | ModelValue[]
  options: T[]
  trackByKey?: TrackByKey
  labelKey?: LabelKey
  multiple?: boolean
  useOnlyTrackedKey?: boolean
  label?: string
  hint?: string
  placeholder?: string
  floatingOptions?: UseFloatingOptions
  leadingIcon?: string
  noSearch?: boolean
  required?: boolean
  disabled?: boolean
  allowEmpty?: boolean
  customLabel?: (option: T) => PropertyKey
  onNew?: (searchTerm: string) => unknown
}>(), {
  multiple: false,
  useOnlyTrackedKey: false,
  noSearch: false,
  required: false,
  disabled: false,
  allowEmpty: true,
})

const emit = defineEmits<{
  'update:modelValue': [null | undefined | T | T[]]
  'new': [searchTerm: string]
}>()

const search = templateRef('search')
const dropdown = templateRef('dropdown')

const { errorsToShow, collectErrors } = useNebValidate(dropdown, () => {
  if (props.required) {
    if (!props.modelValue || (props.multiple && !(props.modelValue as []).length))
      return ['valueMissing']
  }

  return []
})

const innerValue = ref(null) as Ref<undefined | null | ModelValue | ModelValue[]>

watch(() => props.modelValue, async () => {
  const showErrors = innerValue.value === props.modelValue // if the value was modified from the outside, we don't show the error to the users
  innerValue.value = props.modelValue

  await nextTick()
  collectErrors({ showErrors })
})

interface ProcessedOption {
  trackValue: PropertyKey
  labelValue: PropertyKey
  option: PropertyKey | ObjectOption<TrackByKey, LabelKey>
}

const processedOptions = computed(() => {
  if (props.trackByKey) {
    return (props.options as ObjectOption<TrackByKey, LabelKey>[]).map(option => ({
      trackValue: option[props.trackByKey!],
      labelValue: props.customLabel ? props.customLabel(option as T) : option[props.labelKey!],
      option,
    }))
  }
  else {
    return (props.options as PropertyKey[]).map(option => ({
      trackValue: option,
      labelValue: option,
      option,
    }))
  }
})

const searcher = computed(() => {
  const searcher = new JsSearch.Search('trackValue')
  searcher.addIndex('labelValue')
  searcher.addDocuments(processedOptions.value)

  return searcher
})

const searchTerm = ref('')
const searchResults = computed<ProcessedOption[]>(() => {
  if (!searchTerm.value.length)
    return processedOptions.value
  else
    return searcher.value.search(searchTerm.value) as ProcessedOption[]
})

const selectedOptions = computed(() => {
  const selectedOptions = new Map<PropertyKey, ProcessedOption>()

  for (const option of processedOptions.value) {
    if (isSelected(option))
      selectedOptions.set(option.trackValue, option)
  }

  return selectedOptions
})

const selectionText = computed(() => {
  const options = [...selectedOptions.value.values()]
  return options.map(option => option.labelValue).join(', ')
})

function isSelected(option: ProcessedOption): boolean {
  if (props.modelValue === null || props.modelValue === undefined)
    return false

  if (props.multiple === true) {
    if (props.useOnlyTrackedKey)
      return (props.modelValue as PropertyKey[]).includes(option.trackValue)
    else if (props.trackByKey)
      return !!(props.modelValue as ObjectOption<TrackByKey, LabelKey>[]).find(o => o[props.trackByKey!] === option.trackValue)
    else
      return (props.modelValue as PropertyKey[]).includes(option.option as PropertyKey)
  }
  else {
    if (props.useOnlyTrackedKey)
      return (props.modelValue as PropertyKey) === option.trackValue
    else if (props.trackByKey)
      return (props.modelValue as ObjectOption<TrackByKey, LabelKey>)[props.trackByKey!] === option.trackValue
    else
      return (props.modelValue as PropertyKey) === option.option as PropertyKey
  }
}

function handleOptionClick(option: ProcessedOption): void {
  if (selectedOptions.value.has(option.trackValue))
    deselectOption(option)
  else
    selectOption(option)
}

function selectOption(option: ProcessedOption): void {
  if (props.multiple === true) {
    const currentValue = props.modelValue || []

    if (props.useOnlyTrackedKey)
      emitValue([...(currentValue as PropertyKey[]), option.trackValue] as T[])
    else if (props.trackByKey)
      emitValue([...(currentValue as ObjectOption<TrackByKey, LabelKey>[]), option.option as ObjectOption<TrackByKey, LabelKey>] as T[])
    else
      emitValue([...(currentValue as PropertyKey[]), option.option as PropertyKey] as T[])
  }
  else {
    if (props.useOnlyTrackedKey)
      emitValue(option.trackValue as T)
    else if (props.trackByKey)
      emitValue(option.option as ObjectOption<TrackByKey, LabelKey> as T)
    else
      emitValue(option.option as PropertyKey as T)

    dropdown.value!.close()
  }
}

function deselectOption(option: ProcessedOption): void {
  if (props.multiple === true) {
    const currentValue = props.modelValue || []
    const newValue = props.useOnlyTrackedKey
      ? (currentValue as PropertyKey[]).filter(o => o !== option.trackValue) as T[]
      : props.trackByKey
        ? (currentValue as ObjectOption<TrackByKey, LabelKey>[]).filter(o => o[props.trackByKey!] !== option.trackValue) as T[]
        : (currentValue as PropertyKey[]).filter(o => o !== option.option as PropertyKey) as T[]

    if (newValue.length)
      emitValue(newValue)
    else if (props.allowEmpty)
      emitValue([])
  }
  else {
    if (props.allowEmpty)
      emitValue(null)
  }
}

function emitValue(value: T | T[] | null | undefined) {
  innerValue.value = value
  emit('update:modelValue', value)
}

const focusIndex = ref(0)
const orderedOptions = ref([]) as Ref<ProcessedOption[]>
function orderOptions() {
  focusIndex.value = 0
  const options = [...searchResults.value]

  orderedOptions.value = options.sort((a, b) => {
    if (selectedOptions.value.has(a.trackValue)) {
      if (selectedOptions.value.has(b.trackValue))
        return 0
      else
        return -1
    }
    else {
      return 1
    }
  })
}

async function handleSelectClick() {
  if (props.disabled)
    return

  if (!dropdown.value!.isOpen)
    orderOptions()

  dropdown.value!.toggle()

  await nextTick()
  if (search.value) {
    if (dropdown.value!.isOpen)
      search.value!.focus()
  }
}

function handleOnEnter() {
  if (orderedOptions.value.length)
    handleOptionClick(orderedOptions.value[focusIndex.value]!)
  else if (props.onNew)
    emit('new', searchTerm.value)
}

const optionRefs = useTemplateRefsList()
function handleArrowUp() {
  if (focusIndex.value > 0) {
    focusIndex.value--
    scrollToFocusedOption()
  }
}
function handleArrowDown() {
  if (focusIndex.value < orderedOptions.value.length - 1) {
    focusIndex.value++
    scrollToFocusedOption()
  }
}
function scrollToFocusedOption() {
  const focusedOption = optionRefs.value[focusIndex.value]

  if (focusedOption) {
    focusedOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
}

watch(searchTerm, orderOptions)
</script>

<template>
  <NebDropdown ref="dropdown" class="neb-select" :floating-options="$props.floatingOptions" full-width @close="searchTerm = ''">
    <template #trigger>
      <div class="neb-select-input-wrapper" @click="handleSelectClick()">
        <span v-if="$props.label">{{ $props.label }} <span v-if="$props.required" class="required-star">*</span></span>

        <div class="neb-select-input" :class="{ 'disabled': $props.disabled, 'has-error': errorsToShow.length, 'opened': dropdown?.isOpen }">
          <slot name="leading">
            <icon v-if="$props.leadingIcon" :name="$props.leadingIcon" />
          </slot>

          <p v-if="!selectedOptions.size" class="placeholder">
            {{ $props.placeholder || $t('nebula.neb-select.placeholder') }}
          </p>

          <div v-else class="selection">
            {{ selectionText }}
          </div>

          <icon class="chevron" name="material-symbols:keyboard-arrow-down" />
        </div>

        <p v-if="hint" class="hint">
          {{ $props.hint }}
        </p>

        <neb-error-list :errors="errorsToShow" />
      </div>
    </template>

    <template #content>
      <div class="select-options">
        <div v-if="!$props.noSearch" class="select-search" @click="search!.focus()">
          <input
            ref="search"
            v-model="searchTerm"
            :placeholder="$t('nebula.neb-select.search')"
            @keydown.up="handleArrowUp()"
            @keydown.down="handleArrowDown()"
            @keyup.enter="handleOnEnter()"
          >

          <icon v-if="searchTerm" name="material-symbols:close-rounded" @click="searchTerm = ''" />
        </div>

        <ul v-if="orderedOptions.length">
          <li
            v-for="(option, index) in orderedOptions"
            :key="option.trackValue"
            @click="handleOptionClick(option)"
          >
            <div class="menu-row">
              <div ref="optionRefs" class="menu-row-content" :class="{ selected: selectedOptions.has(option.trackValue), focus: index === focusIndex }">
                <div class="menu-text-wrapper">
                  <slot name="option" :option="option.option" :label-value="option.labelValue" :track-value="option.trackValue">
                    <p>{{ option.labelValue }}</p>
                  </slot>
                </div>

                <icon v-if="selectedOptions.has(option.trackValue)" class="success-icon" name="material-symbols:done-rounded" />
              </div>
            </div>
          </li>
        </ul>

        <neb-empty-state
          v-else
          :title="$t('nebula.neb-select.empty.title', { term: searchTerm })"
          :description="$t('nebula.neb-select.empty.description')"
        >
          <template v-if="props.onNew" #default>
            <div class="create-button-wrapper">
              <neb-content-separator :text="$t('nebula.neb-select.empty.or')" />

              <neb-button type="secondary" small @click="emit('new', searchTerm)">
                <icon name="material-symbols:add-rounded" /> {{ $t('nebula.neb-select.empty.newItem') }}
              </neb-button>
            </div>
          </template>
        </neb-empty-state>
      </div>
    </template>
  </NebDropdown>
</template>

<style scoped>
.neb-select {
  width: 100%;
}
.neb-select-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  width: 100%;
  color: var(--neutral-color-800);
}
.neb-select-input {
  background: #fff;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  height: 40px;
  border-radius: var(--radius-default);
  border: 1px solid var(--neutral-color-300);
  transition: all var(--duration-default);
  cursor: pointer;
  user-select: none;

  &.disabled {
    background: var(--neutral-color-50);

    .icon {
      color: var(--neutral-color-400);
    }
    & input {
      color: var(--neutral-color-500);
    }
  }
  &.has-error {
    border-color: var(--error-color-300);

    &.opened {
      box-shadow: var(--error-focus-shadow-light);
      border-color: var(--error-color-300);
    }
  }
  &.opened {
    border-color: var(--primary-color-300);
    box-shadow: var(--primary-focus-shadow-light);

    .chevron {
      transform: rotate(180deg);
    }
  }
  & input {
    flex: 1;
    border: none;
    background: inherit;
    height: 100%;
    font-size: var(--text-sm);
    outline: none;
    color: var(--neutral-color-900);

    &:-webkit-autofill,
    &:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 50px white inset; /* Change the color to your own background color */
    }
  }
  .icon {
    color: var(--neutral-color-500);
    transition: transform var(--duration-default);
  }
}
.placeholder {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--neutral-color-400);
}
.selection {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.required-star {
  color: var(--error-color-500);
}
.hint {
  font-size: var(--text-xs);
  color: var(--neutral-color-600);
  font-weight: 400;
}
.select-options {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 350px;

  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-lg);
  background: #fff;
  overflow: auto;
}
.select-search {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--neutral-color-200);
  background: #fff;

  input {
    width: 100%;
    font-size: var(--text-sm);
    outline: none;
    border: none;
    background: transparent;

    &::placeholder {
      color: var(--neutral-color-400);
    }
  }
  .icon {
    width: 18px;
    height: 18px;
    cursor: pointer;
    color: var(--neutral-color-500);
  }
}
ul {
  display: flex;
  flex-direction: column;
  gap: 2px;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  padding: var(--space-1) 0;
}
li {
  hr {
    margin: var(--space-1) 0;
    border: none;
    height: 1px;
    background: var(--neutral-color-200);
    display: none;
  }
}
.menu-row {
  margin: 0;
  padding: 0 var(--space-1);
  user-select: none;
}
.menu-row-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-3);
  max-height: 41px;
  transition: all var(--duration-default);
  cursor: pointer;
  border-radius: var(--radius-small);
  scroll-margin-bottom: 8px;
  scroll-margin-top: 160px;

  &:hover {
    background: var(--neutral-color-50);
  }
  &.focus {
    background: var(--neutral-color-100);
  }
  &:active {
    background: var(--neutral-color-200);
  }
  &.selected {
    background: var(--neutral-color-50);

    &:hover {
      background: var(--neutral-color-100);
    }
    &.focus {
      background: var(--primary-color-100);
    }
    &:active {
      background: var(--neutral-color-200);
    }
  }
  .icon {
    width: var(--space-5);
    height: var(--space-5);
    color: var(--neutral-color-600);
  }
  .success-icon {
    color: var(--primary-color-600);
    width: 20px;
    height: 20px;
  }
}
.menu-text-wrapper {
  font-weight: 500;
  font-size: var(--text-sm);
  color: var(--neutral-color-800);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  gap: var(--space-2);
  align-items: center;

  :slotted(p) {
    text-overflow: ellipsis;
    overflow: hidden;
    flex-shrink: 1;
  }
}
.create-button-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.dark-mode {
  .neb-input {
    &.disabled .input {
      background: var(--neutral-color-900);

      .icon {
        color: var(--neutral-color-600);
      }
      & input {
        color: var(--neutral-color-500);
      }
    }
  }
  & .neb-select-input-wrapper {
    color: var(--neutral-color-300);
  }
  .neb-select-input {
    background: var(--neutral-color-950);
    border: 1px solid var(--neutral-color-700);

    &.has-error {
      border-color: var(--error-color-700);

      &.opened {
        box-shadow: var(--error-focus-shadow-dark);
        border-color: var(--error-color-700);
      }
    }
    &.opened {
      border-color: var(--primary-color-700);
      box-shadow: var(--primary-focus-shadow-dark);
    }
    & input {
      color: var(--neutral-color-300);
    }
    & input:-webkit-autofill,
    & input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 50px var(--neutral-color-950) inset; /* Change the color to your own background color */
    }
    .icon {
      color: var(--neutral-color-400);
    }
  }
  .hint {
    color: var(--neutral-color-300);
  }
  .select-search {
    background: var(--neutral-color-950);
    border-color: var(--neutral-color-800);
  }
  .select-options {
    background: var(--neutral-color-950);
    border: 1px solid var(--neutral-color-800);
  }
  li {
    hr {
      background: var(--neutral-color-800);
    }
  }
  .menu-row-content {
    &:hover {
      background: var(--neutral-color-900);
    }
    &.focus {
      background: var(--neutral-color-800);
    }
    &:active {
      background: var(--neutral-color-800);
    }
    &.selected {
      background: var(--neutral-color-900);

      &:hover {
        background: var(--neutral-color-800);
      }
      &:active {
        background: var(--neutral-color-900);
      }
    }
    p {
      color: var(--neutral-color-300);
    }
    .icon {
      color: var(--neutral-color-400);
    }
    .success-icon {
      color: var(--primary-color-500);
    }
  }
  .menu-text-wrapper {
    color: var(--neutral-color-300);
  }
}
</style>
