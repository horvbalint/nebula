<script lang="ts" setup>
import { nebSideNavRailKey, nebSideNavTooltipOptions } from '@nebula/composables/neb-side-nav'
import { createReusableTemplate } from '@vueuse/core'

withDefaults(defineProps<{
  icon: string
  text: string
  to?: string
  intent?: 'neutral' | 'error'
}>(), {
  intent: 'neutral',
})

const emit = defineEmits<{
  click: []
}>()

const isRail = inject(nebSideNavRailKey, ref(false))

const [defineRow, reuseRow] = createReusableTemplate()
</script>

<template>
  <define-row>
    <NuxtLink
      v-if="to"
      :to
      class="neb-side-nav-action"
      :class="[`intent-${intent}`, { rail: isRail }]"
      @click="emit('click')"
    >
      <Icon :name="icon" class="action-icon" />
      <span class="action-label">{{ text }}</span>
    </NuxtLink>

    <button
      v-else
      type="button"
      class="neb-side-nav-action"
      :class="[`intent-${intent}`, { rail: isRail }]"
      @click="emit('click')"
    >
      <Icon :name="icon" class="action-icon" />
      <span class="action-label">{{ text }}</span>
    </button>
  </define-row>

  <neb-tooltip v-if="isRail" :title="text" :timing="0" :floating-options="nebSideNavTooltipOptions">
    <reuse-row />
  </neb-tooltip>

  <reuse-row v-else />
</template>

<style scoped>
.neb-side-nav-action {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-3);
  border: none;
  border-radius: var(--radius-default);
  background: transparent;
  font: var(--neb-font-label);
  color: var(--neb-text-muted);
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  transition:
    background var(--duration-fast),
    color var(--duration-fast),
    box-shadow var(--duration-fast);

  &:hover {
    background: var(--neb-bg-hover);
    color: var(--neb-text);
  }
  &:active {
    background: var(--neb-bg-active);
  }
  &:focus-visible {
    box-shadow: var(--neb-ring-primary);
  }
  &.intent-error {
    color: var(--neb-text-error);

    &:hover {
      background: var(--neb-bg-error-subtle);
      color: var(--neb-text-error-hover);
    }
    &:focus-visible {
      box-shadow: var(--neb-ring-error);
    }
  }
  &.rail .action-label {
    opacity: 0;
  }
}
.action-icon {
  flex-shrink: 0;
  width: var(--icon-md);
  height: var(--icon-md);
  font-size: var(--icon-md);
}
.action-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity var(--duration-fast);
}
</style>
