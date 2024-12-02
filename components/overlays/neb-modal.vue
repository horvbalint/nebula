<script lang="ts" setup>
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  headerIcon?: string
  maxWidth?: string
  minWidth?: string
  centered?: boolean
  closedValue?: boolean | any
}>(), {
  maxWidth: '768px',
  minWidth: '375px',
  centered: false,
})

const modelValue = defineModel()
</script>

<template>
  <neb-pop-up v-model="modelValue" :center-content="centered" :closed-value="closedValue">
    <div class="neb-modal neb-overlay-transition" :style="{ 'max-width': maxWidth, 'min-width': minWidth }" :class="{ centered }">
      <header>
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

        <neb-button type="tertiary-neutral" square small @click="modelValue = false">
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
  background: #fff;
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-xl);
  margin: var(--space-12) 0;
}
header {
  border-bottom: 1px solid var(--neutral-color-200);
  padding: var(--space-5) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);

  position: sticky;
  top: 0;
  left: 0;
  background: #fff;
  border-radius: var(--radius-large) var(--radius-large) 0 0;
  z-index: 2;
}
.close-icon {
  color: var(--neutral-color-500);
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
  border: 1px solid var(--neutral-color-200);
  box-shadow: var(--shadow-xs);
  border-radius: var(--radius-default);

  .icon {
    color: var(--neutral-color-700);
  }
}
.header-titles {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: var(--space-1);

  h4 {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--neutral-color-900);
  }
  p {
    font-size: var(--text-sm);
    font-weight: 400;
    color: var(--neutral-color-600);
  }
}
.body {
  padding: var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
footer {
  border-top: 1px solid var(--neutral-color-200);
}
.footer {
  display: flex;
  padding: var(--space-5) var(--space-6);
  gap: var(--space-3);
  justify-content: flex-end;
}

.dark-mode {
  .neb-modal,
  header {
    background: var(--neutral-color-950);
  }
  header,
  footer,
  .header-icon {
    border-color: var(--neutral-color-700);
  }
  .header-titles {
    h4 {
      color: var(--neutral-color-300);
    }
    p {
      color: var(--neutral-color-500);
    }
  }
  .header-icon {
    .icon {
      color: var(--neutral-color-300);
    }
  }
}

@media (--tablet-viewport) {
  .neb-modal {
    margin: auto 0 0;
    width: 100%;
    min-width: auto !important;
    max-width: none !important;
    border-radius: var(--radius-large) var(--radius-large) 0 0;

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
