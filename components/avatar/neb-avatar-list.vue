<script lang="ts">
import { h } from 'vue'
import NebAvatar from './neb-avatar'
import { getSlotsChildren } from '~/composables/neb-slots'

export default {
  props: {
    max: {
      type: Number,
      default: 3,
    },
    size: {
      type: String,
      default: '40px',
    },
  },
  setup(props) {
    const slots = useSlots()
    if (!slots || !slots.default)
      return

    const plus = ref(0)
    const children = getSlotsChildren(slots)

    plus.value = children.length - props.max
    children.splice(props.max, plus.value)

    if (props.size) {
      children.map((node: VNode) => {
        if (node.props)
          return node.props.size = props.size

        return node
      })
    }

    if (plus.value > 0)
      children.push(h(NebAvatar, { text: `+${plus.value}`, size: props.size }))

    return () => h('div', { class: 'neb-avatar-list' }, children)
  },
}
</script>

<!-- <template>
  <div class="neb-avatar-list">
    <slot />
  </div>
</template> -->

<style scoped>
.neb-avatar-list {
  display: flex;
  align-items: center;
}
</style>

<style>
.neb-avatar-list .neb-avatar {
  margin-left: -8px;
  border: 3px solid var(--white-color);

  &:first-child {
    margin-left: 0;
  }
}
</style>
