<script setup lang="ts" generic="T">
const props = withDefaults(defineProps<{
  label?: string
  withInitialItem?: boolean
  factory?: () => T
}>(), {
  withInitialItem: false,
  factory: () => ({} as T),
})

const emit = defineEmits<{
  remove: [index: number]
  add: []
}>()

const modelValue = defineModel<T[] | undefined>({
  required: true,
})

if (!modelValue.value)
  modelValue.value = []

function addItem() {
  modelValue.value!.push(props.factory())
  emit('add')
}

function removeItem(index: number) {
  modelValue.value!.splice(index, 1)
  emit('remove', index)
}

if (!modelValue.value.length && props.withInitialItem)
  addItem()
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
      <slot name="empty">
        {{ $t('nebula.neb-form-list.empty') }}
      </slot>
    </p>

    <template v-else>
      <div v-for="(item, index) in modelValue" :key="index" class="item">
        <div class="delete-button" @click="removeItem(index)">
          <icon name="material-symbols:delete-outline-rounded" />
        </div>

        <div class="slot-wrapper">
          <slot :item :index />
        </div>
      </div>
    </template>

    <div class="actions">
      <neb-button small type="secondary-neutral" @click="addItem()">
        <icon name="material-symbols:add-rounded" />{{ $t('nebula.neb-form-list.add') }}
      </neb-button>

      <slot name="actions" />
    </div>
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
  color: var(--neb-text);
}

.empty-list-text {
  color: var(--neb-text-muted);
  font-size: var(--text-sm);
}

.item {
  display: flex;
  flex-wrap: none;
  gap: var(--space-3);

  .delete-button {
    background: var(--neb-bg-subtle);
    border-radius: var(--radius-small);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2);
    cursor: pointer;
    transition: background var(--duration-slow);

    &:hover {
      background: var(--neb-border-subtle);
    }

    .icon {
      color: var(--neb-text);
      font-size: var(--text-lg) !important;
    }
  }

  .slot-wrapper {
    flex: 1;
  }
}

.actions {
  display: flex;
  gap: var(--space-2);
  align-items: end;
}
</style>
