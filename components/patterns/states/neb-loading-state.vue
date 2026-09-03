<script lang="ts" setup>
withDefaults(defineProps<{
  icon?: string
  title?: string
  description?: string
}>(), {
  icon: 'eos-icons:loading',
})
</script>

<template>
  <div class="neb-loading-state">
    <div class="loading-icon">
      <Icon :name="$props.icon!" />
    </div>

    <div class="loading-state-text">
      <h6>
        {{ $props.title || $t('nebula.loading') }}
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
    color: var(--neb-text-primary);
  }
}
.loading-state-text {
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
