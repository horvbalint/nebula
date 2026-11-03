import type { UseFloatingOptions } from '@floating-ui/vue'
import type { InjectionKey, Ref } from 'vue'
import { offset, shift } from '@floating-ui/vue'

export const nebSideNavRailKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('neb-side-nav-rail')

/**
 * Floating options for a tooltip that labels something inside the side nav.
 * `fixed` lets it escape the rail's `overflow: hidden`.
 */
export const nebSideNavTooltipOptions: UseFloatingOptions = {
  placement: 'right',
  strategy: 'fixed',
  middleware: [offset(12), shift({ padding: 4 })],
}
