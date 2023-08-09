<script lang="ts" setup>
defineProps<{
  text?: string
  path?: string
}>()
</script>

<template>
  <NuxtLink :to="path" class="neb-header-nav-item" active-class="active">
    <slot>
      <p class="slot-text">
        {{ text }}
      </p>
    </slot>
  </NuxtLink>
</template>

<style scoped>
.neb-header-nav-item {
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
  border-radius: var(--radius-default);
  height: 40px;
  line-height: 40px;
  font-weight: 600;
  color: var(--neutral-color-600);
  background: inherit;
  transition: all var(--duration-default);
  cursor: pointer;
  outline: none;
  text-decoration: none;

  &.active {
    background: var(--neutral-color-100);
    color: var(--neutral-color-900);
  }
  &:hover {
    background: var(--neutral-color-50);
  }
  &:focus {
    background: var(--neutral-color-50);
    box-shadow: var(--primary-focus-shadow-light);
  }

  .slot-text {
    white-space: nowrap;
  }
}

@media only screen and (max-width: var(--tablet)) {
  .neb-header-nav-item {
    width: 100%;
  }
}

.dark-mode {
  .neb-header-nav-item {
    color: var(--neutral-color-100);

    &.active {
      background: var(--neutral-color-800);
      color: var(--white-color);
    }
    &:hover {
      background: var(--neutral-color-900);
    }
    &:focus {
      background: var(--neutral-color-900);
      box-shadow: var(--primary-focus-shadow-dark);
    }
  }
}
</style>
