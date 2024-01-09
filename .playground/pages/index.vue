<script setup lang="ts">
const options = [
  {
    text: 'Egy',
    value: 1,
  },
  {
    text: 'Ketto',
    value: 2,
  },
  {
    text: 'Harom',
    value: 3,
  },
]

const value = ref(1)
</script>

<template>
  <div class="wrapper">
    {{ value }}
    <neb-radio-group v-model="value" :options="options" />

    <neb-button-group>
      <neb-button>
        First
      </neb-button>

      <neb-button type="secondary">
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
