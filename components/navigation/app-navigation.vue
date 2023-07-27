<script>
import { signOut } from 'firebase/auth'

export default {
  data() {
    return {
      currentPath: '',
      selectedItem: null,
      showMobileMenu: true,
      menuItems: [
        {
          text: 'Nyilvántartott ebek',
          path: '/',
        },
        {
          text: 'Felhasználók',
          path: '/users',
        },
        {
          text: 'Beállitások',
          path: '/settings',
        },
      ],
    }
  },
  methods: {
    logout() {
      signOut(this.$auth)
        .then(() => { navigateTo('/login') })
        .catch(err => console.error(err))
    },
  },
}
</script>

<template>
  <div>
    <header>
      <div class="header-content">
        <img class="logo" src="@/logo.png" alt="" @click="navigateTo('/')">

        <transition name="slide">
          <div v-if="showMobileMenu" class="header-content-main">
            <div class="mobile-logo-wrapper">
              <img class="logo" src="@/logo.png" alt="" @click="navigateTo('/')">

              <div class="nav-items">
                <navigation-item
                  v-for="item in menuItems"
                  :key="item"
                  :text="item.text"
                  :path="item.path"
                />
              </div>
            </div>

            <div class="secondary-actions">
              <ut-button type="tertiary-neutral" class="log-out" @click="logout()">
                <icon name="material-symbols:logout-rounded" /> <span>Kijelentkezés</span>
              </ut-button>
            </div>
          </div>
        </transition>

        <div v-if="!showMobileMenu" class="open-mobile-menu">
          <ut-button type="tertiary-neutral" @click="showMobileMenu = true">
            <icon name="material-symbols:menu-rounded" />
          </ut-button>
        </div>

        <div v-else class="close-mobile-menu">
          <ut-button type="tertiary-neutral" @click="showMobileMenu = false">
            <icon name="material-symbols:close-rounded" color="#fff" />
          </ut-button>
        </div>
      </div>
    </header>
  </div>
</template>

<style lang="scss" scoped>
header {
  height: 72px;
  border-bottom: 1px solid $neutral-color-200;
  padding: $space-m;
  display: flex;
  justify-content: center;
  flex-direction: column;
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

  .logo {
    display: none;
  }
}
.nav-items {
  display: flex;
  align-items: center;
  gap: $space-xxs;
}
.log-out {
  span {
    display: none;
  }
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
.open-mobile-menu {
  display: none;

}
.close-mobile-menu {
  display: none;
}

@media only screen and (max-width: $tablet) {
  header {
    padding: $space-s;
    padding-left: $space-m;
  }
  .open-mobile-menu {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
  .close-mobile-menu {
    display: block;
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

    .logo {
      display: block;
    }
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
      display: inline-block;
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
