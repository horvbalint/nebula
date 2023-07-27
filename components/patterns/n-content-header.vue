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
  <div class="ut-content-header" :class="{ 'has-separator': hasSeparator }">
    <slot name="top" />

    <div
      class="ut-content-wrapper"
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

<style lang="scss" scoped>
.ut-content-header {
  display: flex;
  flex-direction: column;
  gap: $space-m;
  padding: $space-m 0;

  &.has-separator {
    border-bottom: 1px solid $neutral-color-200;
  }
}
.ut-content-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: $space-s;
  align-items: flex-start;

  &.section {
    .content-text {
      max-width: none;

      h1 {
        font-size: $text-lg;
      }
      p {
        font-size: $text-sm;
      }
    }
  }
}
.content-text {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  gap: $space-xs;
  max-width: 445px;

  h1 {
    font-size: $title-sm;
    font-weight: 600;
    color: $neutral-color-900;
  }
  p {
    font-size: $text-md;
    font-weight: 400;
    color: $neutral-color-600;
  }
}
.content-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: $space-xss;
}

@media only screen and (max-width: $tablet) {
  .content-text {
    h1 {
      font-size: $title-xs;
    }
  }
}
</style>
