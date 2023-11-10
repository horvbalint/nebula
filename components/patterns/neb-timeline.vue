<script lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/hu'

export default defineNuxtComponent({
  props: {
    items: {
      type: Array,
      required: true,
    },
    groupSortDir: {
      type: String as PropType<'asc' | 'desc'>,
      default: 'desc',
    },
    groupKey: {
      type: String,
    },
    groupDateFormat: {
      type: String,
      default: 'YYYY MMMM D.',
    },
    itemSortKey: {
      type: String,
    },
    itemSortDir: {
      type: String as PropType<'asc' | 'desc'>,
      default: 'desc',
    },
    isItemSortKeyDate: {
      type: Boolean,
      default: true,
    },
    hasLine: {
      type: Boolean,
      default: true,
    },
    itemGap: {
      type: String,
      default: '8px',
    },
  },
  data() {
    return {
      dayjs,
    }
  },
  computed: {
    groupDatePrecision() {
      if (this.$props.groupDateFormat.includes('m'))
        return 'minute'

      const upperCased = this.$props.groupDateFormat.toUpperCase()
      if (upperCased.includes('H'))
        return 'hour'
      if (upperCased.includes('D'))
        return 'day'
      if (upperCased.includes('M'))
        return 'month'
      if (upperCased.includes('Y'))
        return 'year'
      else
        return 'year'
    },
  },
})
</script>

<template>
  <neb-groupper
    :items="items"
    :group-sort-dir="groupSortDir"
    :group-fun="(item: any) => dayjs(item[groupKey!]).startOf(groupDatePrecision)"
    :format-fun="(groupValue: any) => groupValue.locale('hu').format(groupDateFormat)"
    :item-sort-dir="itemSortDir"
    :item-sort-process-fun="(item: any) => new Date(item[itemSortKey!])"
    :has-line="hasLine"
  >
    <template #group="{ group }">
      <div class="timeline-groups" :style="{ gap: itemGap }">
        <h6>{{ group.label }}</h6>

        <div v-for="(item, index) in group.items" :key="index" class="timeline-item">
          <slot name="item" :item="item" :index="index" />
        </div>
      </div>
    </template>
  </neb-groupper>
</template>

<style scoped>
.timeline-groups {
  position: relative;
  margin-bottom: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  h6 {
    font-size: var(--text-md);
    color: var(--neutral-color-900);
    font-weight: 500;
    margin-bottom: var(--space-2);
  }
}
</style>
