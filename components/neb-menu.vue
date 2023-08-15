<script setup lang="ts">
import type { UseFloatingOptions } from '@floating-ui/vue'

interface Menu {
  text: string
  icon?: string
  segment?: boolean
  disabled?: boolean
  callback: () => void
}

defineProps<{
  menus: Menu[]
  floatingOptions?: UseFloatingOptions
}>()
</script>

<template>
  <neb-dropdown class="neb-menu" :floating-options="floatingOptions">
    <template #button="{ toggle }">
      <slot name="button" :toggle="toggle" />
    </template>

    <template #content="{ toggle }">
      <div class="dropdown neb-overlay-transition">
        <slot name="header" />

        <ul>
          <li
            v-for="menu in menus"
            :key="menu.text"
            :class="{
              segment: menu.segment,
              disabled: menu.disabled,
            }"
            @click="menu.callback(); toggle()"
          >
            <div class="menu">
              <icon v-if="menu.icon" :name="menu.icon" />
              <p>{{ menu.text }}</p>
            </div>
          </li>
        </ul>

        <slot name="footer" />
      </div>
    </template>
  </neb-dropdown>
</template>

<style scoped>
.dropdown {
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-lg);
  padding: var(--space-1) 0;
  background: var(--white-color);
}
ul {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  margin: 0;
  padding: 0 var(--space-1);
  user-select: none;

  &.segment {
    border-top: 1px solid var(--neutral-color-200);
  }
  &.disabled {
    opacity: .45;
    pointer-events: none;
    cursor: not-allowed;
  }
}
.menu {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-3);
  transition: all var(--duration-default);
  cursor: pointer;
  border-radius: var(--radius-small);

  &:hover {
    background: var(--neutral-color-50);
  }
  &:active {
    background: var(--neutral-color-200);
  }
  p {
    font-weight: 500;
    font-size: var(--text-sm);
    color: var(--neutral-color-800);
  }
  .icon {
    width: var(--space-5);
    height: var(--space-5);
    color: var(--neutral-color-600)
  }
}

.dark-mode {
  .dropdown {
    border: 1px solid var(--neutral-color-800);
    background: var(--neutral-color-950);
  }
  li {
    &.segment {
      border-top: 1px solid var(--neutral-color-800);
    }
  }
  .menu {
    &:hover {
      background: var(--neutral-color-900);
    }
    &:active {
      background: var(--neutral-color-800);
    }
    p {
      color: var(--neutral-color-300);
    }
    .icon {
      color: var(--neutral-color-400)
    }
  }
}
</style>
