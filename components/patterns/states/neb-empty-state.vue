<script lang="ts" setup>
withDefaults(defineProps<{
  icon?: string | null
  title?: string
  description?: string
}>(), {
  icon: 'material-symbols:search-rounded',
})
</script>

<template>
  <div class="neb-empty-state">
    <div v-if="$props.icon" class="empty-icon">
      <Icon :name="$props.icon" />
    </div>

    <div class="empty-state-text">
      <h6 v-if="title">
        {{ title }}
      </h6>

      <p v-if="description">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.default" class="call-to-action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.neb-empty-state {
  width: 100%;
  height: 100%;
  padding: var(--space-8) var(--space-12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
}
.empty-icon {
  background: var(--neutral-color-100);
  padding: var(--space-3);
  border-radius: 50%;
  position: relative;

  &:before {
    content: '';
    display: block;
    position: absolute;
    transform: scale(1.3);
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border: 4px solid var(--neutral-color-50);
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
    border: 1px solid var(--neutral-color-50);
    border-radius: 50%;
  }
  .icon {
    width: 32px;
    height: 32px;
    color: var(--neutral-color-600);
  }
}
.empty-state-text {
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
  .empty-icon {
    background: var(--neutral-color-900);

    &:before {
      border: 4px solid var(--neutral-color-950);
    }
    &:after {
      border: 1px solid var(--neutral-color-950);
    }
    .icon {
      color: var(--neutral-color-400);
    }
  }
  .empty-state-text {
    h6 {
      color: var(--neutral-color-300);
    }
    p {
      color: var(--neutral-color-400);
    }
  }
}
</style>
