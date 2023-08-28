export function getSlotsChildren(slots: any): VNode[] {
  const children = slots.default?.()

  if (!children.length)
    return children

  return children
    .filter((c: any) => {
      if (typeof c.type === 'symbol')
        return typeof c.children !== 'string' // `v-if="false"` or commented node

      return true
    })
    .flatMap((c: any) => {
      if (typeof c.type === 'symbol')
        return c.children

      else if (c.type.name === 'ContentSlot')
        return c.ctx.slots.default?.()

      return c
    })
}
