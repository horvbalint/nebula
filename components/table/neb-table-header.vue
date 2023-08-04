<script lang="ts">
export default defineNuxtComponent({
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sortDir: 'asc',
      sortKey: null as null | string,
    }
  },
  computed: {
    iconName() {
      if (this.sortDir === 'asc')
        return 'material-symbols:arrow-downward-alt'
      return 'material-symbols:arrow-upward-alt'
    },
  },
  methods: {
    handleSortEmit(key: string) {
      this.sortKey = key
      this.$emit('sort', { sortKey: this.sortKey, sortDir: this.sortDir })

      if (this.sortDir === 'asc')
        this.sortDir = 'desc'
      else this.sortDir = 'asc'
    },
  },
  emits: ['sort'],
})
</script>

<template>
  <thead>
    <tr>
      <template v-for="(column, index) in columns" :key="index">
        <th v-for="(col, key) in column" :key="key" @click="handleSortEmit(key)">
          {{ col }} <icon v-if="key === sortKey" :name="iconName" />
        </th>
      </template>
    </tr>
  </thead>
</template>

<style scoped>
thead {
  border-bottom: 1px solid var(--neutral-color-200);
  position: sticky;
  top: 50px;
  left: 0;
  height: 44px;
}
.neb-table th {
  flex: 1;
  padding: var(--space-3) var(--space-6);
  text-align: left;
  background: var(--neutral-color-50);
  color: var(--neutral-color-600);
  font-size: var(--text-xs);
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  line-height: 22px;
}
</style>
