<script lang="ts" setup>
export interface Breadcrumb {
  id: string | number
  text: string
  icon?: string
}

const props = withDefaults(defineProps<{
  crumbs: string[] | Breadcrumb[]
  separator?: string
}>(), {
  separator: 'material-symbols:arrow-forward-ios-rounded',
})

defineEmits<{
  click: [id: Breadcrumb['id']]
}>()

const computedCrumbs = computed<Breadcrumb[]>(() => {
  if (!props.crumbs.length || typeof props.crumbs[0] === 'object')
    return props.crumbs as Breadcrumb[]

  return (props.crumbs as string[]).map(crumb => ({ id: crumb, text: crumb }))
})

function getButtonType(index: number) {
  if (index === computedCrumbs.value.length - 1)
    return 'tertiary'
  else
    return 'tertiary-neutral'
}
</script>

<template>
  <div class="neb-breadcrumbs">
    <ul>
      <li v-for="(crumb, index) in computedCrumbs" :key="crumb.id">
        <neb-button
          :type="getButtonType(index)"
          small
          @click="$emit('click', crumb.id)"
        >
          <icon v-if="crumb.icon" class="crumb-icon" :name="crumb.icon" />

          {{ crumb.text }}
        </neb-button>

        <icon class="separator" :name="separator" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
  margin-left: -8px;
}
li {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: var(--space-1);

  &:last-child .separator{
    display: none;
  }
  .separator {
    width: 12px;
    height: 12px;
    color: var(--neutral-color-400);
  }
  .crumb-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
