<script setup lang="ts">
import type { UseFloatingOptions } from '@floating-ui/vue'
import NebDropdown from './neb-dropdown.vue'

interface Menu {
  text: string
  icon?: string
  segment?: boolean
  disabled?: boolean
  callback: () => unknown
  desctructive?: boolean
}

defineProps<{
  menus: Menu[]
  floatingOptions?: UseFloatingOptions
}>()

const nebDropdown = ref<InstanceType<typeof NebDropdown> | null>(null)

function handleClick(menu: Menu) {
  if (menu.disabled)
    return

  menu.callback()
  nebDropdown.value!.toggle()
}
</script>

<template>
  <NebDropdown
    ref="nebDropdown"
    class="neb-menu"
    :floating-options="floatingOptions"
  >
    <template #trigger="{ toggle }">
      <slot name="trigger" :toggle="toggle" />
    </template>

    <template #content>
      <div class="dropdown">
        <slot name="header" />

        <ul>
          <li
            v-for="menu in menus"
            :key="menu.text"
            :class="{
              segment: menu.segment,
              disabled: menu.disabled,
              desctructive: menu.desctructive,
            }"
          >
            <hr>

            <div class="menu-row">
              <div class="menu-row-content" @click="handleClick(menu)">
                <icon v-if="menu.icon" :name="menu.icon" />
                <p>{{ menu.text }}</p>
              </div>
            </div>
          </li>
        </ul>

        <slot name="footer" />
      </div>
    </template>
  </NebDropdown>
</template>

<style scoped>
.dropdown {
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-lg);
  padding: var(--space-1) 0;
  background: #fff;
}
ul {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  hr {
    margin: var(--space-1) 0;
    border: none;
    height: 1px;
    background: var(--neutral-color-200);
    display: none;
  }
  &.segment {
    hr {
      display: block;
    }
  }
  &.disabled {
    .menu-row {
      opacity: 0.45;
    }
    .menu-row-content {
      cursor: not-allowed;
    }
  }
  &.desctructive {
    .menu-row-content {
      p,
      .icon {
        color: var(--error-color);
      }
    }
  }
}
.menu-row {
  margin: 0;
  padding: 0 var(--space-1);
  user-select: none;
}
.menu-row-content {
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
    white-space: nowrap;
  }
  .icon {
    width: var(--space-5);
    height: var(--space-5);
    color: var(--neutral-color-600);
  }
}

.dark-mode {
  .dropdown {
    border: 1px solid var(--neutral-color-800);
    background: var(--neutral-color-950);
  }
  li {
    hr {
      background: var(--neutral-color-800);
    }
  }
  .menu-row-content {
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
      color: var(--neutral-color-400);
    }
  }
}
</style>
