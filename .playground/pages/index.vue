<script setup lang="ts">
definePageMeta({
  name: 'Fő oldal',
  nebula: {
    skipFromMenu: false
  }
})

const input = ref('')
const checkbox = ref(false)
const popUpOpen = ref(false)
const popUp2 = ref(false)
</script>

<template>
  <h1>Nebula</h1>

  <neb-input disabled required v-model="input" label="Test input" placeholder="Write here..." />
  <neb-checkbox v-model="checkbox" label="Test checkbox" />

  <div class="buttons">
    <neb-button @click="popUpOpen = true">Primary</neb-button>
  </div>

  <neb-pop-up v-model="popUpOpen">
    <div class="pop-up-body-1">
      <neb-button @click="popUp2 = true">Open second</neb-button>
    </div>
  </neb-pop-up>

  <neb-pop-up v-model="popUp2">
    <div class="pop-up-body">
      <neb-button @click="popUp2 = false">Close</neb-button>
    </div>
  </neb-pop-up>
</template>

<style scoped lang="scss">
h1 {
  color: $primary-color;
}
.buttons {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: $space-s;
}
.pop-up-body-1 {
  width: 800px;
  height: 600px;
  background: red;
  border-radius: $radius-default;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-up-body {
  width: 600px;
  height: 400px;
  background: white;
  border-radius: $radius-default;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
