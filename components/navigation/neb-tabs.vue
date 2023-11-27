<script setup lang="ts">
interface Tab {
  text: string
  icon?: string
  disabled?: boolean
  count?: number
}

const props = withDefaults(defineProps<{
  tabs: Record<string, Tab | string>
  vertical?: boolean
  fullWidth?: boolean
}>(), {
  vertical: false,
  fullWidth: false,
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
      <ul :ref="setNormalModeRef" class="neb-tabs" :class="{ 'vertical': props.vertical, 'full-width': props.fullWidth }">
        <li
          v-for="(tab, key) in computedTabs"
          :key="key"
          :class="{ active: modelValue === key, disabled: tab.disabled }"
        >
          <input v-model="modelValue" :disabled="tab.disabled" type="radio" :value="key" name="tabs">

          <slot :key="key" :tab="tab">
            <icon v-if="tab.icon" :name="tab.icon" />
            <p>{{ tab.text }}</p>
            <neb-badge v-if="tab.count" small>
              {{ tab.count }}
            </neb-badge>
          </slot>
        </li>
      </ul>
    </template>

    <template #compact-mode>
      <neb-select
        v-model="modelValue"
        :options="arrayTabs"
        label-key="text"
        track-by-key="key"
        use-only-tracked-key
        no-search
      />
    </template>
  </neb-compact>
</template>

<style scoped>
fieldset {
  border: none;
  padding: 0;
  margin: 0;
}
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

  &.full-width li{
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
    background: var(--white-color);
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

.dark-mode {
  ul {
    margin: 0;
    background: var(--neutral-color-900);
    border: 1px solid var(--neutral-color-800);
  }
  li {
    color: var(--neutral-color-400);

    &.active {
      color: var(--neutral-color-200);
      background: var(--neutral-color-975);

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
</style>
