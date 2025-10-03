<script lang="ts" setup>
withDefaults(defineProps<{
  title: string
  description?: string
  type?: 'paragraph' | 'section' | 'page' | 'subtitle'
  hasSeparator?: boolean
  icon?: string
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
        <div v-if="$slots.start || $props.icon" class="content-actions">
          <slot name="start">
            <div class="header-icon">
              <Icon v-if="$props.icon" :name="$props.icon" />
            </div>
          </slot>
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
        line-height: 1.6;
      }
      & p {
        font-size: var(--text-sm);
      }
    }
  }
  &.paragraph {
    .content-text {
      & h1 {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--neutral-color-600);
      }
    }
  }
  &.subtitle {
    .content-text {
      & h1 {
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--neutral-color-400);
      }
    }
  }
}
.content-text {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;

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
  align-items: center;
  gap: var(--space-4);
}
.content-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  align-self: stretch;
}
.header-icon {
  background: #fff;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 48px;
  width: 48px;
  border: 1px solid var(--neutral-color-200);
  box-shadow: var(--shadow-xs);
  border-radius: var(--radius-default);

  .icon {
    color: var(--neutral-color-700);
  }
}

@media (--tablet-viewport) {
  .neb-content-wrapper {
    &.section {
      .content-text {
        & h1 {
          font-size: var(--text-lg);
        }
      }
    }
  }
}

.dark-mode {
  .neb-content-header {
    &.has-separator {
      border-bottom: 1px solid var(--neutral-color-700);
    }
  }

  .neb-content-wrapper {
    &.paragraph {
      .content-text {
        & h1 {
          color: var(--neutral-color-300);
        }
      }
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

  .header-icon {
    background: var(--neutral-color-800);
    border: 1px solid var(--neutral-color-700);

    .icon {
      color: var(--neutral-color-300);
    }
  }
}
</style>
