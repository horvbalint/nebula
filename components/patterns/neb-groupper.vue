<script lang="ts">
export default defineNuxtComponent({
  props: {
    items: {
      type: Array,
      required: true,
    },

    groupKey: {
      type: String,
    },
    groupFun: {
      type: null as any as PropType<(item: any) => any>,
      default(props: any) {
        return (item: any) => item[props.groupKey]
      },
    },
    formatFun: {
      type: Function as PropType<(groupValue: any, item: any) => string>,
      default(groupValue: any, _item: any) {
        return groupValue.toString()
      },
    },
    groupSortDir: {
      type: String as PropType<'asc' | 'desc'>,
      default: 'desc',
    },
    groupSortFun: {
      type: Function as PropType<(groupOne: any, groupOther: any) => number>,
      default: (groupOne: any, groupOther: any) => groupOne.value.value - groupOther.value.value,
    },

    itemSortKey: {
      type: String,
    },
    itemSortDir: {
      type: String as PropType<'asc' | 'desc'>,
      default: 'desc',
    },
    itemSortProcessFun: {
      type: null as any as PropType<(item: any) => number>,
      default(props: any) {
        return (item: any) => {
          if (props.itemSortKey)
            return item[props.itemSortKey]

          return item
        }
      },
    },

    itemGap: {
      type: String,
      default: '8px',
    },
    hasLine: {
      type: Boolean,
      default: false,
    },
    grid: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    dataGroups() {
      let groups = this.createGroups()

      groups = this.sortWithinGroups(groups)
      groups = this.sortGroups(groups)

      return groups
    },
  },
  methods: {
    createGroups() {
      const groups = {} as any

      for (const item of this.$props.items) {
        const groupValue = this.$props.groupFun(item)

        if (!groups[groupValue]) {
          groups[groupValue] = {
            value: groupValue,
            label: this.$props.formatFun(groupValue, item),
            items: [],
          }
        }

        groups[groupValue].items.push(item)
      }

      return groups
    },
    sortGroups(groups: any) {
      const descSortFun = ([kA, vA]: any, [kB, vB]: any) => this.$props.groupSortFun({ key: kB, value: vB }, { key: kA, value: vA })
      const ascSortFun = ([kA, vA]: any, [kB, vB]: any) => this.$props.groupSortFun({ key: kA, value: vA }, { key: kB, value: vB })
      const sortFun = this.$props.groupSortDir === 'desc' ? descSortFun : ascSortFun

      const sortedGroupEntries = Object.entries(groups).sort(sortFun)
      return Object.fromEntries(sortedGroupEntries)
    },
    sortWithinGroups(groups: any) {
      const descSortFun = (a: any, b: any) => this.$props.itemSortProcessFun(b) - this.$props.itemSortProcessFun(a)
      const ascSortFun = (a: any, b: any) => this.$props.itemSortProcessFun(a) - this.$props.itemSortProcessFun(b)
      const sortFun = this.$props.itemSortDir === 'desc' ? descSortFun : ascSortFun

      for (const key in groups)
        groups[key].items.sort(sortFun)

      return groups
    },
  },
})
</script>

<template>
  <div class="neb-groupper">
    <div
      v-for="(group, groupId) in dataGroups"
      :key="groupId"
      class="neb-groupper-group"
      :class="{ 'neb-groupper-group-line': hasLine }"
    >
      <slot name="group" :group="group" :group-id="groupId">
        <neb-expansion :title="group.label">
          <template #body>
            <div class="neb-groupper-group-items" :style="{ gap: itemGap }" :class="{ grid }">
              <div v-for="(item, index) in group.items" :key="index">
                <slot name="item" :item="item" />
              </div>
            </div>
          </template>
        </neb-expansion>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.neb-groupper {
  position: relative;
  display: flex;
  flex-direction: column;
}
.neb-groupper-group-items {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  &.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-3) !important;
  }
}
.neb-groupper-group-line {
  padding-left: var(--space-6);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    display: block;
    width: 2px;
    height: calc(100% + 8px);
    background: var(--neutral-color-200);
  }
  &:after {
    content: '';
    position: absolute;
    left: -9px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--space-3);
    height: var(--space-3);
    background: var(--neutral-color-200);
    border-radius: 50%;
    border: 4px solid var(--white-color);
  }
  &:last-child {
    &:before {
      height: calc(100% - 16px);
    }
  }
}

.dark-mode {
  .neb-groupper-group-line {
    &:before {
      background: var(--neutral-color-700);
    }
    &:after {
      background: var(--neutral-color-700);
      border: 4px solid var(--neutral-color-950);
    }
    &:last-child {
      &:before {
        height: calc(100% - 16px);
      }
    }
  }
}
</style>
