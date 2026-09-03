<script lang="ts" setup>
const modals = getConfirmModals()

function answer(result: boolean) {
  modals.value[0]!.resolve(result)
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
  color: var(--neb-text-error);
  width: 36px;
  background: var(--neb-bg-error-hover);
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
    border: 6px solid var(--neb-bg-error);
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
    border: 4px solid var(--neb-bg-error-subtle);
    border-radius: 50%;
  }

  &.danger {
    color: var(--neb-text-error);
    background: var(--neb-bg-error-hover);

    &:before {
      border-color: var(--neb-bg-error);
    }
    &:after {
      border-color: var(--neb-bg-error-subtle);
    }
  }

  &.warning {
    color: var(--neb-text-warning);
    background: var(--neb-bg-warning-hover);

    &:before {
      border-color: var(--neb-bg-warning);
    }
    &:after {
      border-color: var(--neb-bg-warning-subtle);
    }
  }

  &.info {
    color: var(--neb-text-primary);
    background: var(--neb-bg-primary-hover);

    &:before {
      border-color: var(--neb-bg-primary);
    }
    &:after {
      border-color: var(--neb-bg-primary-subtle);
    }
  }
}
.confirm-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  p {
    font-size: var(--text-sm);
    color: var(--neb-text-subtle);
    line-height: 1.4;
    white-space: pre-wrap;
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
    color: var(--neb-text);
  }
}
</style>
