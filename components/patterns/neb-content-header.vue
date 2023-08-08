<script lang="ts">
export default defineNuxtComponent({
  props: {
    hasSeparator: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      default: 'page',
      validator(value: string) {
        return ['section', 'page'].includes(value)
      },
    },
  },
  data() {
    return {

    }
  },
})
</script>

<template>
  <div class="neb-content-header" :class="{ 'has-separator': hasSeparator }">
    <slot name="top" />

    <div
      class="neb-content-wrapper"
      :class="{
        page: type === 'page',
        section: type === 'section',
      }"
    >
      <div class="content-text">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>

      <div class="content-actions">
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
  padding: var(--space-6) 0;

  &.has-separator {
    border-bottom: 1px solid var(--neutral-color-200);
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
      max-width: none;

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
  max-width: 445px;

  & h1 {
    font-size: var(--title-sm);
    font-weight: 600;
    color: var(--neutral-color-900);
  }
  & p {
    font-size: var(--text-md);
    font-weight: 400;
    color: var(--neutral-color-600);
  }
}
.content-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-3);
}

@media only screen and (max-width: var(--tablet)) {
  .content-text {
    & h1 {
      font-size: var(--title-xs);
    }
  }
}
</style>
