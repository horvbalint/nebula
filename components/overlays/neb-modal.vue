<script lang="ts" setup>
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  headerIcon?: string
  maxWidth?: string
  minWidth?: string
  centered?: boolean
  closedValue?: boolean | any
  closeOnBackgroundClick?: boolean
}>(), {
  maxWidth: '768px',
  minWidth: '375px',
  centered: false,
  closeOnBackgroundClick: true,
})

const modelValue = defineModel()
</script>

<template>
  <neb-pop-up
    v-model="modelValue"
    :center-content="centered"
    :closed-value="closedValue"
    :close-on-background-click="closeOnBackgroundClick"
  >
    <div class="neb-modal neb-overlay-transition" :style="{ 'max-width': maxWidth, 'min-width': minWidth }" :class="{ centered }">
      <header v-if="$slots.header || $props.title || $props.subtitle">
        <slot name="header">
          <div class="header">
            <div v-if="$props.headerIcon" class="header-icon">
              <icon :name="$props.headerIcon" />
            </div>

            <div class="header-titles">
              <h4>{{ $props.title }}</h4>
              <p v-if="$props.subtitle">
                {{ $props.subtitle }}
              </p>
            </div>
          </div>
        </slot>

        <neb-button type="tertiary-neutral" square small @click="modelValue = $props.closedValue">
          <icon class="close-icon" name="material-symbols:close-rounded" />
        </neb-button>
      </header>

      <main>
        <slot name="body">
          <div class="body">
            <slot name="content" />
          </div>
        </slot>
      </main>

      <footer v-if="$slots.footer || $slots.actions">
        <slot name="footer">
          <div class="footer">
            <slot name="actions" />
          </div>
        </slot>
      </footer>
    </div>
  </neb-pop-up>
</template>

<style scoped>
.neb-modal {
  background: var(--neb-bg-raised);
  border-radius: var(--radius-large);
  box-shadow: var(--neb-shadow-xl);
  margin: var(--space-12) 0;
}
header {
  border-bottom: 1px solid var(--neb-border-subtle);
  padding: var(--space-5) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);

  position: sticky;
  top: 0;
  left: 0;
  background: var(--neb-bg-raised);
  border-radius: var(--radius-large) var(--radius-large) 0 0;
  z-index: 2;
}
.close-icon {
  color: var(--neb-text-subtle);
}
.header {
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border: 1px solid var(--neb-border-subtle);
  box-shadow: var(--neb-shadow-xs);
  border-radius: var(--radius-default);

  .icon {
    color: var(--neb-text);
  }
}
.header-titles {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: var(--space-1);

  h4 {
    font: var(--neb-font-title);
    color: var(--neb-text);
  }
  p {
    font: var(--neb-font-body-sm);
    color: var(--neb-text-subtle);
  }
}
.body {
  padding: var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
footer {
  border-top: 1px solid var(--neb-border-subtle);
}
.footer {
  display: flex;
  padding: var(--space-5) var(--space-6);
  gap: var(--space-3);
  justify-content: flex-end;
}

@media (--tablet-viewport) {
  @keyframes modal-slide {
    0% {
      opacity: 0.5;
      transform: translateY(min(100%, 200px));
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .neb-modal {
    margin: auto 0 0;
    width: 100%;
    min-width: auto !important;
    max-width: none !important;
    border-radius: var(--radius-large) var(--radius-large) 0 0;
    animation: modal-slide var(--duration-default) forwards;

    &.centered {
      border-radius: var(--radius-large);
      margin: auto;
    }
  }

  header,
  .body,
  .footer {
    padding: var(--space-4) var(--space-5);
  }
  .header-icon {
    display: none;
  }
}
</style>
