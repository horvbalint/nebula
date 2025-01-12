<script lang="ts" setup>
const modals = getConfirmModals()

function answer(result: boolean) {
  modals.value[0].resolve(result)
  modals.value.shift()
}
</script>

<template>
  <neb-modal
    v-for="(modal, index) in modals"
    :key="index"
    :model-value="true"
    @update:model-value="answer(false)"
  >
    <template #body>
      <main>
        <div v-if="modal.config.icon" class="icon-wrapper" :class="modal.config.type">
          <icon :name="modal.config.icon" />
        </div>

        <div class="confirm-text-wrapper">
          <header>
            <h1>{{ modal.config.title }}</h1>

            <neb-button type="link-neutral" @click="answer(false)">
              <icon name="material-symbols:close-rounded" />
            </neb-button>
          </header>

          <p>{{ modal.config.description }}</p>
        </div>
      </main>
    </template>

    <template #actions>
      <neb-button type="secondary-neutral" @click="answer(false)">
        {{ modal.config.cancelText || 'Cancel' }}
      </neb-button>

      <neb-button :destructive="modal.config.type !== 'info'" @click="answer(true)">
        {{ modal.config.okText || 'Ok' }}
      </neb-button>
    </template>
  </neb-modal>
</template>

<style scoped>
main {
  padding: var(--space-6);
  max-width: 550px;
  display: flex;
  align-items: flex-start;
  gap: var(--space-6);
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: var(--space-1);
  position: relative;
  height: 36px;
  color: var(--error-color-500);
  width: 36px;
  background: var(--error-color-200);
  border-radius: 50%;

  &:before {
    content: '';
    display: block;
    position: absolute;
    transform: scale(1.3);
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border: 6px solid var(--error-color-100);
    border-radius: 50%;
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    transform: scale(1.7);
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border: 4px solid var(--error-color-50);
    border-radius: 50%;
  }

  &.danger {
    color: var(--error-color-500);
    background: var(--error-color-200);

    &:before {
      border-color: var(--error-color-100);
    }
    &:after {
      border-color: var(--error-color-50);
    }
  }

  &.warning {
    color: var(--warning-color-500);
    background: var(--warning-color-200);

    &:before {
      border-color: var(--warning-color-100);
    }
    &:after {
      border-color: var(--warning-color-50);
    }
  }

  &.success {
    color: var(--success-color-500);
    background: var(--success-color-200);

    &:before {
      border-color: var(--success-color-100);
    }
    &:after {
      border-color: var(--success-color-50);
    }
  }
}
.confirm-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  p {
    font-size: var(--text-sm);
    color: var(--neutral-color-500);
    line-height: 1.4;
  }
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);

  h1 {
    font-size: var(--text-lg);
    font-weight: 600;
  }
}
</style>
