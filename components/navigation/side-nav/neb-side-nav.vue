<script lang="ts" setup>
import type { Route } from '@nebula/composables/routes'
import { nebSideNavRailKey, nebSideNavTooltipOptions } from '@nebula/composables/neb-side-nav'
import { findActiveRoutePath } from '@nebula/composables/routes'
import { createReusableTemplate, onKeyStroke, useScrollLock } from '@vueuse/core'

const props = withDefaults(defineProps<{
  fromRouter?: boolean
  routes?: Route[]
  collapsible?: boolean
  label?: string
}>(), {
  fromRouter: true,
  collapsible: true,
})

const collapsed = defineModel<boolean>('collapsed', { default: false })

const computedRoutes = computed(() => {
  if (!props.fromRouter) {
    if (!props.routes)
      throw new Error('neb-side-nav: If the "fromRouter" props is set to false, you must provide the "routes" prop.')

    return props.routes
  }

  return generateNavTree()
})

const currentRoute = useRoute()
const activePath = computed(() => findActiveRoutePath(computedRoutes.value, currentRoute.path))

const { isMobile } = useAppBreakpoints()
const isRail = computed(() => props.collapsible && collapsed.value && !isMobile.value)
provide(nebSideNavRailKey, isRail)

const isDrawerOpen = ref(false)
const isBodyLocked = useScrollLock(import.meta.client ? document.body : null)
watch(isDrawerOpen, open => isBodyLocked.value = open)
watch(isMobile, () => isDrawerOpen.value = false)
watch(() => currentRoute.fullPath, () => isDrawerOpen.value = false)
onKeyStroke('Escape', () => isDrawerOpen.value = false)

const [definePanel, reusePanel] = createReusableTemplate<{ rail: boolean }>()
</script>

<template>
  <define-panel v-slot="{ rail }">
    <div class="panel-header">
      <div class="logo">
        <slot name="logo" :collapsed="rail" />
      </div>

      <neb-button
        v-if="isMobile"
        type="tertiary"
        intent="neutral"
        square
        small
        :aria-label="$t('nebula.side-nav.closeMenu')"
        @click="isDrawerOpen = false"
      >
        <icon name="material-symbols:close-rounded" />
      </neb-button>
    </div>

    <nav class="panel-nav" :aria-label="label || $t('nebula.side-nav.label')">
      <neb-side-nav-list
        :routes="computedRoutes"
        :active-path
        :collapsed="rail"
        :depth="0"
        @navigate="isDrawerOpen = false"
      />
    </nav>

    <div v-if="$slots.footer" class="panel-segment">
      <slot name="footer" :collapsed="rail" />
    </div>
  </define-panel>

  <aside v-if="!isMobile" class="neb-side-nav" :class="{ rail: isRail }">
    <div class="panel">
      <reuse-panel :rail="isRail" />
    </div>

    <neb-tooltip
      v-if="collapsible"
      class="collapse-toggle-anchor"
      :title="isRail ? $t('nebula.side-nav.expand') : $t('nebula.side-nav.collapse')"
      :floating-options="nebSideNavTooltipOptions"
    >
      <button
        type="button"
        class="collapse-toggle"
        :aria-label="isRail ? $t('nebula.side-nav.expand') : $t('nebula.side-nav.collapse')"
        :aria-expanded="!isRail"
        @click="collapsed = !isRail"
      >
        <icon name="material-symbols:chevron-left-rounded" />
      </button>
    </neb-tooltip>
  </aside>

  <header v-else class="neb-side-nav-bar">
    <div class="logo">
      <slot name="mobile-logo">
        <slot name="logo" :collapsed="false" />
      </slot>
    </div>

    <neb-button
      type="tertiary"
      intent="neutral"
      square
      small
      :aria-label="$t('nebula.side-nav.openMenu')"
      :aria-expanded="isDrawerOpen"
      @click="isDrawerOpen = true"
    >
      <icon name="material-symbols:menu-rounded" />
    </neb-button>

    <Teleport to="body">
      <transition name="neb-side-nav-fade">
        <div v-if="isDrawerOpen" class="neb-side-nav-backdrop" @click="isDrawerOpen = false" />
      </transition>

      <transition name="neb-side-nav-slide">
        <aside v-if="isDrawerOpen" class="neb-side-nav drawer" role="dialog" aria-modal="true">
          <div class="panel">
            <reuse-panel :rail="false" />
          </div>
        </aside>
      </transition>
    </Teleport>
  </header>
</template>

<style scoped>
.neb-side-nav {
  --side-nav-width: 264px;
  --side-nav-rail-width: 68px;

  position: sticky;
  top: 0;
  /* Keeps the toggle, which hangs over the border, above the page content. */
  z-index: 1;
  flex-shrink: 0;
  width: var(--side-nav-width);
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--neb-bg-raised);
  border-right: 1px solid var(--neb-border-subtle);
  transition: width var(--duration-default) var(--ease-default);

  &.rail {
    width: var(--side-nav-rail-width);
  }
  &.drawer {
    position: fixed;
    z-index: 101;
    left: 0;
    width: min(var(--side-nav-width) + var(--space-8), 85vw);
    border-right: none;
    box-shadow: var(--neb-shadow-xl);
  }
}
.panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
/* Doubled class: neb-dropdown's own `position: relative` has the same specificity. */
.collapse-toggle-anchor.collapse-toggle-anchor {
  position: absolute;
  /* Level with the centre of the logo row. */
  top: var(--space-10);
  right: 0;
  transform: translate(50%, -50%);
}
.collapse-toggle {
  width: var(--space-6);
  height: var(--space-6);
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid var(--neb-border-subtle);
  border-radius: 50%;
  background: var(--neb-bg-raised);
  color: var(--neb-text-subtle);
  box-shadow: var(--neb-shadow-sm);
  cursor: pointer;
  outline: none;
  transition:
    background var(--duration-fast),
    color var(--duration-fast),
    border-color var(--duration-fast),
    box-shadow var(--duration-fast);

  .icon {
    width: var(--icon-md);
    height: var(--icon-md);
    transition: transform var(--duration-default) var(--ease-default);
  }
  &:hover {
    background: var(--neb-bg-hover);
    border-color: var(--neb-border);
    color: var(--neb-text);
  }
  &:focus-visible {
    box-shadow: var(--neb-ring-primary);
  }
  .rail & .icon {
    transform: scaleX(-1);
  }
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-6) var(--space-4) var(--space-5);
}
.logo {
  min-width: 0;
  flex: 1;
}
.panel-nav {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: var(--space-2) var(--space-3) var(--space-4);
  scrollbar-width: thin;
}
.panel-segment {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3);
  border-top: 1px solid var(--neb-border-subtle);
}
.neb-side-nav-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  min-height: 56px;
  background: var(--neb-bg-raised);
  border-bottom: 1px solid var(--neb-border-subtle);
}
.neb-side-nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--neb-bg-backdrop);
}

.neb-side-nav-fade-enter-active,
.neb-side-nav-fade-leave-active {
  transition: opacity var(--duration-default) var(--ease-default);
}
.neb-side-nav-fade-enter-from,
.neb-side-nav-fade-leave-to {
  opacity: 0;
}
.neb-side-nav-slide-enter-active,
.neb-side-nav-slide-leave-active {
  transition: transform var(--duration-default) var(--ease-default);
}
.neb-side-nav-slide-enter-from,
.neb-side-nav-slide-leave-to {
  transform: translateX(-100%);
}
</style>
