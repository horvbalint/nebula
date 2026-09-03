<script lang="ts" setup generic="T">
defineProps<{
  label?: string
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
    <slot>
      <p>{{ label }}</p>
    </slot>
  </label>
</template>

<style scoped>
.neb-radio-button {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;

  p {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--neb-text);
    user-select: none;
  }
}
input[type='radio'] {
  -webkit-appearance: none;
  appearance: none;
  background: var(--neb-bg);
  margin: 0;

  width: 20px;
  height: 20px;
  border: 1px solid var(--neb-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: not-allowed;
    background: var(--neb-bg-disabled);

    + p {
      color: var(--neb-text-subtle);
    }
  }
}

input[type='radio']::before {
  content: '';
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transform: scale(0);
  transition: var(--duration-default) transform ease-in-out;
  background: var(--neb-bg-primary-solid);
  flex-shrink: 0;
}

input[type='radio']:checked {
  border-color: var(--neb-text-primary);
  background: var(--neb-bg-primary);

  &::before {
    transform: scale(0.4);
  }
}
input[type='radio']:focus {
  outline: none;
  box-shadow: var(--neb-ring-primary);
}
</style>
