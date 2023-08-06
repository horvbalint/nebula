<template>
  <neb-header-nav :menus="menus">
    <template #logo>
      <p class="logo">Nebula</p>
    </template>
  </neb-header-nav>

  <slot />
</template>

<script lang="ts" setup>
const menus = [
  {
    text: 'Fő oldal',
    path: '/'
  },
  {
    text: 'Dashboard',
    path: '/temp'
  },
  {
    text: 'Beallitasok',
    path: '/wef'
  },
  {
    text: 'Felhasznalok',
    path: '/temp'
  },
  {
    text: 'Partnerek',
    path: '/temp'
  },
  {
    text: 'Torzsadatok',
    path: '/temp'
  },
  {
    text: 'Jogosultsagok',
    path: '/temp'
  },
]
</script>

<style lang="scss" scoped>
p {
  color: var(--neutral-color-600);
  font-size: var(--title-xs);
  font-weight: 500;
}
.dark-mode {
  p {
    color: var(--neutral-color-200);
  }
}
</style>
