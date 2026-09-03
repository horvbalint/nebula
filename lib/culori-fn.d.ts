/**
 * Minimal ambient types for the exact `culori/fn` surface `neb-color-scale.ts`
 * uses. culori 4.x ships no type declarations for the tree-shakeable `/fn`
 * entry; typing only what we call keeps the dependency surface explicit and
 * survives culori internals changing.
 */
declare module 'culori/fn' {
  export interface Oklch { mode: 'oklch', l: number, c: number, h?: number }
  export interface Rgb { mode: 'rgb', r: number, g: number, b: number, alpha?: number }

  type ColorInput = Oklch | Rgb

  interface ColorMode<M extends string = string> { mode: M, [key: string]: unknown }

  export const modeRgb: ColorMode<'rgb'>
  export const modeOklch: ColorMode<'oklch'>

  /** Registers a colour mode and returns a converter into it. */
  export function useMode(mode: ColorMode<'rgb'>): (color: ColorInput) => Rgb
  export function useMode(mode: ColorMode<'oklch'>): (color: ColorInput) => Oklch
}
