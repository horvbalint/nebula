<script lang="ts" setup>
withDefaults(defineProps<{
  icon?: string
  title?: string
  description?: string
}>(), {
  icon: 'eos-icons:loading',
  title: 'Betöltés...',
})
</script>

<template>
  <div class="neb-loading-state">
    <div class="loading-icon">
      <icon :name="$props.icon" />
    </div>

    <div class="loading-state-text">
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
.neb-loading-state {
  width: 100%;
  height: 100%;
  padding: var(--space-8) var(--space-12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.loading-icon {
  padding: var(--space-3);
  border-radius: 50%;
  position: relative;

  .icon {
    width: 56px;
    height: 56px;
    color: var(--primary-color-600);
  }
}
.loading-state-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  text-align: center;
  max-width: 350px;

  h6 {
    font-size: var(--text-md);
    font-weight: 500;
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
  .loading-icon {
    .icon {
      color: var(--primary-color-400);
    }
  }
  .loading-state-text {
    h6 {
      color: var(--neutral-color-300);
    }
    p {
      color: var(--neutral-color-400);
    }
  }
}
</style>
