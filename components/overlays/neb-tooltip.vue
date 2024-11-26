<script lang="ts" setup>
import type { UseFloatingOptions } from '@floating-ui/vue'
import { autoPlacement, offset, shift } from '@floating-ui/vue'

const props = withDefaults(defineProps<{
  floatingOptions?: UseFloatingOptions
  title: string
  text?: string
  timing?: number
}>(), {
  timing: 1000,
})

const timer = ref<ReturnType<typeof setTimeout> | undefined>(undefined)

function delayOpen(open: () => void) {
  timer.value = setTimeout(() => {
    open()
  }, props.timing)
}
function closeTooltip(close: () => void) {
  clearTimeout(timer.value)
  close()
}
const floatingOptions: UseFloatingOptions = {
  middleware: [offset(8), autoPlacement(), shift({ padding: 4 })], // TODO: use the --space-1 and --space-2 css vars
  ...props.floatingOptions,
}
</script>

<template>
  <neb-dropdown class="neb-tooltip" :floating-options="floatingOptions">
    <template #trigger="{ open, close }">
      <div @mouseenter="delayOpen(open)" @mouseleave="closeTooltip(close)">
        <slot />
      </div>
    </template>

    <template #content>
      <div class="tooltip-animation-wrapper">
        <h6>{{ title }}</h6>

        <p v-if="text">
          {{ text }}
        </p>
      </div>
    </template>
  </neb-dropdown>
</template>

<style scoped>
.tooltip-animation-wrapper {
  z-index: 10;
  max-width: 300px;
  width: max-content;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  white-space: pre-line;
  line-height: 18px;
  background: #fff;
  border: 1px solid var(--neutral-color-100);
  padding: var(--space-2) var(--space-3);
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-default);

  h6 {
    color: var(--neutral-color-700);
    font-weight: 600;
    font-size: var(--text-xs);
  }
  p {
    font-weight: 500;
    color: var(--neutral-color-500);
    font-size: var(--text-xs);
  }
}
.dark-mode {
  .tooltip-animation-wrapper {
    background: var(--neutral-color-950);
    border: 1px solid var(--neutral-color-800);

    h6 {
      color: var(--neutral-color-300);
    }
    p {
      color: var(--neutral-color-400);
    }
  }
}
</style>
