<script lang="ts" setup>
import type { Route } from './neb-header-nav.vue'

defineProps<{
  route: Route
}>()
</script>

<template>
  <NuxtLink v-if="!route.subRoutes?.length" :to="route.path" class="neb-header-nav-item" active-class="active">
    <slot>
      <p class="slot-text">
        {{ $props.route.name }}
      </p>
    </slot>
  </NuxtLink>

  <neb-dropdown v-else class="neb-menu">
    <template #trigger="{ toggle }">
      <neb-button type="tertiary-neutral" @click="toggle()">
        {{ $props.route.name }}
      </neb-button>
    </template>

    <template #content>
      <div class="dropdown">
        <neb-header-nav-item v-for="r in $props.route.subRoutes" :key="r.name" :route="r" />
      </div>
    </template>
  </neb-dropdown>
</template>

<style scoped>
.neb-header-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-4);
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
.dropdown {
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-lg);
  padding: var(--space-1) 0;
  background: #fff;
}

@media only screen and (max-width: var(--tablet)) {
  .neb-header-nav-item {
    width: 100%;
  }
}

.dark-mode {
  .neb-header-nav-item {
    color: var(--neutral-color-300);

    &.active {
      background: var(--neutral-color-800);
      color: #fff;
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
