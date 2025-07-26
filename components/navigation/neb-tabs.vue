<script setup lang="ts">
export interface Tab {
  text: string
  description?: string
  icon?: string
  disabled?: boolean
  count?: number
}

const props = withDefaults(defineProps<{
  tabs: Record<string, Tab | string>
  vertical?: boolean
  fullWidth?: boolean
  hierarchy?: 'primary' | 'tertiary'
}>(), {
  vertical: false,
  fullWidth: false,
  hierarchy: 'primary',
})

const modelValue = defineModel<string>({
  required: true,
})

const computedTabs = computed(() => {
  const tabs: Record<string, Tab> = {}

  for (const key in props.tabs) {
    if (typeof props.tabs[key] === 'string')
      tabs[key] = { text: props.tabs[key] as string }
    else
      tabs[key] = props.tabs[key] as Tab
  }

  return tabs
})

const arrayTabs = computed(() => {
  return Object.entries(computedTabs.value)
    .map(([key, props]) => ({ key, ...props }))
})
</script>

<template>
  <neb-compact>
    <template #normal-mode="{ setNormalModeRef }">
      <div :class="{ [props.hierarchy]: true }">
        <ul
          :ref="setNormalModeRef"
          class="neb-tabs"
          :class="{
            'vertical': props.vertical,
            'full-width': props.fullWidth,
          }"
        >
          <li
            v-for="(tab, key) in computedTabs"
            :key="key"
            :class="{ active: modelValue === key, disabled: tab.disabled }"
          >
            <input v-model="modelValue" :disabled="tab.disabled" type="radio" :value="key" name="tabs">

            <slot :key="key" :tab="tab">
              <icon v-if="tab.icon" :name="tab.icon" />

              <div class="tab-texts">
                <span>{{ tab.text }}</span>

                <p v-if="tab.description">
                  {{ tab.description }}
                </p>
              </div>

              <neb-badge v-if="tab.count" small class="count-badge">
                {{ tab.count }}
              </neb-badge>
            </slot>
          </li>
        </ul>
      </div>
    </template>

    <template #compact-mode>
      <neb-select
        v-model="modelValue"
        :options="arrayTabs"
        label-key="text"
        track-by-key="key"
        use-only-tracked-key
        no-search
        :allow-empty="false"
      >
        <template v-if="computedTabs[modelValue]!.icon" #leading>
          <icon class="mobile-icon" :name="computedTabs[modelValue]!.icon!" />
        </template>

        <template #option="{ option }">
          <!-- TODO: -->
          <icon v-if="option.icon" :name="option.icon" class="mobile-icon" />

          <div :class="{ 'option-text': !option.icon }">
            {{ option.text }}
          </div>
        </template>
      </neb-select>
    </template>
  </neb-compact>
</template>

<style scoped>
.primary {
  ul {
    margin: 0;
    padding: var(--space-1);
    list-style: none;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: var(--neutral-color-50);
    border: 1px solid var(--neutral-color-200);
    border-radius: var(--radius-default);

    &.full-width li {
      flex: 1;
    }
    &.vertical {
      flex-direction: column;
      width: fit-content;

      li {
        width: 100%;
        min-height: 36px;
      }
    }
  }
  li {
    height: 36px;
    justify-content: center;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    text-wrap: nowrap;
    align-items: center;
    gap: var(--space-2);
    padding: 0 var(--space-3);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--neutral-color-500);
    transition: all var(--duration-default);
    border-radius: var(--radius-small);

    &:hover {
      color: var(--neutral-color-700);
    }
    input {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      cursor: pointer;
      left: 0;
      bottom: 0;
      right: 0;
      opacity: 0;
    }
    .icon {
      width: 20px;
      height: 20px;
    }
    &.active {
      color: var(--neutral-color-700);
      background: #fff;
      box-shadow: var(--shadow-sm);

      &.disabled {
        color: var(--neutral-color-400);
      }
    }
    &.disabled {
      color: var(--neutral-color-400);

      input {
        cursor: not-allowed;
      }
    }
  }
}

.tertiary {
  ul {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    border-bottom: 2px solid var(--neutral-color-200);

    &.vertical {
      flex-direction: column;
      width: fit-content;
      border-bottom: 0;
      gap: var(--space-1);
      border-left: 3px solid var(--neutral-color-200);

      li {
        width: 100%;
        padding: var(--space-2) var(--space-3);
        border-left: 3px solid transparent;
        margin-left: -6px;
        border-bottom: none;
        margin-bottom: 0;
        justify-content: flex-start;
        align-items: flex-start;

        &.active {
          background: linear-gradient(
            90deg,
            rgba(var(--primary-color-component), 0.15) 0%,
            rgba(var(--primary-color-component), 0) 90%
          );
          color: var(--primary-color);
          border-color: var(--primary-color);

          &.disabled {
            color: var(--neutral-color-400);
          }
        }
        .icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }
      }
      .tab-texts {
        gap: var(--space-1);
      }
    }
    &.full-width {
      width: 100%;

      li {
        flex: 1;
      }
    }
  }
  li {
    padding: 0 var(--space-1) var(--space-3);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    flex-wrap: nowrap;
    text-wrap: nowrap;
    align-items: center;
    gap: var(--space-3);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--neutral-color-600);
    transition: all var(--duration-default);
    border-bottom: 2px solid var(--neutral-color-200);
    margin-bottom: -2px;

    &:hover {
      color: var(--neutral-color-700);
    }
    input {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      cursor: pointer;
      left: 0;
      bottom: 0;
      right: 0;
      opacity: 0;
    }
    .icon {
      width: 22px;
      height: 22px;
    }
    &.active {
      color: var(--primary-color);
      border-color: var(--primary-color);

      &.disabled {
        color: var(--neutral-color-400);
      }
    }
    &.disabled {
      color: var(--neutral-color-400);

      input {
        cursor: not-allowed;
      }
    }
  }
  .tab-texts {
    display: flex;
    flex-direction: column;

    p {
      font-size: var(--text-sm);
      font-weight: 400;
    }
  }
}
.count-badge {
  font-weight: 600;
  color: var(--neutral-color-600);
}
.mobile-icon {
  font-size: 20px !important;
}
.option-text {
  margin-left: 28px;
}
.dark-mode {
  .primary {
    ul {
      margin: 0;
      background: var(--neutral-color-900);
      border: 1px solid var(--neutral-color-800);
    }
    li {
      color: var(--neutral-color-400);

      &.active {
        color: var(--neutral-color-200);
        background: var(--neutral-color-950);

        &.disabled {
          color: var(--neutral-color-500);
          background: var(--neutral-color-800);
        }
      }
      &.disabled {
        color: var(--neutral-color-500);
      }
    }
  }
}
</style>
