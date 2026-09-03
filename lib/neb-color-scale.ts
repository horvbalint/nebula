/**
 * Perceptual (OKLCH) colour-scale generator.
 *
 * Every step of a ramp is anchored to a target OKLCH lightness, with WCAG
 * contrast floors applied to the steps that carry text or a solid fill on a
 * light ground. This replaces the old sRGB byte-mixing (`theme-colors`), which
 * produced uneven lightness steps, chroma that collapsed at the dark end, and
 * wildly different ramp quality per hue.
 *
 * The public API in `@nebula/composables/neb-color` is unchanged — this module
 * only decides the values that come out. See `docs/semantic-tokens.md` for how
 * the semantic layer consumes these steps and `docs/migrating-to-oklch-colors.md`
 * for the old → new value tables.
 *
 * Isomorphic: imported by the build-time Nuxt module (`modules/color.ts`) and
 * bundled into the client for `setNebColorPalette()` live theming. Colour maths
 * comes from `culori/fn` (tree-shakeable); the tuning tables below are the
 * design contract and the only thing worth reviewing here.
 */
import { converter, formatHex, modeLrgb, modeOklch, modeRgb, parse, useMode, wcagContrast } from 'culori/fn'

useMode(modeOklch)
useMode(modeRgb)
useMode(modeLrgb) // wcagContrast converts through linear-sRGB

const toOklch = converter('oklch')
const toRgb = converter('rgb')

export const NEB_COLOR_STEPS = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
export type NebColorStep = typeof NEB_COLOR_STEPS[number]

/* ------------------------------------------------------------------ */
/* Tuning tables                                                       */
/* ------------------------------------------------------------------ */

/**
 * OKLCH lightness per step. Intent hues and the neutral ramp diverge because
 * the neutral ramp has to carry three text tiers on white (900/600/400) and
 * three on the dark page (300/400/500), which pins step 400 into a narrow band
 * the intent families don't have.
 */
export const NEB_INTENT_L: Record<NebColorStep, number> = {
  25: 0.985,
  50: 0.970,
  100: 0.940,
  200: 0.890,
  300: 0.795,
  400: 0.705,
  500: 0.615,
  600: 0.560,
  700: 0.505,
  800: 0.410,
  900: 0.315,
  950: 0.240,
}

export const NEB_NEUTRAL_L: Record<NebColorStep, number> = {
  25: 0.990,
  50: 0.975,
  100: 0.950,
  200: 0.900,
  300: 0.800,
  400: 0.665,
  500: 0.565,
  600: 0.515,
  700: 0.440,
  800: 0.350,
  900: 0.280,
  950: 0.205,
}

/**
 * Chroma as a fraction of the ramp's peak chroma. Rises toward the dark end
 * because OKLCH chroma is perceptually less visible at low lightness — a dark
 * tint needs proportionally more of it to read as tinted rather than dirty.
 */
export const NEB_INTENT_C_SHAPE: Record<NebColorStep, number> = {
  25: 0.10,
  50: 0.16,
  100: 0.30,
  200: 0.52,
  300: 0.78,
  400: 0.95,
  500: 1.00,
  600: 0.98,
  700: 0.92,
  800: 0.76,
  900: 0.58,
  950: 0.44,
}

/** Neutral chroma is absolute (`neutralTint` × shape), not seed-scaled. */
export const NEB_NEUTRAL_C_SHAPE: Record<NebColorStep, number> = {
  25: 0.40,
  50: 0.50,
  100: 0.60,
  200: 0.75,
  300: 0.90,
  400: 1.00,
  500: 1.00,
  600: 1.00,
  700: 1.10,
  800: 1.25,
  900: 1.40,
  950: 1.50,
}

/**
 * White-ground contrast floors — the solver darkens the step until the ratio is
 * met. Only steps that carry text or a solid fill on the light page appear here;
 * the dark-page floors the previous generator also tracked are, for every seed
 * in the sRGB gamut, already satisfied by the lightness tables above, so they
 * were dropped. `scripts/neb-color-report.mts` re-checks the full contract
 * (both grounds) against the shipped ramps.
 */
const NEB_INTENT_WHITE_FLOOR: Partial<Record<NebColorStep, number>> = {
  600: 4.5, // light --neb-text-{intent}
  700: 4.5, // light --neb-text-{intent}-hover; dark -solid under white
}

const NEB_NEUTRAL_WHITE_FLOOR: Partial<Record<NebColorStep, number>> = {
  400: 3.0, // light --neb-text-disabled
  600: 4.5, // light --neb-text-subtle
  700: 4.5, // dark --neb-bg-neutral-solid under white
  900: 7.0, // light --neb-text (body)
}

/**
 * OKLCH lightness where "peak chroma" is measured when projecting the seed's
 * gamut-relative saturation onto the ramp.
 */
export const NEB_CHROMA_ANCHOR_L = 0.615

/** Absolute OKLCH chroma of the neutral ramp at its peak-shape step. */
export const NEB_NEUTRAL_TINT_DEFAULT = 0.008

/**
 * OKLCH lightness of the bare `--neutral-color` token (the light-mode
 * `--neb-bg-neutral-solid` fill, under white text).
 */
export const NEB_NEUTRAL_BARE_L = 0.470

/**
 * Below this seed chroma the seed is treated as achromatic: OKLCH hue is
 * undefined at C=0 and resolves to 0 (red), which would tint a "grey" ramp.
 */
export const NEB_ACHROMATIC_C = 0.01

/**
 * Smallest lightness gap between adjacent steps that survives 8-bit
 * quantisation (~3 sRGB levels).
 */
const MIN_STEP_DL = 0.012

/**
 * Advisory (reported, never acted on): step 300 doubles as a visible border on
 * the light page and should clear ~1.8:1 against white. Its dark-page
 * counterpart (step 800 vs `neutral-color-950`) needs the real neutral ramp, so
 * `scripts/neb-color-report.mts` checks that one.
 */
const STEP_300_BORDER_ADVISORY = 1.8

/* ------------------------------------------------------------------ */
/* Colour helpers                                                      */
/* ------------------------------------------------------------------ */

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i
const GAMUT_EPS = 1e-4

interface SeedOklch { l: number, c: number, h: number, hex: string }

function parseHexSeed(hex: string): SeedOklch {
  const trimmed = hex.trim()
  if (!HEX_RE.test(trimmed))
    throw new Error(`[nebula] not a hex colour: ${JSON.stringify(hex)}`)

  const rgb = parse(trimmed)
  const o = toOklch(rgb) as { l: number, c?: number, h?: number }
  return { l: o.l, c: o.c ?? 0, h: o.h ?? 0, hex: (formatHex(rgb) as string).toUpperCase() }
}

/** Is this OKLCH coordinate inside sRGB, with the epsilon 8-bit output needs? */
function inSrgb(l: number, c: number, h: number): boolean {
  const { r, g, b } = toRgb({ mode: 'oklch', l, c, h }) as { r: number, g: number, b: number }
  return r >= -GAMUT_EPS && r <= 1 + GAMUT_EPS
    && g >= -GAMUT_EPS && g <= 1 + GAMUT_EPS
    && b >= -GAMUT_EPS && b <= 1 + GAMUT_EPS
}

/** Largest chroma ≤ `want` that is in sRGB at this lightness and hue. */
function fitChroma(l: number, want: number, h: number): number {
  if (want <= 0)
    return 0
  if (inSrgb(l, want, h))
    return want

  let lo = 0
  let hi = want
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (inSrgb(l, mid, h))
      lo = mid
    else
      hi = mid
  }
  return lo
}

/**
 * The 6-digit hex that actually ships for an OKLCH coordinate — chroma fitted to
 * gamut, then 8-bit quantised by `formatHex`. Every contrast probe measures
 * this, not the ideal float, so a step never reads 4.49:1 in production.
 */
function shippedHex(l: number, c: number, h: number): string {
  return (formatHex(toRgb({ mode: 'oklch', l, c: fitChroma(l, c, h), h })) as string).toUpperCase()
}

function componentsOf(hex: string): string {
  const { r, g, b } = parse(hex) as { r: number, g: number, b: number }
  return [r, g, b].map(n => Math.round(n * 255)).join(', ')
}

/** WCAG 2.x contrast ratio between two colours (hex or any culori-parseable string). */
export function nebContrast(a: string, b: string): number {
  return wcagContrast(a, b)
}

const WHITE = '#FFFFFF'

/* ------------------------------------------------------------------ */
/* Ramp builder                                                        */
/* ------------------------------------------------------------------ */

export interface NebRampStep {
  hex: string
  components: string
  l: number
  c: number
}

export interface NebRamp {
  /** The bare `--{family}-color` value. */
  bare: NebRampStep
  steps: Record<NebColorStep, NebRampStep>
  diagnostics: string[]
}

export interface BuildNebRampOptions {
  /** Build the neutral ramp (own lightness table, absolute chroma). */
  neutral?: boolean
  /**
   * Neutral only: hue in degrees. Passed explicitly because the neutral seed
   * hex can quantise to a pure grey and lose its hue.
   */
  hue?: number
  /** Neutral only: absolute peak chroma. */
  tint?: number
  /** Name used in diagnostic messages, e.g. `warningColor`. */
  label?: string
}

/** Largest L ≤ `target` whose shipped hex clears `ratio` against white. */
function solveWhiteFloor(target: number, c: number, h: number, ratio: number): { l: number, unmet: boolean } {
  if (nebContrast(shippedHex(target, c, h), WHITE) >= ratio)
    return { l: target, unmet: false }
  if (nebContrast(shippedHex(0, c, h), WHITE) < ratio)
    return { l: 0, unmet: true }

  let lo = 0
  let hi = target
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2
    if (nebContrast(shippedHex(mid, c, h), WHITE) >= ratio)
      lo = mid
    else
      hi = mid
  }
  return { l: lo, unmet: false }
}

export function buildNebRamp(seedHex: string, opts: BuildNebRampOptions = {}): NebRamp {
  const { neutral = false, label = 'colour' } = opts
  const diagnostics: string[] = []

  const seed = parseHexSeed(seedHex)
  const lTable = neutral ? NEB_NEUTRAL_L : NEB_INTENT_L
  const cShape = neutral ? NEB_NEUTRAL_C_SHAPE : NEB_INTENT_C_SHAPE
  const floors = neutral ? NEB_NEUTRAL_WHITE_FLOOR : NEB_INTENT_WHITE_FLOOR
  const hue = neutral ? (opts.hue ?? 0) : seed.h

  // Peak chroma
  let peak: number
  if (neutral) {
    peak = opts.tint ?? NEB_NEUTRAL_TINT_DEFAULT
  }
  else {
    const sat = seed.c < 1e-4 ? 0 : seed.c / fitChroma(seed.l, 0.4, hue)
    peak = sat * fitChroma(NEB_CHROMA_ANCHOR_L, 0.4, hue)
  }

  // Solve each step's lightness against its white-ground contrast floor.
  const solvedL = {} as Record<NebColorStep, number>
  for (const step of NEB_COLOR_STEPS) {
    const ratio = floors[step]
    if (ratio == null) {
      solvedL[step] = lTable[step]
      continue
    }
    const { l, unmet } = solveWhiteFloor(lTable[step], peak * cShape[step], hue, ratio)
    solvedL[step] = l
    if (unmet)
      diagnostics.push(`${label} step ${step}: contrast floor cannot be met by lightness alone`)
  }

  // Monotonic post-pass — keep the ramp strictly darkening with a quantisable gap.
  let prevStep: NebColorStep | null = null
  for (const step of NEB_COLOR_STEPS) {
    if (prevStep !== null) {
      const ceiling = solvedL[prevStep] - MIN_STEP_DL
      if (solvedL[step] > ceiling) {
        solvedL[step] = Math.max(0, ceiling)
        diagnostics.push(`${label} step ${step}: pulled darker to stay ordered after step ${prevStep}`)
      }
    }
    prevStep = step
  }

  // Materialise
  const steps = {} as Record<NebColorStep, NebRampStep>
  for (const step of NEB_COLOR_STEPS) {
    const l = solvedL[step]
    const want = peak * cShape[step]
    const hex = shippedHex(l, want, hue)
    steps[step] = { hex, components: componentsOf(hex), l, c: fitChroma(l, want, hue) }
  }

  // Advisory — never moves lightness
  if (!neutral && nebContrast(steps[300].hex, WHITE) < STEP_300_BORDER_ADVISORY) {
    diagnostics.push(
      `${label} step 300: ${nebContrast(steps[300].hex, WHITE).toFixed(2)}:1 vs light ground, `
      + `want ≥ ${STEP_300_BORDER_ADVISORY} (light --neb-border-{intent}-strong/-focus/-invalid visibility)`,
    )
  }

  // Bare token
  let bare: NebRampStep
  if (neutral) {
    const l = NEB_NEUTRAL_BARE_L
    const hex = shippedHex(l, peak, hue)
    bare = { hex, components: componentsOf(hex), l, c: fitChroma(l, peak, hue) }
  }
  else {
    // The bare `--{intent}-color` is the seed itself (8-bit quantised).
    const hex = seed.hex
    bare = { hex, components: componentsOf(hex), l: seed.l, c: seed.c }
    // The solid button fill is step 600 (contrast-floored), so a pale seed no
    // longer breaks it — but the raw `--{intent}-color` still shows through in
    // `--neb-border-{intent}-alert`, so flag a seed that would be a faint stripe.
    const r = nebContrast(hex, WHITE)
    if (r < 3) {
      diagnostics.push(
        `${label} ${hex} is very light — ${r.toFixed(2)}:1 on white — so --neb-border-${label.replace('Color', '')}-alert `
        + `will read as a faint stripe. A darker seed (e.g. ${steps[600].hex}, ${nebContrast(steps[600].hex, WHITE).toFixed(2)}:1) reads cleaner.`,
      )
    }
  }

  return { bare, steps, diagnostics }
}

/* ------------------------------------------------------------------ */
/* Neutral derivation                                                  */
/* ------------------------------------------------------------------ */

export interface NebNeutralSpec {
  /** Hex for the bare `--neutral-color` token. */
  seedHex: string
  /** Hue passed to `buildNebRamp({ neutral: true })`. */
  hue: number
  /** Absolute peak chroma. */
  tint: number
}

/**
 * Replaces the old `new Color(primary).saturationl(5).lightness(45)`.
 * Uses absolute OKLCH chroma (perceptually uniform across hue, unlike HSL's
 * hue-dependent 5%) and drops the tint entirely for an achromatic primary.
 */
export function deriveNeutral(primaryHex: string, tint = NEB_NEUTRAL_TINT_DEFAULT, hue?: number): NebNeutralSpec {
  const seed = parseHexSeed(primaryHex)
  const effTint = seed.c < NEB_ACHROMATIC_C ? 0 : tint
  const effHue = hue ?? seed.h

  return { seedHex: shippedHex(NEB_NEUTRAL_BARE_L, effTint, effHue), hue: effHue, tint: effTint }
}
