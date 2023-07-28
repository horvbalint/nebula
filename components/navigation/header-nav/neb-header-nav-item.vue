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

<style lang="scss" scoped>
.neb-header-nav-item {
  padding: 0 $space-xss;
  font-size: $text-sm;
  border-radius: $radius-default;
  height: 40px;
  line-height: 40px;
  font-weight: 600;
  color: $neutral-color-600;
  background: inherit;
  transition: all $duration-default;
  cursor: pointer;
  outline: none;
  text-decoration: none;

  &.active {
    background: $neutral-color-100;
    color: $neutral-color-900;
  }
  &:hover {
    background: $neutral-color-50;
  }
  &:focus {
    background: $neutral-color-50;
    box-shadow: $primary-focus-shadow;
  }

  .slot-text {
    white-space: nowrap;
  }
}

@media only screen and (max-width: $tablet) {
  .neb-header-nav-item {
    width: 100%;
  }
}
</style>
