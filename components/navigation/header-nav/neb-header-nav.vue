<script lang="ts" setup>
interface Route {
  name: string
  path: string
}

const props = withDefaults(defineProps<{
  fromRouter?: boolean
  routes?: Route[]
}>(), {
  fromRouter: true,
})

defineEmits<{
  logout: []
}>()

const computedRoutes = computed(() => {
  if (!props.fromRouter) {
    if (!props.routes)
      throw new Error('neb-header-nav: If the "fromRouter" props is set to false, you must provide the "routes" prop.')

    return props.routes
  }

  return generateNavTree()
})

const mobileMode = ref(false)
const showMobileMenu = ref(false)
</script>

<template>
  <neb-compact>
    <template #normal-mode="{ setNormalModeRef }">
      <header class="desktop-mode">
        <div :ref="setNormalModeRef" class="header-content">
          <slot name="logo" />

          <div class="header-content-main">
            <div class="nav-items">
              <neb-header-nav-item
                v-for="route in computedRoutes"
                :key="route.path"
                :text="route.name"
                :path="route.path"
              />
            </div>

            <div class="secondary-actions">
              <slot name="secondary-actions">
                <neb-button type="tertiary-neutral" class="log-out" @click="$emit('logout')">
                  <icon name="material-symbols:logout-rounded" /> <span>Kijelentkezés</span>
                </neb-button>
              </slot>
            </div>
          </div>
        </div>
      </header>
    </template>

    <template #compact-mode>
      <header class="mobile-mode">
        <slot name="mobile-logo">
          <slot name="logo" />
        </slot>

        <transition name="slide">
          <div v-if="showMobileMenu" class="header-content-main">
            <div class="mobile-logo-wrapper">
              <slot name="mobile-logo">
                <slot name="logo" />
              </slot>

              <div class="nav-items">
                <neb-header-nav-item
                  v-for="route in computedRoutes"
                  :key="route.path"
                  :text="route.name"
                  :path="route.path"
                />
              </div>
            </div>

            <div class="secondary-actions">
              <slot name="secondary-actions">
                <neb-button type="tertiary-neutral" class="log-out" @click="$emit('logout')">
                  <icon name="material-symbols:logout-rounded" /> <span v-if="mobileMode">Kijelentkezés</span>
                </neb-button>
              </slot>
            </div>
          </div>
        </transition>

        <div v-if="!showMobileMenu" class="open-mobile-menu">
          <neb-button type="tertiary-neutral" @click="showMobileMenu = true">
            <icon name="material-symbols:menu-rounded" />
          </neb-button>
        </div>

        <div v-else class="close-mobile-menu">
          <neb-button type="tertiary-neutral" @click="showMobileMenu = false">
            <icon name="material-symbols:close-rounded" color="var(--white-color)" />
          </neb-button>
        </div>
      </header>
    </template>
  </neb-compact>
</template>

<style scoped>
header {
  height: 72px;
  border-bottom: 1px solid var(--neutral-color-200);
  padding: var(--space-6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.desktop-mode {
  overflow: hidden;
}
.header-content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: var(--space-6);
}
.header-content-main {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-items {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.logo {
  width: 120px;
  cursor: pointer;
}
.secondary-actions {
  display: flex;
  align-items: center;
  gap: 0;
}
.mobile-mode {
  padding: var(--space-4);
  padding-left: var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .open-mobile-menu {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
  .close-mobile-menu {
    position: fixed;
    top: var(--space-4);
    z-index: 1;
    right: 0;
  }
  .header-content-main {
    height: 100vh;
    background: var(--white-color);
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    flex-direction: column;
    align-items: flex-start;
    width: 85vw;
    padding: var(--space-6);
    animation: fade var(--duration-default) forwards;
    border-right: var(--neutral-color-300);
  }
  .mobile-logo-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  .nav-items, .secondary-actions {
    flex-direction: column;
    width: 100%;
  }
  .log-out {
    width: 100%;
    justify-content: flex-start;

    & span {
      color: var(--neutral-color-600);
    }
  }
}
.slide-enter-active {
  animation: slide-in var(--duration-default);
}
.slide-leave-active {
  animation: slide-in var(--duration-default) reverse;
}
@keyframes slide-in {
  0% {
    transform: translateX(-85vw);
  }
  100% {
    transform: translateX(0vw);
  }
}
@keyframes fade {
  0% {
    box-shadow: 15vw 0px 0px 0px rgba(var(--neutral-color-component-500), 0);
  }
  100% {
    box-shadow: 15vw 0px 0px 0px var(--neutral-color-500);
  }
}

.dark-mode {
  & header {
    border-color: var(--neutral-color-800);
  }

  .mobile-mode {
    .header-content-main {
      background: var(--neutral-color-975);
      border-color: var(--neutral-color-800);
    }
    .log-out {
      & span {
        color: var(--neutral-color-600);
      }
    }
  }
}
</style>
