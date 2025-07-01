import { useBreakpoints } from '@vueuse/core'

// Centralized breakpoint configuration
const APP_BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
} as const

export type AppBreakpoint = keyof typeof APP_BREAKPOINTS

/**
 * Composable for consistent breakpoint management across the app
 * Uses VueUse's useBreakpoints with predefined breakpoints
 */
export function useAppBreakpoints() {
  const breakpoints = useBreakpoints(APP_BREAKPOINTS)

  return {
    // Active breakpoint name (reactive)
    activeBreakpoint: breakpoints.active(),

    // Individual breakpoint checkers (reactive)
    isMobile: breakpoints.smaller('tablet'),
    isTablet: breakpoints.between('tablet', 'laptop'),
    isLaptop: breakpoints.between('laptop', 'desktop'),
    isDesktop: breakpoints.greater('desktop'),

    // Size checkers
    isSmallScreen: breakpoints.smaller('laptop'), // mobile + tablet
    isLargeScreen: breakpoints.greaterOrEqual('laptop'), // laptop + desktop

    // Access to the raw breakpoints object for advanced usage
    breakpoints,

    // Breakpoint values for reference
    BREAKPOINTS: APP_BREAKPOINTS,
  }
}
