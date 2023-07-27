<script>
export default {
  props: {
    text: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  data() {
    return {

    }
  },
}
</script>

<template>
  <NuxtLink :to="path" class="navigation-item" active-class="active">
    <slot>{{ text }}</slot>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.navigation-item {
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
}

@media only screen and (max-width: $tablet) {
  .navigation-item {
    width: 100%;
  }
}
</style>
