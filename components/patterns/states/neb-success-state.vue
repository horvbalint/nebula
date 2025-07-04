<script lang="ts" setup>
withDefaults(defineProps<{
  icon?: string | null
  title?: string
  description?: string
}>(), {
  icon: 'material-symbols:check-circle-outline-rounded',
})
</script>

<template>
  <div class="neb-success-state">
    <slot name="icon">
      <div v-if="$props.icon" class="success-icon">
        <Icon :name="$props.icon" />
      </div>
    </slot>

    <slot name="text">
      <div class="success-state-text">
        <h6 v-if="title">
          {{ title }}
        </h6>

        <p v-if="description">
          {{ description }}
        </p>
      </div>
    </slot>

    <div v-if="$slots.default" class="call-to-action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.neb-success-state {
  width: 100%;
  height: 100%;
  padding: var(--space-8) var(--space-12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
}
.success-icon {
  background: var(--success-color-100);
  padding: var(--space-3);
  border-radius: 50%;
  position: relative;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: '';
    display: block;
    position: absolute;
    transform: scale(1.3);
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border: 4px solid var(--success-color-50);
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
    border: 1px solid var(--success-color-50);
    border-radius: 50%;
  }
  .icon {
    width: 32px;
    height: 32px;
    color: var(--success-color-600);
  }
}
.success-state-text {
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
  .success-icon {
    background: var(--success-color-900);

    &:before {
      border: 4px solid var(--success-color-950);
    }
    &:after {
      border: 1px solid var(--success-color-950);
    }
    .icon {
      color: var(--success-color-400);
    }
  }
  .success-state-text {
    h6 {
      color: var(--neutral-color-300);
    }
    p {
      color: var(--neutral-color-400);
    }
  }
}

@media (--tablet-viewport) {
  .neb-success-state {
    padding: var(--space-4) var(--space-6);
    text-align: center;
  }
  .success-state-text {
    h6 {
      font-size: var(--text-md);
    }
    p {
      font-size: var(--text-sm);
    }
  }
}
</style>
