<script setup lang="ts">
const options = [
  {
    icon: 'material-symbols:close-rounded',
    value: 1,
  },
  {
    text: 'wefwef',
    value: 2,
  },
  {
    text: 'Bezaras',
    icon: 'material-symbols:close-rounded',
    value: 3,
  },
]

const value = ref(1)
</script>

<template>
  <div class="wrapper">
    {{ value }}
    <neb-radio-group v-model="value" square :options="options" />

    <neb-button-group>
      <neb-button>
        First
      </neb-button>

      <neb-button>
        Second
      </neb-button>

      <neb-button>
        Third
      </neb-button>
    </neb-button-group>

    <neb-avatar-list :max="2">
      <neb-avatar text="alma" />
      <neb-avatar text="alma" />
      <neb-avatar text="alma" />
    </neb-avatar-list>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--space-10);
  width: 100%;
  height: 100vh;
}
</style>
