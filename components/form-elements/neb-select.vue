<script lang="ts">
import type { UseFloatingOptions } from '@floating-ui/vue'
</script>

<script
  setup
  lang="ts"
  generic="
    TrackByKey extends PropertyKey,
    LabelKey extends PropertyKey,
  "
>
import * as JsSearch from 'js-search'

type ObjectOptionLike<TrackByKey extends PropertyKey, LabelKey extends PropertyKey> = {
  [x in TrackByKey | LabelKey]: PropertyKey;
}

type ObjectOption = ObjectOptionLike<TrackByKey, LabelKey>

type DiscriminatingProps = {
  multiple: false
  useOnlyTrackedKey?: false
  modelValue: ObjectOption | null
  options: ObjectOption[]
  trackByKey: TrackByKey
  labelKey: LabelKey
} | {
  multiple: false
  useOnlyTrackedKey: true
  modelValue: PropertyKey | null
  options: ObjectOption[]
  trackByKey: TrackByKey
  labelKey: LabelKey
} | {
  multiple: false
  useOnlyTrackedKey?: false
  modelValue: PropertyKey | null
  options: PropertyKey[]
} | {
  multiple: true
  useOnlyTrackedKey?: false
  modelValue: ObjectOption[]
  options: ObjectOption[]
  trackByKey: TrackByKey
  labelKey: LabelKey
} | {
  multiple: true
  useOnlyTrackedKey: true
  modelValue: PropertyKey[]
  options: ObjectOption[]
  trackByKey: TrackByKey
  labelKey: LabelKey
} | {
  multiple: true
  useOnlyTrackedKey?: false
  modelValue: PropertyKey[]
  options: PropertyKey[]
}

interface FixProps {
  label?: string
  hint?: string
  floatingOptions?: UseFloatingOptions
  leadingIcon?: string
}

const props = defineProps<DiscriminatingProps & FixProps>()

const emit = defineEmits<{
  'update:modelValue': [typeof props.modelValue]
}>()

interface ProcessedOption {
  selected?: boolean
  trackValue: PropertyKey
  labelValue: PropertyKey
  option: PropertyKey | ObjectOption
}

const computedOptions = computed(() => {
  if ('trackByKey' in props) {
    return props.options.map((option) => {
      const temp: ProcessedOption = {
        trackValue: option[props.trackByKey],
        labelValue: option[props.labelKey],
        option,
      }
      temp.selected = isSelected(temp)

      return temp
    })
  }
  else {
    return props.options.map((option) => {
      const temp: ProcessedOption = {
        trackValue: option,
        labelValue: option,
        option,
      }
      temp.selected = isSelected(temp)

      return temp
    })
  }
})

function isSelected(option: ProcessedOption): boolean {
  if (props.multiple === true) {
    if (props.useOnlyTrackedKey)
      return props.modelValue.includes(option.trackValue)
    else if ('trackByKey' in props)
      return !!props.modelValue.find(o => o[props.trackByKey] === option.trackValue)
    else
      return props.modelValue.includes(option.option as PropertyKey)
  }
  else {
    if (props.modelValue === null)
      return false

    if (props.useOnlyTrackedKey)
      return props.modelValue === option.trackValue
    else if ('trackByKey' in props)
      return props.modelValue[props.trackByKey] === option.trackValue
    else
      return props.modelValue === option.option as PropertyKey
  }
}

function handleOptionClick(option: ProcessedOption): void {
  if (option.selected)
    deselectOption(option)
  else
    selectOption(option)
}

function selectOption(option: ProcessedOption): void {
  if (props.multiple === true) {
    if (props.useOnlyTrackedKey)
      emit('update:modelValue', [...props.modelValue, option.trackValue])
    else if ('trackByKey' in props)
      emit('update:modelValue', [...props.modelValue, option.option as ObjectOption])
    else
      emit('update:modelValue', [...props.modelValue, option.option as PropertyKey])
  }
  else {
    if (props.useOnlyTrackedKey)
      emit('update:modelValue', option.trackValue)
    else if ('trackByKey' in props)
      emit('update:modelValue', option.option as ObjectOption)
    else
      emit('update:modelValue', option.option as PropertyKey)
  }
}

function deselectOption(option: ProcessedOption): void {
  if (props.multiple === true) {
    if (props.useOnlyTrackedKey)
      emit('update:modelValue', props.modelValue.filter(o => o !== option.trackValue))
    else if ('trackByKey' in props)
      emit('update:modelValue', props.modelValue.filter(o => o[props.trackByKey] !== option.trackValue))
    else
      emit('update:modelValue', props.modelValue.filter(o => o !== option.option as PropertyKey))
  }
  else {
    emit('update:modelValue', null)
  }
}

const search = new JsSearch.Search('trackValue')
search.addIndex('labelValue')
search.addDocuments(computedOptions.value)

const searchTerm = ref('')
const searchResults = computed(() => {
  if (!searchTerm.value.length)
    return computedOptions.value

  return search.search(searchTerm.value)
}) as ComputedRef<ProcessedOption[]>
</script>

<template>
  <neb-dropdown class="neb-select" :floating-options="floatingOptions" full-width>
    <template #trigger="{ toggle }">
      <div class="neb-select-input-wrapper" @click="toggle()">
        <span v-if="label">{{ label }} <span class="required-star">*</span></span>

        <div class="neb-select-input">
          <slot name="leading">
            <icon v-if="leadingIcon" :name="leadingIcon" />
          </slot>

          <icon class="chevron" name="material-symbols:keyboard-arrow-down" />
        </div>

        <p v-if="hint" class="hint">
          {{ $props.hint }}
        </p>
      </div>
    </template>

    <template #content>
      <div>
        <neb-input v-model="searchTerm" />

        <ul class="neb-overlay-transition">
          <li
            v-for="option in computedOptions"
            :key="option.trackValue"
            @click="handleOptionClick(option)"
          >
            <div class="menu-row">
              <div class="menu-row-content">
                <div class="menu-text-wrapper">
                  <slot :option="option.option">
                    <p>{{ option.labelValue }}</p>
                  </slot>
                </div>

                <icon v-if="option.selected" class="success-icon" name="material-symbols:done-rounded" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </neb-dropdown>
</template>

<style scoped>
.neb-select {
  width: 100%;
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

  &.has-error {
    border-color: var(--error-color-300);

    &:focus-within {
      box-shadow: var(--error-focus-shadow);
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
.neb-select-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  width: 100%;
  color: var(--neutral-color-800);
}
.required-star {
  color: var(--error-color-500);
}
.hint {
  font-size: var(--text-xs);
  color: var(--neutral-color-600);
  font-weight: 400;
}
ul {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-height: 300px;
  overflow: auto;

  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-lg);
  padding: var(--space-1) 0;
  background: var(--white-color);
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

    &.has-error {
      border-color: var(--error-color-700);

      &:focus-within {
        box-shadow: var(--error-focus-shadow-dark);
        border-color: var(--error-color-700);
      }
    }
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
  ul {
    border: 1px solid var(--neutral-color-800);
    background: var(--neutral-color-950);
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
    &:active {
      background: var(--neutral-color-800);
    }
    p {
      color: var(--neutral-color-300);
    }
    .icon {
      color: var(--neutral-color-400)
    }
  }
}
</style>
