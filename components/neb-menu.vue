<script setup lang="ts">
import type { UseFloatingOptions } from '@floating-ui/vue'

interface Menu {
  text: string
  icon?: string
  segment?: boolean
  callback: () => void
}

defineProps<{
  menus: Menu[]
  floatingOptions?: UseFloatingOptions
}>()
</script>

<template>
  <neb-dropdown :floating-options="floatingOptions">
    <template #button="{ toggle }">
      <slot name="button" :toggle="toggle" />
    </template>

    <template #content="{ toggle }">
      <div class="dropdown">
        <ul>
          <li v-for="menu in menus" :key="menu.text" @click="menu.callback(); toggle()">
            <icon v-if="menu.icon" :name="menu.icon" />
            <p>{{ menu.text }}</p>
          </li>
        </ul>
      </div>
    </template>
  </neb-dropdown>
</template>

<style scoped>
.dropdown {
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  background: white;
  box-shadow: var(--neutral-focus-shadow-light);
  padding: var(--space-2) 0;

  & ul {
    list-style: none;
  }

  & li {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    padding: var(--space-2) var(--space-4);
    color: var(--neutral-color-900);
    transition: all var(--duration-default);
    cursor: pointer;

    &:hover {
      background: var(--neutral-color-200);
    }

    .icon {
      width: var(--text-xl);
      color: var(--neutral-color-600)
    }
  }
}
</style>
