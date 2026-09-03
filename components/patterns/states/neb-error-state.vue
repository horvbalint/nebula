<script lang="ts" setup>
withDefaults(defineProps<{
  icon?: string
  title?: string
  description?: string
}>(), {
  icon: 'material-symbols:error-outline-rounded',
})
</script>

<template>
  <div class="neb-error-state">
    <slot name="icon">
      <div class="error-icon">
        <Icon :name="$props.icon!" />
      </div>
    </slot>

    <slot name="text">
      <div class="error-state-text">
        <h6 v-if="title">
          {{ $props.title }}
        </h6>

        <p v-if="description">
          {{ $props.description }}
        </p>
      </div>
    </slot>

    <div v-if="$slots.default" class="call-to-action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.neb-error-state {
  width: 100%;
  height: 100%;
  padding: var(--space-8) var(--space-12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
}
.error-icon {
  background: var(--neb-bg-error);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: relative;
  width: 48px;
  height: 48px;

  &:before {
    content: '';
    display: block;
    position: absolute;
    transform: scale(1.3);
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border: 4px solid var(--neb-bg-error-subtle);
    border-radius: 50%;
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    transform: scale(1.5);
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border: 1px solid var(--neb-bg-error-subtle);
    border-radius: 50%;
  }
  .icon {
    width: 32px;
    height: 32px;
    color: var(--neb-text-error);
  }
}
.error-state-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  text-align: center;
  max-width: 350px;

  h6 {
    font: var(--neb-font-heading);
    color: var(--neb-text);
  }
  p {
    font: var(--neb-font-body-sm);
    color: var(--neb-text-subtle);
  }
}
.call-to-action {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
</style>
