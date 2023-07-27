<script lang="ts">
export default defineNuxtComponent({
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sortKey: null as string | null,
      sortDir: null as string | null,
    }
  },
  computed: {
    sortedData() {
      if (!this.sortKey)
        return this.$props.data

      const sortedData = this.$props.data.sort((a, b) => {
        if (this.sortDir === 'asc')
          return a[this.sortKey].localeCompare(b[this.sortKey])
        else
          return b[this.sortKey].localeCompare(a[this.sortKey])
      })

      return sortedData
    },
  },
  methods: {
    sortColumn(sortKey: string, sortDir: string) {
      this.sortKey = sortKey
      this.sortDir = sortDir
    },
  },
})
</script>

<template>
  <div class="ut-table-component">
    <header class="table-header">
      <h2>Ebek listája</h2>
    </header>

    <table class="ut-table">
      <ut-table-header :columns="columns" @sort="sortColumn($event.sortKey, $event.sortDir)" />

      <tr v-for="(row, index) in sortedData" :key="index">
        <td v-for="(cell, key) in row" :key="key">
          {{ cell }}
        </td>
      </tr>
    </table>

    <footer class="table-footer">
      <p>asddasasd</p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.ut-table-component {
  border: 1px solid $neutral-color-200;
  border-radius: $radius-default;
  box-shadow: $shadow-sm;
  position: relative;
  height: 100%;
  width: 100%;
  overflow-x: auto;
}
.table-header, .table-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: $space-xxs;
  height: 50px;
  background: #fff;
  padding: $space-s $space-m;
  position: sticky;
  top: 0;
  left: 0;
  border-bottom: 1px solid $neutral-color-200;

  h2 {
    font-size: $text-lg;
    font-weight: 600;
  }
}
.table-footer {
  bottom: 0;
  left: 0;
}
.ut-table {
  width: 100%;

  td {
    padding: 20px $space-m;
    font-size: $text-sm;
    font-weight: 400;
    color: $neutral-color-600;
    text-align: left;
    white-space: nowrap;
  }
  tr {
    border-top: 1px solid $neutral-color-200;
    border-bottom: 1px solid $neutral-color-200;

    &:hover {
      background: $primary-color-50;
    }
  }
}
</style>
