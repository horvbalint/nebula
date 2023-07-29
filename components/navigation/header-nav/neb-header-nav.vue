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

const desktopHeader = ref(null as null | HTMLElement)
const desktopHeaderContent = ref(null as null | HTMLElement)

onMounted(() => {
  mobileMode.value = desktopHeaderContent.value!.clientWidth < desktopHeaderContent.value!.scrollWidth
})
</script>

<template>
  <header v-if="!mobileMode" ref="desktopHeader" class="desktop-mode">
    <div ref="desktopHeaderContent" class="header-content">
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

  <header v-else class="mobile-mode">
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
        <icon name="material-symbols:close-rounded" color="#fff" />
      </neb-button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  height: 72px;
  border-bottom: 1px solid $neutral-color-200;
  padding: $space-m;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: $space-m;
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
  gap: $space-xxs;
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
  padding: $space-s;
  padding-left: $space-m;
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
    top: $space-s;
    z-index: 1;
    right: 0;
  }
  .header-content-main {
    height: 100vh;
    background: #fff;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    flex-direction: column;
    align-items: flex-start;
    width: 85vw;
    padding: $space-m;
    animation: fade $duration-default forwards;
    border-right: $neutral-color-300;
  }
  .mobile-logo-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: $space-m;
  }
  .nav-items, .secondary-actions {
    flex-direction: column;
    width: 100%;
  }
  .log-out {
    width: 100%;
    justify-content: flex-start;

    span {
      color: $neutral-color-600;
    }
  }
}

.slide-enter-active {
  animation: slide-in $duration-default;
}
.slide-leave-active {
  animation: slide-in $duration-default reverse;
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
    box-shadow: 15vw 0px 0px 0px rgba($neutral-color-500, 0);
  }
  100% {
    box-shadow: 15vw 0px 0px 0px $neutral-color-500;
  }
}
</style>
