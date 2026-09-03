import type { NebRamp } from '../lib/neb-color-scale'
import { buildNebRamp, deriveNeutral, NEB_COLOR_STEPS } from '../lib/neb-color-scale'

export interface ColorPaletteSources {
  primaryColor: `#${string}`
  secondaryColor: `#${string}`
  successColor: `#${string}`
  errorColor: `#${string}`
  warningColor: `#${string}`
  infoColor: `#${string}`
  /** Absolute OKLCH chroma of the derived neutral ramp. 0 = pure grey. Default 0.008. */
  neutralTint?: number
  /** OKLCH hue (deg) for the neutral ramp. Defaults to the primary colour's hue. */
  neutralHue?: number
}

export const nebDefaultColorPalette: ColorPaletteSources = {
  primaryColor: '#7c4ddb',
  secondaryColor: '#7c4ddb',
  successColor: '#198754',
  errorColor: '#D92D20',
  warningColor: '#A96000',
  infoColor: '#756b8a',
}

export interface NebColorPalette {
  colorPalette: Record<string, string>
  colorComponents: Record<string, string>
  /**
   * Human-readable warnings — a seed that fails contrast as a solid fill, a
   * step whose floor could not be met, etc. Surfaced by `modules/color.ts`.
   */
  diagnostics: string[]
}

function writeRamp(colorPalette: Record<string, string>, colorComponents: Record<string, string>, name: string, ramp: NebRamp) {
  colorPalette[name] = ramp.bare.hex
  colorComponents[`${name}-component`] = ramp.bare.components

  for (const step of NEB_COLOR_STEPS) {
    colorPalette[`${name}-${step}`] = ramp.steps[step].hex
    colorComponents[`${name}-component-${step}`] = ramp.steps[step].components
  }
}

export function calcColorPalette(sources: ColorPaletteSources): NebColorPalette {
  const colorPalette: Record<string, string> = {}
  const colorComponents: Record<string, string> = {}
  const diagnostics: string[] = []

  const neutral = deriveNeutral(sources.primaryColor, sources.neutralTint, sources.neutralHue)
  const neutralRamp = buildNebRamp(neutral.seedHex, { neutral: true, hue: neutral.hue, tint: neutral.tint, label: 'neutralColor' })

  const intents: [name: string, seed: `#${string}`, label: string][] = [
    ['primary-color', sources.primaryColor, 'primaryColor'],
    ['secondary-color', sources.secondaryColor, 'secondaryColor'],
    ['success-color', sources.successColor, 'successColor'],
    ['error-color', sources.errorColor, 'errorColor'],
    ['warning-color', sources.warningColor, 'warningColor'],
    ['info-color', sources.infoColor, 'infoColor'],
  ]

  for (const [name, seed, label] of intents) {
    const ramp = buildNebRamp(seed, { label })
    writeRamp(colorPalette, colorComponents, name, ramp)
    diagnostics.push(...ramp.diagnostics)
  }

  // Emitted last, matching the previous generator's output order.
  writeRamp(colorPalette, colorComponents, 'neutral-color', neutralRamp)
  diagnostics.push(...neutralRamp.diagnostics)

  return { colorPalette, colorComponents, diagnostics }
}

export function setNebColorPalette(sources: Partial<ColorPaletteSources>) {
  const paletteSource = { ...nebDefaultColorPalette, ...sources }

  const { colorPalette, colorComponents } = calcColorPalette(paletteSource)

  for (const name in colorPalette)
    document.documentElement.style.setProperty(`--${name}`, colorPalette[name]!)

  for (const name in colorComponents)
    document.documentElement.style.setProperty(`--${name}`, colorComponents[name]!)
}
