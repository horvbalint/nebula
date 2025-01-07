<script setup lang="ts" generic="T">
const props = defineProps<{
  label?: string
}>()

const modelValue = defineModel<T[] | undefined>({
  required: true,
})

function addItem() {
  if (!modelValue.value)
    modelValue.value = []

  modelValue.value.push({} as T)
}
</script>

<template>
  <div class="form-list">
    <!-- <label v-if="props.label">{{ props.label }}</label> -->
    <neb-content-header
      v-if="props.label"
      :title="props.label"
      type="section"
    />

    <p v-if="!modelValue?.length" class="empty-list-text">
      Use the button below to add an item to this list.
    </p>

    <!-- <neb-empty-state
      v-if="!modelValue?.length"
      :icon="null"
      title="This list is empty"
      description="Use the button below to add a new item to it."
    >
      <neb-button class="add-btn" small type="secondary" @click="addItem">
        <icon name="material-symbols:add-rounded" />Add
      </neb-button>
    </neb-empty-state> -->

    <template v-else>
      <div v-for="(item, index) in modelValue" :key="index" class="item">
        <div class="delete-button" @click="modelValue.splice(index, 1)">
          <icon name="material-symbols:delete-outline-rounded" />
        </div>

        <div class="slot-wrapper">
          <slot :item />
        </div>
      </div>
    </template>

    <neb-button class="add-btn" small type="secondary-neutral" @click="addItem()">
      <icon name="material-symbols:add-rounded" />Add
    </neb-button>
  </div>
</template>

<style scoped>
.form-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

label {
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--neutral-color-800);
}

.empty-list-text {
  color: var(--neutral-color-600);
  font-size: var(--text-sm);
}

.item {
  display: flex;
  flex-wrap: none;
  gap: var(--space-3);

  .delete-button {
    background: var(--neutral-color-100);
    border-radius: var(--radius-small);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2);
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: var(--neutral-color-200);
    }

    .icon {
      color: var(--neutral-color-700);
      font-size: var(--text-lg) !important;
    }
  }

  .slot-wrapper {
    flex: 1;
  }
}

.add-btn {
  align-self: flex-start;
}
</style>
