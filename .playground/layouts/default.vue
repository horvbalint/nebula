<template>
  <neb-header-nav :menus="menus">
    <template #logo>
      <p>Temp</p>
    </template>

    <template #mobile-logo>
      <p>Pillango</p>
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
  font-size: 30px;
}

p {
  font-size: 18px;
}
</style>
