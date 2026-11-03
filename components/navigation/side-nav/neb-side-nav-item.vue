<script lang="ts" setup>
import type { UseFloatingOptions } from '@floating-ui/vue'
import type { Route } from '@nebula/composables/routes'
import { flip, offset, shift } from '@floating-ui/vue'
import { nebSideNavTooltipOptions } from '@nebula/composables/neb-side-nav'
import { isActiveRoute, routeContainsActive } from '@nebula/composables/routes'
import { createReusableTemplate } from '@vueuse/core'

const props = defineProps<{
  route: Route
  activePath: string | null
  collapsed: boolean
  depth: number
}>()

const emit = defineEmits<{
  navigate: []
}>()

const hasChildren = computed(() => !!props.route.subRoutes?.length)
const isActive = computed(() => !hasChildren.value && isActiveRoute(props.route, props.activePath))
const containsActive = computed(() => routeContainsActive(props.route, props.activePath))

const isExpanded = ref(containsActive.value)
watch(containsActive, (contains) => {
  if (contains)
    isExpanded.value = true
})

const childListId = useId()

// `fixed` lets the flyout escape the rail's `overflow: hidden`.
const flyoutOptions: UseFloatingOptions = {
  placement: 'right-start',
  strategy: 'fixed',
  middleware: [offset(12), flip({ padding: 4 }), shift({ padding: 4 })],
}

const [defineContent, reuseContent] = createReusableTemplate()
const [defineLink, reuseLink] = createReusableTemplate()
const [defineFlyoutTrigger, reuseFlyoutTrigger] = createReusableTemplate<{ toggle: () => void, isOpen: boolean }>()
</script>

<template>
  <define-content>
    <icon v-if="route.icon" :name="route.icon" class="item-icon" />
    <span v-else-if="depth === 0" class="item-icon item-initial">{{ route.name.charAt(0) }}</span>

    <span class="item-label">{{ route.name }}</span>

    <icon
      v-if="hasChildren"
      name="material-symbols:keyboard-arrow-down-rounded"
      class="item-chevron"
      :class="{ open: isExpanded }"
    />
  </define-content>

  <define-link>
    <NuxtLink
      :to="route.path"
      class="item-row"
      :class="{ active: isActive, rail: collapsed }"
      :aria-current="isActive ? 'page' : undefined"
      @click="emit('navigate')"
    >
      <reuse-content />
    </NuxtLink>
  </define-link>

  <define-flyout-trigger v-slot="{ toggle, isOpen }">
    <button
      type="button"
      class="item-row rail"
      :class="{ highlighted: containsActive, pressed: isOpen }"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      @click="toggle()"
    >
      <reuse-content />
    </button>
  </define-flyout-trigger>

  <li class="neb-side-nav-item" :class="{ nested: depth > 0 }">
    <template v-if="!hasChildren">
      <neb-tooltip v-if="collapsed" :title="route.name" :timing="0" :floating-options="nebSideNavTooltipOptions">
        <reuse-link />
      </neb-tooltip>

      <reuse-link v-else />
    </template>

    <neb-dropdown v-else-if="collapsed" :floating-options="flyoutOptions">
      <template #trigger="{ toggle, isOpen }">
        <!-- The tooltip would sit on top of the open flyout, so it only exists while closed. -->
        <neb-tooltip v-if="!isOpen" :title="route.name" :timing="0" :floating-options="nebSideNavTooltipOptions">
          <reuse-flyout-trigger :toggle :is-open />
        </neb-tooltip>

        <reuse-flyout-trigger v-else :toggle :is-open />
      </template>

      <template #content="{ close }">
        <div class="flyout">
          <p class="flyout-title">
            {{ route.name }}
          </p>

          <neb-side-nav-list
            :routes="route.subRoutes!"
            :active-path
            :collapsed="false"
            :depth="0"
            @navigate="close(); emit('navigate')"
          />
        </div>
      </template>
    </neb-dropdown>

    <template v-else>
      <button
        type="button"
        class="item-row"
        :class="{ highlighted: containsActive && !isExpanded }"
        :aria-expanded="isExpanded"
        :aria-controls="childListId"
        @click="isExpanded = !isExpanded"
      >
        <reuse-content />
      </button>

      <div :id="childListId" v-neb-expand="isExpanded" class="children">
        <neb-side-nav-list
          :routes="route.subRoutes!"
          :active-path
          :collapsed
          :depth="depth + 1"
          @navigate="emit('navigate')"
        />
      </div>
    </template>
  </li>
</template>

<style scoped>
.item-row {
  position: relative;
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
  &:active,
  &.pressed {
    background: var(--neb-bg-active);
  }
  &:focus-visible {
    box-shadow: var(--neb-ring-primary);
  }
  &.active,
  &.highlighted {
    background: var(--neb-bg-selected);
    color: var(--neb-text-primary);
  }
  &.active {
    font: var(--neb-font-label-strong);
  }
}
.item-icon {
  flex-shrink: 0;
  width: var(--icon-md);
  height: var(--icon-md);
  font-size: var(--icon-md);
}
.item-initial {
  display: grid;
  place-items: center;
  border-radius: var(--radius-small);
  background: var(--neb-bg-muted);
  font: var(--neb-font-caption);
}
.item-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity var(--duration-fast);
}
.item-chevron {
  flex-shrink: 0;
  width: var(--icon-sm);
  height: var(--icon-sm);
  color: var(--neb-text-subtle);
  transition:
    transform var(--duration-default) var(--ease-default),
    opacity var(--duration-fast);

  &.open {
    transform: rotate(180deg);
  }
}

.nested > .item-row {
  height: 32px;
  padding: 0 var(--space-2);
  gap: var(--space-2);

  .item-icon {
    width: var(--icon-sm);
    height: var(--icon-sm);
    font-size: var(--icon-sm);
  }
  &.active::before {
    content: '';
    position: absolute;
    top: var(--space-2);
    bottom: var(--space-2);
    /* Sits on top of the list's guide line. */
    left: calc(-1 * var(--space-2) - 1.5px);
    width: 2px;
    border-radius: 2px;
    background: var(--neb-bg-primary-solid);
  }
}

.item-row.rail {
  .item-label,
  .item-chevron {
    opacity: 0;
  }
}

.flyout {
  min-width: 220px;
  max-height: calc(100vh - var(--space-8));
  overflow-y: auto;
  padding: var(--space-2);
  border: 1px solid var(--neb-border-subtle);
  border-radius: var(--radius-default);
  background: var(--neb-bg-raised);
  box-shadow: var(--neb-shadow-lg);
}
.flyout-title {
  padding: var(--space-1) var(--space-3) var(--space-2);
  font: var(--neb-font-label-strong);
  color: var(--neb-text);
}
</style>
