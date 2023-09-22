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
import type NebInput from './neb-input.vue'

export type ObjectOption<TrackByKey extends PropertyKey, LabelKey extends PropertyKey> = {
  [x in TrackByKey | LabelKey]: PropertyKey;
}

const props = defineProps<{
  modelValue: null | T | T[]
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
}>()

const emit = defineEmits<{
  'update:modelValue': [typeof props.modelValue]
}>()

interface ProcessedOption {
  trackValue: PropertyKey
  labelValue: PropertyKey
  option: PropertyKey | ObjectOption<TrackByKey, LabelKey>
}

const processedOptions = computed(() => {
  if (props.trackByKey) {
    return (props.options as ObjectOption<TrackByKey, LabelKey>[]).map(option => ({
      trackValue: option[props.trackByKey!],
      labelValue: option[props.labelKey!],
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

const searcher = new JsSearch.Search('trackValue')
searcher.addIndex('labelValue')
searcher.addDocuments(processedOptions.value)

const searchTerm = ref('')
const searchResults = computed<ProcessedOption[]>(() => {
  if (!searchTerm.value.length)
    return processedOptions.value
  else
    return searcher.search(searchTerm.value) as ProcessedOption[]
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
  if (props.multiple === true) {
    if (props.useOnlyTrackedKey)
      return (props.modelValue as PropertyKey[]).includes(option.trackValue)
    else if (props.trackByKey)
      return !!(props.modelValue as ObjectOption<TrackByKey, LabelKey>[]).find(o => o[props.trackByKey!] === option.trackValue)
    else
      return (props.modelValue as PropertyKey[]).includes(option.option as PropertyKey)
  }
  else {
    if (props.modelValue === null)
      return false

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
    if (props.useOnlyTrackedKey)
      emit('update:modelValue', [...(props.modelValue as PropertyKey[]), option.trackValue] as T[])
    else if (props.trackByKey)
      emit('update:modelValue', [...(props.modelValue as ObjectOption<TrackByKey, LabelKey>[]), option.option as ObjectOption<TrackByKey, LabelKey>] as T[])
    else
      emit('update:modelValue', [...(props.modelValue as PropertyKey[]), option.option as PropertyKey] as T[])
  }
  else {
    if (props.useOnlyTrackedKey)
      emit('update:modelValue', option.trackValue as T)
    else if (props.trackByKey)
      emit('update:modelValue', option.option as ObjectOption<TrackByKey, LabelKey> as T)
    else
      emit('update:modelValue', option.option as PropertyKey as T)
  }
}

function deselectOption(option: ProcessedOption): void {
  if (props.multiple === true) {
    if (props.useOnlyTrackedKey)
      emit('update:modelValue', (props.modelValue as PropertyKey[]).filter(o => o !== option.trackValue) as T[])
    else if (props.trackByKey)
      emit('update:modelValue', (props.modelValue as ObjectOption<TrackByKey, LabelKey>[]).filter(o => o[props.trackByKey!] !== option.trackValue) as T[])
    else
      emit('update:modelValue', (props.modelValue as PropertyKey[]).filter(o => o !== option.option as PropertyKey) as T[])
  }
  else {
    emit('update:modelValue', null)
  }
}

const orderedOptions = ref([]) as Ref<ProcessedOption[]>
function orderOptions() {
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

const search = ref<null | InstanceType<typeof NebInput>>(null)
const dropdown = ref<null | InstanceType<typeof NebDropdown>>(null)

async function handleSelectClick() {
  if (!dropdown.value!.isOpen)
    orderOptions()

  dropdown.value!.toggle()

  await nextTick()
  if (search.value) {
    if (dropdown.value!.isOpen)
      search.value!.focus()
  }
}

watch(searchTerm, orderOptions)
</script>

<template>
  <NebDropdown ref="dropdown" class="neb-select" :floating-options="floatingOptions" full-width>
    <template #trigger>
      <div class="neb-select-input-wrapper" @click="handleSelectClick()">
        <span v-if="label">{{ label }} <span class="required-star">*</span></span>

        <div class="neb-select-input">
          <slot name="leading">
            <icon v-if="leadingIcon" :name="leadingIcon" />
          </slot>

          <p v-if="!selectedOptions.size" class="placeholder">
            {{ $props.placeholder }}
          </p>

          <div v-else class="selection">
            {{ selectionText }}
          </div>

          <icon class="chevron" name="material-symbols:keyboard-arrow-down" />
        </div>

        <p v-if="hint" class="hint">
          {{ $props.hint }}
        </p>
      </div>
    </template>

    <template #content>
      <div class="select-options">
        <div v-if="!noSearch" class="select-search" @click="search!.focus()">
          <input
            ref="search"
            v-model="searchTerm"
            placeholder="Írj ide a kereséshez..."
          >

          <icon v-if="searchTerm" name="material-symbols:close-rounded" @click="searchTerm = ''" />
        </div>

        <ul v-if="orderedOptions.length">
          <li
            v-for="option in orderedOptions"
            :key="option.trackValue"
            @click="handleOptionClick(option)"
          >
            <div class="menu-row">
              <div class="menu-row-content" :class="{ selected: selectedOptions.has(option.trackValue) }">
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
          :title="`A(z) '${searchTerm}' nem található`"
          description="Próbálkozz másik kulcsszóval."
        />
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
  background: var(--white-color);
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

  &.has-error {
    border-color: var(--error-color-300);

    &:focus-within {
      box-shadow: var(--error-focus-shadow-light);
      border-color: var(--error-color-300);
    }
  }
  &:focus-within {
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
      -webkit-box-shadow:0 0 0 50px white inset; /* Change the color to your own background color */
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
  color: var(--neutral-color-400)
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
  max-height: 300px;

  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-lg);
  background: var(--white-color);
  overflow: auto;
}
.select-search {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--neutral-color-200);
  background: var(--white-color);

  input {
    font-size: var(--text-sm);
    outline: none;
    border: none;
    background: transparent;

    &::placeholder {
      color: var(--neutral-color-400)
    }
  }
  .icon {
    width: 18px;
    height: 18px;
    cursor: pointer;
    color: var(--neutral-color-500)
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

  &:hover {
    background: var(--neutral-color-50);
  }
  &:active {
    background: var(--neutral-color-200);
  }
  &.selected {
    background: var(--neutral-color-50);

    &:hover {
      background: var(--neutral-color-100);
    }
    &:active {
      background: var(--neutral-color-200);
    }
  }
  .icon {
    width: var(--space-5);
    height: var(--space-5);
    color: var(--neutral-color-600)
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

  p {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.dark-mode {
  .neb-input-component {
    &.disabled .neb-input {
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

    &.has-e.menu-text-wrapper
    &:focus-within {
      border-color: var(--primary-color-700);
      box-shadow: var(--primary-focus-shadow-dark);
    }
    & input {
      color: var(--neutral-color-300);
    }
    & input:-webkit-autofill,
    & input:-webkit-autofill:focus {
      -webkit-box-shadow:0 0 0 50px var(--neutral-color-950) inset; /* Change the color to your own background color */
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
    &.selected {
      background: var(--neutral-color-900);

      &:hover {
        background: var(--neutral-color-800);
      }
      &:active {
        background: var(--neutral-color-900);
      }
    }
    &:hover {
      background: var(--neutral-color-900);
    }
    &:active {
      background: var(--neutral-color-800);
    }
    p {
      color: var(--neutral-color-300);
    }
    .icon {
      color: var(--neutral-color-400)
    }
    .success-icon {
      color: var(--primary-color-500);
    }
  }
  .menu-text-wrapper {
    color: var(--neutral-color-300)
  }
}
</style>
