<script lang="ts">
import type { UseFloatingOptions } from '@floating-ui/vue'

type KeyType = string | number | symbol

type OptionLike<TrackByKey extends KeyType, LabelKey extends KeyType> = {
  [x in TrackByKey | LabelKey]: KeyType;
}
</script>

<script
  setup
  lang="ts"
  generic="
    TrackByKey extends KeyType,
    LabelKey extends KeyType,
    Option extends OptionLike<TrackByKey, LabelKey> | KeyType
  "
>
const props = defineProps<{
  options: Option[]
  labelKey?: LabelKey
  trackByKey?: TrackByKey
  label?: string
  hint?: string
  floatingOptions?: UseFloatingOptions
}>()

const processedOptions = computed(() => {
  return props.options.map(option => ({
    trackValue: getValue(option, props.trackByKey),
    labelValue: getValue(option, props.labelKey),
    option,
  }))
})

function getValue(option: Option, key?: TrackByKey | LabelKey) {
  if (typeof option === 'string' || typeof option === 'number' || typeof option === 'symbol')
    return option
  else
    return (option as OptionLike<TrackByKey, LabelKey>)[key!]
}

const input = ref<HTMLInputElement | null>(null)
</script>

<template>
  <neb-dropdown class="neb-select" :floating-options="floatingOptions" full-width>
    <template #trigger="{ open }">
      <label @click="input!.focus()">
        <span v-if="label">{{ label }} <span class="required-star">*</span></span>

        <div class="neb-select-input">
          <slot name="leading">
            <!-- <icon :name="computedLeadingIcon" /> -->
          </slot>

          <input ref="input" @focus="open()">

          <icon name="material-symbols:keyboard-arrow-down" />
        </div>

        <p v-if="hint" class="hint">{{ $props.hint }}</p>
      </label>
    </template>

    <template #content>
      <ul class="neb-overlay-transition">
        <li v-for="processedOption in processedOptions" :key="processedOption.trackValue">
          <div class="menu-row">
            <div class="menu-row-content">
              <slot :option="processedOption.option">
                <p>{{ processedOption.labelValue }}</p>
              </slot>
            </div>
          </div>
        </li>
      </ul>
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

    .icon {
      transform: rotate(180deg);
      transition: transform var(--duration-default);
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
label {
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
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-3);
  transition: all var(--duration-default);
  cursor: pointer;
  border-radius: var(--radius-small);

  &:hover {
    background: var(--neutral-color-50);
  }
  &:active {
    background: var(--neutral-color-200);
  }
  p {
    font-weight: 500;
    font-size: var(--text-sm);
    color: var(--neutral-color-800);
  }
  .icon {
    width: var(--space-5);
    height: var(--space-5);
    color: var(--neutral-color-600)
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
  & label {
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
