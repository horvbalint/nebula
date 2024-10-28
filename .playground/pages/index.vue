<script setup lang="ts">
const { locale } = useI18n()

const temp = ref()
</script>

<template>
  <div class="wrapper">
    <neb-button type="primary">
      Test button text
    </neb-button>
    <neb-button type="secondary">
      Test button text
    </neb-button>
    <neb-button type="secondary-neutral">
      Test button text
    </neb-button>
    <neb-button type="tertiary">
      Test button text
    </neb-button>
    <neb-button type="tertiary-neutral">
      Test button text
    </neb-button>
    <neb-button type="link">
      Test button text
    </neb-button>
    <neb-button type="link-neutral">
      Test button text
    </neb-button>

    <neb-select v-model="locale" :options="['hu', 'en']" />

    <neb-datepicker v-model="temp" />

    <neb-loading-state />

    <neb-toggle size="large" label="Valami van a levegoben" />
    <neb-toggle label="Valami van a levegoben" />
    <neb-toggle size="small" label="Valami van a levegoben" />
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
}
</style>
