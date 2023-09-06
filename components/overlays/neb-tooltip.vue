<script lang="ts" setup>
import { autoPlacement, offset, shift, useFloating } from '@floating-ui/vue'
import type { UseFloatingOptions } from '@floating-ui/vue'

const props = defineProps<{
  floatingOptions?: UseFloatingOptions
  title: string
  text?: string
}>()

const floatingOptions: UseFloatingOptions = {
  middleware: [offset(8), autoPlacement(), shift({ padding: 4 })], // TODO: use the --space-1 and --space-2 css vars
  ...props.floatingOptions,
  transform: false,
}

const trigger = ref<HTMLElement | null>(null)
const dropdown = ref<HTMLElement | null>(null)

const { floatingStyles } = useFloating(trigger, dropdown, floatingOptions)
</script>

<template>
  <div class="neb-tooltip">
    <div ref="trigger" class="tooltip-trigger">
      <slot />
    </div>

    <div ref="dropdown" class="tooltip-box" :style="floatingStyles">
      <div class="tooltip-animation-wrapper">
        <h6>{{ title }}</h6>

        <p v-if="text">
          {{ text }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neb-tooltip {
  width: fit-content;

  &:hover {
    .tooltip-animation-wrapper {
      animation: overlay-transition var(--duration-default) forwards;
    }
    .tooltip-box {
      opacity: 1;
      visibility: visible;
    }
  }
}
.tooltip-trigger {
  position: relative;
}
.tooltip-box {
  opacity: 0;
  visibility: hidden;
  width: max-content;
  z-index: 10;
  max-width: 300px;
}
.tooltip-animation-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  white-space: pre-line;
  line-height: 18px;
  background: var(--white-color);
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
    background: var(--neutral-color-975);
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
