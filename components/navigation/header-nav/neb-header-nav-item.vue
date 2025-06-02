<script lang="ts" setup>
import type { Route } from './neb-header-nav.vue'
import { useRouteGrouping } from '@nebula/composables/routes'

const props = defineProps<{
  route: Route
}>()

const emit = defineEmits<{
  close: []
}>()

const currentRoute = useRoute()
const isActive = computed(() => {
  const currUrlParts = currentRoute.path.split('/')
  const propUrlParts = props.route.path.split('/')
  const propsRouteUrlName = propUrlParts[propUrlParts.length - 1]

  return currUrlParts.includes(propsRouteUrlName)
})

const groupedRoutes = useRouteGrouping(props.route.subRoutes || [])
</script>

<template>
  <NuxtLink v-if="!route.subRoutes?.length" :to="route.path" class="neb-header-nav-item" active-class="active" @click="emit('close')">
    <slot>
      <p class="slot-text">
        <icon v-if="$props.route.icon" :name="$props.route.icon" />
        {{ $props.route.name }}
      </p>
    </slot>
  </NuxtLink>

  <neb-dropdown v-else>
    <template #trigger="{ toggle }">
      <neb-button :type="isActive ? 'tertiary' : 'tertiary-neutral'" @click="toggle()">
        <icon name="material-symbols:keyboard-arrow-down-rounded" />
        {{ $props.route.name }}
      </neb-button>
    </template>

    <template #content="{ close }">
      <div class="dropdown">
        <neb-header-nav-item
          v-for="r in groupedRoutes.ungrouped"
          :key="r.name"
          :route="r"
          @close="close(); emit('close')"
        />

        <div v-for="groupName in groupedRoutes.groupNames" :key="groupName" class="group">
          <header>
            <neb-content-header
              :title="groupName"
              type="subtitle"
            />
          </header>

          <neb-header-nav-item v-for="r in groupedRoutes.groups[groupName]" :key="r.name" :route="r" @close="close(); emit('close')" />
        </div>
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
    color: var(--primary-color);
  }
  &:hover {
    background: var(--neutral-color-50);
  }
  &:focus {
    background: var(--neutral-color-50);
    box-shadow: var(--primary-focus-shadow-light);
  }

  .slot-text {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    white-space: nowrap;
  }
}
.icon {
  font-size: 20px !important;
}
.dropdown {
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-lg);
  padding: var(--space-1) 0;
  background: #fff;
}
.group {
  border-top: 1px solid var(--neutral-color-200);

  header {
    padding: var(--space-2) var(--space-4) 0 var(--space-4);
  }
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
