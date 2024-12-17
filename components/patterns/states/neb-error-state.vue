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
    <div class="error-icon">
      <Icon :name="$props.icon!" />
    </div>

    <div class="error-state-text">
      <h6 v-if="title">
        {{ $props.title }}
      </h6>

      <p v-if="description">
        {{ $props.description }}
      </p>
    </div>

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
  background: var(--error-color-100);
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
    border: 4px solid var(--error-color-50);
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
    border: 1px solid var(--error-color-50);
    border-radius: 50%;
  }
  .icon {
    width: 32px;
    height: 32px;
    color: var(--error-color-600);
  }
}
.error-state-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  text-align: center;
  max-width: 350px;

  h6 {
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--neutral-color-900);
  }
  p {
    font-size: var(--text-sm);
    font-weight: 400;
    color: var(--neutral-color-600);
    line-height: 20px;
  }
}
.call-to-action {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.dark-mode {
  .error-icon {
    background: var(--error-color-950);

    &:before {
      border: 4px solid var(--error-color-950);
    }
    &:after {
      border: 1px solid var(--error-color-950);
    }
    .icon {
      color: var(--error-color-500);
    }
  }
  .error-state-text {
    h6 {
      color: var(--neutral-color-300);
    }
    p {
      color: var(--neutral-color-400);
    }
  }
}
</style>
