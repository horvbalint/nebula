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
import Fuse from 'fuse.js'
import NebDropdown from '../overlays/neb-dropdown.vue'

export type ObjectOption<TrackByKey extends PropertyKey, LabelKey extends PropertyKey> = {
  [K in TrackByKey]: any;
} & {
  [K in LabelKey]: PropertyKey;
}

type TrackValue = T extends PropertyKey ? PropertyKey : T extends ObjectOption<TrackByKey, LabelKey> ? T[TrackByKey] : never

type ModelValue = TrackValue | T

const props = withDefaults(defineProps<{
  modelValue: undefined | null | unknown | unknown[]
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
  emptyValue?: null | undefined
  customLabel?: (option: T) => PropertyKey
  transformFun?: (a: TrackValue) => PropertyKey
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
  'update:modelValue': [null | undefined | ModelValue | ModelValue[]]
  'new': [searchTerm: string]
}>()

const computedEmptyValue = computed(() => props.emptyValue ?? useAppConfig().nebula.nebSelect.emptyValue)

const search = useTemplateRef('search')
const dropdown = useTemplateRef('dropdown')

const { errorsToShow, collectErrors } = useNebValidate(dropdown, () => {
  if (props.required) {
    if (!props.modelValue || (props.multiple && !(props.modelValue as []).length))
      return ['valueMissing']
  }

  return []
})

const innerValue = ref(computedEmptyValue.value) as Ref<undefined | null | ModelValue | ModelValue[]>

watch(() => props.modelValue, async () => {
  const showErrors = innerValue.value === props.modelValue // if the value was modified from the outside, we don't show the error to the users
  innerValue.value = props.modelValue as undefined | null | ModelValue | ModelValue[]

  await nextTick()
  collectErrors({ showErrors })
})

interface ProcessedOption {
  transformedTrackValue: PropertyKey
  trackValue: TrackValue
  labelValue: PropertyKey
  option: T
}

const transformTrackValueFun = props.transformFun || ((b: TrackValue) => b)

const processedOptions = computed<ProcessedOption[]>(() => {
  if (props.trackByKey) {
    return (props.options as ObjectOption<TrackByKey, LabelKey>[]).map(option => ({
      transformedTrackValue: transformTrackValueFun(option[props.trackByKey!]),
      trackValue: option[props.trackByKey!],
      labelValue: props.customLabel ? props.customLabel(option as T) : option[props.labelKey!],
      option: option as T,
    }))
  }
  else {
    return (props.options as PropertyKey[]).map(option => ({
      transformedTrackValue: transformTrackValueFun(option as TrackValue),
      trackValue: option as TrackValue,
      labelValue: props.customLabel ? props.customLabel(option as T) : option,
      option: option as T,
    }))
  }
})

const searcher = computed(() => {
  return new Fuse(processedOptions.value, {
    includeScore: false,
    keys: ['labelValue'],
  })
})

const searchTerm = ref('')
const searchResults = computed<ProcessedOption[]>(() => {
  if (!searchTerm.value.length)
    return processedOptions.value
  else
    return searcher.value.search(searchTerm.value).map(r => r.item)
})

const selectedOptions = computed(() => {
  const selectedOptions = new Map<PropertyKey, ProcessedOption>()

  for (const option of processedOptions.value) {
    if (isSelected(option))
      selectedOptions.set(option.transformedTrackValue, option)
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
      return (props.modelValue as PropertyKey[]).some(value => transformTrackValueFun(value as TrackValue) === option.transformedTrackValue)
    else if (props.trackByKey)
      return !!(props.modelValue as ObjectOption<TrackByKey, LabelKey>[]).find(o => transformTrackValueFun(o[props.trackByKey!]) === option.transformedTrackValue)
    else
      return (props.modelValue as PropertyKey[]).some(value => transformTrackValueFun(value as TrackValue) === option.transformedTrackValue)
  }
  else {
    if (props.useOnlyTrackedKey)
      return transformTrackValueFun(props.modelValue as TrackValue) === option.transformedTrackValue
    else if (props.trackByKey)
      return transformTrackValueFun((props.modelValue as ObjectOption<TrackByKey, LabelKey>)[props.trackByKey!]) === option.transformedTrackValue
    else
      return transformTrackValueFun(props.modelValue as TrackValue) === option.transformedTrackValue
  }
}

function handleOptionClick(option: ProcessedOption): void {
  if (selectedOptions.value.has(option.transformedTrackValue))
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
      ? (currentValue as TrackValue[]).filter(o => transformTrackValueFun(o) !== option.transformedTrackValue) as T[]
      : props.trackByKey
        ? (currentValue as ObjectOption<TrackByKey, LabelKey>[]).filter(o => transformTrackValueFun(o[props.trackByKey!]) !== option.transformedTrackValue) as T[]
        : (currentValue as PropertyKey[]).filter(o => transformTrackValueFun(o as TrackValue) !== option.transformedTrackValue) as T[]

    if (newValue.length)
      emitValue(newValue)
    else if (props.allowEmpty)
      emitValue([])
  }
  else {
    if (props.allowEmpty)
      emitValue(computedEmptyValue.value)
  }
}

function emitValue(value: ModelValue | ModelValue[] | null | undefined) {
  innerValue.value = value
  emit('update:modelValue', value)
}

const focusIndex = ref<number | null>(null)
const orderedOptions = ref([]) as Ref<ProcessedOption[]>
function orderOptions() {
  focusIndex.value = null
  const options = [...searchResults.value]

  orderedOptions.value = options.sort((a, b) => {
    if (selectedOptions.value.has(a.transformedTrackValue)) {
      if (selectedOptions.value.has(b.transformedTrackValue))
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
    handleOptionClick(orderedOptions.value[focusIndex.value || 0]!)
  else if (props.onNew)
    emit('new', searchTerm.value)
}

function handleArrowUp() {
  if (focusIndex.value === null)
    focusIndex.value = 1

  if (focusIndex.value > 0) {
    focusIndex.value--
    scrollToFocusedOption()
  }
}
function handleArrowDown() {
  if (focusIndex.value === null)
    focusIndex.value = -1

  if (focusIndex.value < orderedOptions.value.length - 1) {
    focusIndex.value++
    scrollToFocusedOption()
  }
}

const ul = useTemplateRef('ul')
function scrollToFocusedOption() {
  const focusedOption = ul.value?.children[focusIndex.value || 0]
  if (focusedOption) {
    focusedOption.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
      // @ts-expect-error - this does exist: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#container
      container: 'nearest',
    })
  }
}

watch(searchTerm, orderOptions)
</script>

<template>
  <NebDropdown ref="dropdown" class="neb-select" :floating-options="$props.floatingOptions" full-width @mousedown.prevent @close="searchTerm = ''">
    <template #trigger>
      <div
        class="neb-select-input-wrapper"
        tabindex="0"
        @click="handleSelectClick()"
        @keydown.enter="handleSelectClick()"
        @keydown.space.prevent="handleSelectClick()"
      >
        <span v-if="$props.label">{{ $props.label }} <span v-if="$props.required" class="required-star">*</span></span>

        <div class="neb-select-input" :class="{ 'disabled': $props.disabled, 'has-error': errorsToShow.length, 'opened': dropdown?.isOpen }">
          <slot name="leading">
            <icon v-if="$props.leadingIcon" :name="$props.leadingIcon" />
          </slot>

          <p v-if="!selectedOptions.size" class="placeholder">
            {{ $props.placeholder || $t('nebula.neb-select.placeholder') }}
          </p>

          <div v-else class="selection">
            <slot name="selection" :selected="[...selectedOptions.values()]" :selection-text="selectionText">
              {{ selectionText }}
            </slot>
          </div>

          <icon class="chevron" name="material-symbols:keyboard-arrow-down" />
        </div>

        <p v-if="hint" class="hint">
          {{ $props.hint }}
        </p>

        <neb-error-list :errors="errorsToShow" />
      </div>
    </template>

    <template #content="{ placement }">
      <div class="select-options" :class="placement">
        <div v-if="!$props.noSearch" class="select-search" @click="search!.focus()">
          <input
            ref="search"
            v-model="searchTerm"
            :placeholder="$t('nebula.neb-select.search')"
            @keydown.up.prevent="handleArrowUp()"
            @keydown.down.prevent="handleArrowDown()"
            @keyup.enter="handleOnEnter()"
            @blur="dropdown?.close()"
          >

          <icon v-if="searchTerm" name="material-symbols:close-rounded" @click="searchTerm = ''" />
        </div>

        <ul v-if="orderedOptions.length" ref="ul">
          <li
            v-for="(option, index) in orderedOptions"
            :key="option.transformedTrackValue"
            @click="handleOptionClick(option)"
          >
            <div class="menu-row">
              <div class="menu-row-content" :class="{ selected: selectedOptions.has(option.transformedTrackValue), focus: index === focusIndex }">
                <div class="menu-text-wrapper">
                  <slot name="option" :option="option.option" :label-value="option.labelValue" :track-value="option.trackValue" :transformed-track-value="option.transformedTrackValue">
                    <p>{{ option.labelValue }}</p>
                  </slot>
                </div>

                <icon v-if="selectedOptions.has(option.transformedTrackValue)" class="success-icon" name="material-symbols:done-rounded" />
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

        <div v-if="orderedOptions.length && props.onNew && searchTerm" class="create-footer" @click="emit('new', searchTerm)">
          <neb-button type="link" small>
            <icon name="material-symbols:add-rounded" /> {{ $t('nebula.neb-select.create', { term: searchTerm }) }}
          </neb-button>
        </div>
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
  font: var(--neb-font-label);
  width: 100%;
  color: var(--neb-text);
  outline: none;

  &:focus .neb-select-input {
    border-color: var(--neb-border-focus);
    box-shadow: var(--neb-ring-primary);
  }
}
.neb-select-input {
  background: var(--neb-bg);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  height: 40px;
  border-radius: var(--radius-default);
  border: 1px solid var(--neb-border);
  transition: all var(--duration-default);
  cursor: pointer;
  user-select: none;

  &.disabled {
    background: var(--neb-bg-disabled);

    .icon {
      color: var(--neb-text-disabled);
    }
    & input {
      color: var(--neb-text-subtle);
    }
  }
  &.has-error {
    border-color: var(--neb-border-error);

    &.opened {
      box-shadow: var(--neb-ring-error);
      border-color: var(--neb-border-error);
    }
  }
  &.opened {
    border-color: var(--neb-border-focus);
    box-shadow: var(--neb-ring-primary);

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
    color: var(--neb-text);

    &:-webkit-autofill,
    &:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 50px var(--neb-bg) inset; /* Change the color to your own background color */
      -webkit-text-fill-color: var(--neb-text);
    }
  }
  .icon {
    color: var(--neb-text-muted);
    transition: transform var(--duration-default);
  }
}
.placeholder {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--neb-text-subtle);
}
.selection {
  flex: 1;
  display: flex;
  gap: var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.required-star {
  color: var(--neb-text-error);
}
.hint {
  font: var(--neb-font-hint);
  color: var(--neb-text-muted);
}
.select-options {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 350px;

  border: 1px solid var(--neb-border-subtle);
  border-radius: var(--radius-default);
  box-shadow: var(--neb-shadow-lg);
  background: var(--neb-bg-raised);
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
  border-bottom: 1px solid var(--neb-border-subtle);
  background: var(--neb-bg-raised);

  input {
    width: 100%;
    font-size: var(--text-sm);
    outline: none;
    border: none;
    background: transparent;

    &::placeholder {
      color: var(--neb-text-subtle);
    }
  }
  .icon {
    width: 18px;
    height: 18px;
    cursor: pointer;
    color: var(--neb-text-muted);
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
    background: var(--neb-border-subtle);
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

  &:hover {
    background: var(--neb-bg-hover);
  }
  &.focus {
    background: var(--neb-bg-active);
  }
  &:active {
    background: var(--neb-bg-active);
  }
  &.selected {
    background: var(--neb-bg-hover);

    &:hover {
      background: var(--neb-bg-active);
    }
    &.focus {
      background: var(--neb-bg-selected);
    }
    &:active {
      background: var(--neb-bg-active);
    }
  }
  .icon {
    width: var(--space-5);
    height: var(--space-5);
    color: var(--neb-text-muted);
  }
  .success-icon {
    color: var(--neb-text-primary);
    width: 20px;
    height: 20px;
  }
}
.menu-text-wrapper {
  font: var(--neb-font-label);
  color: var(--neb-text);
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
.create-footer {
  position: sticky;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid var(--neb-border-subtle);
  background: var(--neb-bg-raised);
  cursor: pointer;

  &:hover {
    background: var(--neb-bg-hover);
  }
}

@media (--tablet-viewport) {
  .select-options.top {
    flex-direction: column-reverse;

    ul {
      flex-direction: column-reverse;
    }

    .select-search {
      top: unset;
      bottom: 0;
      border-bottom: none;
      border-top: 1px solid var(--neb-border-subtle);
    }
  }
}
</style>
