<template>
  <div>
    <neb-route-breadcrumbs with-icons/>
    <neb-breadcrumbs :crumbs="crumbs2"/>
    <neb-breadcrumbs :crumbs="crumbs"/>
  </div>
</template>

<script lang="ts" setup>
  const crumbs = ref(['Fő oldal', "Első aloldal", "Második aloldal"])
  const crumbs2 = ref([
    {
      id: '/nested',
      text: 'Fő oldal',
      icon: 'material-symbols:garage-home-outline'
    },
    {
      id: '/nested/nested2',
      text: 'Első aloldal',
      icon: 'material-symbols:home-max-outline'
    },
    {
      id: '/nested/nested2/nested3',
      text: 'Második aloldal',
      icon: ''
    }
  ])

  definePageMeta({
    nebula: {
      name: 'Nested 3',
      icon: 'svg-spinners:gooey-balls-1',
      skipFromMenu: true
    }
  })
</script>