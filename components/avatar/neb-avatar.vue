<script lang="ts" setup>
export interface Props {
  size?: string
  src?: string
  icon?: string
  text?: string
  alt?: string
}
withDefaults(defineProps<Props>(), {
  size: '40px',
  icon: 'material-symbols:person-outline-rounded',
})
</script>

<script lang="ts">
export default defineComponent({
  name: 'NebAvatar',
})
</script>

<template>
  <div tabindex="0" class="neb-avatar" :style="{ width: $props.size, height: $props.size }">
    <img v-if="$props.src" :src="$props.src" :alt="alt || $t('nebula.avatar.alt')">
    <span v-else-if="$props.text">{{ $props.text }}</span>
    <icon v-else-if="$props.icon" :name="icon" />

    <div v-if="$slots.badge" class="badge">
      <slot />
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

.dark-mode {
  .neb-avatar {
    background: var(--neutral-color-800);
    border: 1px solid var(--neutral-color-700);
    color: var(--neutral-color-300);
    outline: 0px solid var(--neutral-color-600);

    &:focus {
      outline: 4px solid var(--neutral-color-700);
    }
  }
  .badge {
    background: var(--neutral-color-800);
    border: 2px solid var(--neutral-color-950);
  }
}
</style>
