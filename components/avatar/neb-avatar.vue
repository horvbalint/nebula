<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

withDefaults(defineProps<{
  size?: string
  src?: string
  icon?: string
  text?: string
  alt?: string
}>(), {
  size: '40px',
  icon: 'material-symbols:person-outline-rounded',
  alt: 'Avatar image...',
})
</script>

<script lang="ts">
export default defineComponent({
  name: 'NebAvatar',
})
</script>

<template>
  <div tabindex="0" class="neb-avatar" :style="{ width: $props.size, height: $props.size }">
    <img v-if="$props.src" :src="$props.src" :alt="alt">

    <icon v-if="$props.icon && !$props.text" :name="icon" />
    <span v-if="$props.text">{{ $props.text }}</span>

    <div v-if="$slots.badge" class="badge">
      <slot name="badge" />
    </div>
  </div>
</template>

<style scoped>
.neb-avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  flex-grow: 0;
  background: var(--neutral-color-100);
  border-radius: 50%;
  border: 1px solid var(--neutral-color-200);
  color: var(--neutral-color-600);
  transition: all var(--duration-fast);
  outline: 0px solid var(--neutral-color-300);

  &:focus {
    outline: 4px solid var(--neutral-color-200);
  }
  img {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    flex-grow: 0;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
  }
  .icon {
    width: 60%;
    height: 60%;
  }
  span {
    font-size: var(--text-sm);
    font-weight: 600;
  }
}
.badge {
  position: absolute;
  bottom: -7%;
  right: -6%;
  width: 35%;
  height: 35%;
  background: var(--neutral-color-100);
  border-radius: 50%;
  border: 2px solid var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
