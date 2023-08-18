<script lang="ts" setup generic="T">
defineProps<{
  value: T
  disabled?: boolean
}>()

const modelValue = defineModel()
</script>

<template>
  <label class="neb-radio-button">
    <input
      v-model="modelValue"
      :value="value"
      :disabled="disabled"
      type="radio"
    >
    Remember me
  </label>
</template>

<style scoped>
.neb-radio-button {
  display: flex;
  align-items: center;
  width: fit-content;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-color-800);
}
input[type="radio"] {
  -webkit-appearance: none;
  appearance: none;
  background: var(--white-color);
  margin: 0;

  width: 16px;
  height: 16px;
  border: 1px solid var(--neutral-color-300);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

input[type="radio"]::before {
  content: "";
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transform: scale(0);
  transition: var(--duration-default) transform ease-in-out;
  background: var(--primary-color-600);
  flex-shrink: 0;
}

input[type="radio"]:checked {
  border-color: var(--primary-color-600);
  background: var(--primary-color-100);

  &::before {
    transform: scale(.40);
  }
}
input[type="radio"]:focus {
  outline: none;
  box-shadow: var(--primary-focus-shadow-light);
}

.dark-mode {
  .neb-radio-button {
    color: var(--neutral-color-300);
  }
  input[type="radio"] {
    background: var(--neutral-color-950);
    border: 1px solid var(--neutral-color-700);
  }
  input[type="radio"]:focus {
    box-shadow: var(--primary-focus-shadow-dark);
  }
}
</style>
