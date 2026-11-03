<script lang="ts" setup>
import type { Route } from '@nebula/composables/routes'
import { useRouteGrouping } from '@nebula/composables/routes'

const props = defineProps<{
  routes: Route[]
  activePath: string | null
  collapsed: boolean
  depth: number
}>()

const emit = defineEmits<{
  navigate: []
}>()

const groupedRoutes = useRouteGrouping(() => props.routes)
</script>

<template>
  <ul class="neb-side-nav-list" :class="{ nested: depth > 0, collapsed }">
    <neb-side-nav-item
      v-for="route in groupedRoutes.ungrouped"
      :key="route.path"
      :route
      :active-path
      :collapsed
      :depth
      @navigate="emit('navigate')"
    />

    <li v-for="groupName in groupedRoutes.groupNames" :key="groupName" class="group">
      <p class="group-label">
        <span :title="groupName">{{ groupName }}</span>
      </p>

      <ul class="group-items">
        <neb-side-nav-item
          v-for="route in groupedRoutes.groups[groupName]"
          :key="route.path"
          :route
          :active-path
          :collapsed
          :depth
          @navigate="emit('navigate')"
        />
      </ul>
    </li>
  </ul>
</template>

<style scoped>
.neb-side-nav-list,
.group-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  list-style: none;
  margin: 0;
  padding: 0;
}
.neb-side-nav-list.nested {
  /* Puts the guide line under the centre of the parent's icon. */
  margin: 2px 0 var(--space-1) calc(var(--space-3) + var(--icon-md) / 2);
  padding-left: var(--space-2);
  border-left: 1px solid var(--neb-border-subtle);
}
.group:not(:first-child) {
  margin-top: var(--space-4);
}
.group-label {
  position: relative;
  padding: var(--space-1) var(--space-3);
  font: var(--neb-font-caption);
  color: var(--neb-text-subtle);
  white-space: nowrap;

  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity var(--duration-fast);
  }
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: var(--space-3);
    right: var(--space-3);
    height: 1px;
    background: var(--neb-border-subtle);
    opacity: 0;
    transition: opacity var(--duration-fast);
  }
}
.nested .group-label {
  padding-left: var(--space-2);
}
/* In the icon rail a group heading has no room, so it becomes a divider. */
.collapsed > .group > .group-label {
  span {
    opacity: 0;
  }
  &::before {
    opacity: 1;
  }
}
</style>
