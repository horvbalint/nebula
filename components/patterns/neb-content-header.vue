<script lang="ts" setup>
withDefaults(defineProps<{
  title: string
  description?: string
  type?: 'section' | 'page'
  hasSeparator?: boolean
}>(), {
  type: 'page',
  hasSeparator: false,
})
</script>

<template>
  <div class="neb-content-header" :class="{ 'has-separator': $props.hasSeparator }">
    <slot name="top" />

    <div class="neb-content-wrapper" :class="$props.type">
      <div class="content-row-start">
        <div v-if="$slots.start" class="content-actions">
          <slot name="start" />
        </div>

        <div class="content-text">
          <h1>{{ $props.title }}</h1>

          <p v-if="$props.description">
            {{ $props.description }}
          </p>
        </div>
      </div>

      <div v-if="$slots.actions" class="content-actions">
        <slot name="actions" />
      </div>
    </div>

    <slot name="bottom" />
  </div>
</template>

<style scoped>
.neb-content-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: 0;

  &.has-separator {
    border-bottom: 1px solid var(--neutral-color-200);
    padding-bottom: var(--space-4);
  }
}
.neb-content-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-4);
  align-items: flex-start;

  &.section {
    .content-text {
      & h1 {
        font-size: var(--text-lg);
      }
      & p {
        font-size: var(--text-sm);
      }
    }
  }
}
.content-text {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  gap: var(--space-2);

  & h1 {
    font-size: var(--title-sm);
    font-weight: 600;
    color: var(--neutral-color-900);
  }
  & p {
    font-size: var(--text-md);
    font-weight: 400;
    color: var(--neutral-color-600);
    line-height: 1.5;
  }
}
.content-row-start {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}
.content-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-3);
}

@media (--tablet-viewport) {
  .content-text {
    & h1 {
      font-size: var(--title-xs);
    }
  }
}

.dark-mode {
  .neb-content-header {
    &.has-separator {
      border-bottom: 1px solid var(--neutral-color-700);
    }
  }
  .content-text {
    & h1 {
      color: var(--neutral-color-300);
    }
    & p {
      color: var(--neutral-color-400);
    }
  }
}
</style>
