<script setup lang="ts">
definePageMeta({
  name: 'Fő oldal',
  nebula: {
    skipFromMenu: false
  }
})

const date = ref(new Date())
</script>

<template>
  <div class="experiments">
    <neb-datepicker label="Csodaszep datepicker" v-model="date" />
  </div>
</template>

<style scoped>
.experiments {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-12);
}
.select-wrapper {
  max-width: 400px;
}
.form-elements {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.buttons {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.pop-up-body-1 {
  width: 800px;
  height: 600px;
  background: red;
  border-radius: var(--radius-default);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-up-body {
  width: 600px;
  height: 400px;
  background: white;
  border-radius: var(--radius-default);
  display: flex;
  align-items: center;
  justify-content: center;
}

.neb-blur {
  margin-top: var(--space-6);
  display: flex;
  gap: var(--space-4);
  align-items: center;

  .main-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 150px;
    background: var(--primary-color-700);
    color: var(--neutral-color-300);
    border-radius: var(--radius-default);
    border: 1px solid var(--primary-color-500);
  }

  .exception-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 100px;
    background: var(--success-color-100);
    border-radius: var(--radius-default);
    border: 1px solid var(--success-color-300);
  }
}
.top-slot {
  padding: var(--space-2) var(--space-4);
  padding-bottom: var(--space-3);

  h6 {
    font-size: var(--text-sm);
    font-weight: 600;
  }
  p {
    font-size: var(--text-sm);
    font-weight: 400;
  }
}
.neb-table {
  max-height: 600px;
}

.dark-mode {
  .table-header-text {
    color: var(--neutral-color-300)
  }
}
</style>
