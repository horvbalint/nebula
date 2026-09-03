/**
 * Perceptual (OKLCH) colour-scale generator.
 *
 * Every step of a ramp is anchored to a target OKLCH lightness, with WCAG
 * contrast floors applied to the steps that carry text or solid fills. This
 * replaces the old sRGB byte-mixing (`theme-colors`), which produced uneven
 * lightness steps, chroma that collapsed at the dark end, and wildly different
 * ramp quality per hue.
 *
 * The public API in `@nebula/composables/neb-color` is unchanged — this module
 * only changes the values that come out. See
 * `docs/semantic-tokens.md` for how the semantic layer consumes these steps, and
 * `plan-the-new-theme-*.md` for the derivation of every number below.
 *
 * Isomorphic: imported by the build-time Nuxt module (`modules/color.ts`) and
 * bundled into the client for `setNebColorPalette()` live theming. `culori/fn`
 * is the only dependency; everything else is hand-rolled to keep the surface
 * small and version-stable.
 */
import { modeOklch, modeRgb, useMode } from 'culori/fn'

const toOklch = useMode(modeOklch)
const toRgb = useMode(modeRgb)

export const NEB_COLOR_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
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
 * OKLCH lightness where "peak chroma" is measured when projecting the seed's
 * gamut-relative saturation onto the ramp.
 */
export const NEB_CHROMA_ANCHOR_L = 0.615

/** Absolute OKLCH chroma of the neutral ramp at its peak-shape step. */
export const NEB_NEUTRAL_TINT_DEFAULT = 0.008

/**
 * OKLCH lightness of the bare `--neutral-color` token (the light-mode
 * `--neb-bg-neutral-solid` fill, under white text). Darker than step 600 so its
 * hover (→ step 600) brightens, consistent with the solid-hover rule below.
 */
export const NEB_NEUTRAL_BARE_L = 0.470

/**
 * Below this seed chroma the seed is treated as achromatic: OKLCH hue is
 * undefined at C=0 and resolves to 0 (red), which would tint a "grey" ramp.
 */
export const NEB_ACHROMATIC_C = 0.01

/**
 * Set to a value up to ~0.05 to shift the 600/700 pair down so light-mode
 * solid buttons darken on hover again. 0 = solid buttons brighten on hover in
 * both modes (dark mode already does: 700 → 600). Keeping this at 0 is what
 * holds step 700 at ~5.5–6.5:1 vs white — the dim-dark-button fix.
 */
export const NEB_SOLID_HOVER_SHIFT_MAX = 0

/**
 * Smallest lightness gap between adjacent steps that survives 8-bit
 * quantisation (~3 sRGB levels).
 */
const MIN_STEP_DL = 0.012

/* ------------------------------------------------------------------ */
/* Contrast floors                                                     */
/* ------------------------------------------------------------------ */

type Ground = 'light' | 'dark'
interface Floor { ground: Ground, ratio: number }
interface Advisory { ground: Ground, ratio: number, note: string }

/**
 * Hard floors — the solver nudges lightness until these are met.
 * A `light`-ground floor is an upper bound on L; a `dark`-ground floor a lower
 * bound. Derived from the step→job contract in `assets/semantic.css`.
 */
const INTENT_FLOORS: Partial<Record<NebColorStep, Floor[]>> = {
  200: [{ ground: 'dark', ratio: 4.5 }], // dark --neb-text-{intent}-hover
  300: [{ ground: 'dark', ratio: 4.5 }], // dark --neb-text-{intent}
  600: [{ ground: 'light', ratio: 4.5 }], // light --neb-text-{intent}
  700: [{ ground: 'light', ratio: 4.5 }], // light text-hover; dark -solid under white
}

const NEUTRAL_FLOORS: Partial<Record<NebColorStep, Floor[]>> = {
  300: [{ ground: 'dark', ratio: 7.0 }], // dark --neb-text (body)
  400: [{ ground: 'light', ratio: 3.0 }, { ground: 'dark', ratio: 4.5 }], // light subtle/disabled; dark muted
  500: [{ ground: 'dark', ratio: 3.0 }], // dark --neb-text-subtle/-disabled
  600: [{ ground: 'light', ratio: 4.5 }], // light --neb-text-muted
  700: [{ ground: 'light', ratio: 4.5 }], // dark --neb-bg-neutral-solid under white
  900: [{ ground: 'light', ratio: 7.0 }], // light --neb-text (body)
}

/** Advisory only — reported, never acted on. */
const INTENT_ADVISORIES: Partial<Record<NebColorStep, Advisory[]>> = {
  300: [{ ground: 'light', ratio: 1.8, note: 'light --neb-border-{intent}-strong/-focus/-invalid visibility' }],
  800: [{ ground: 'dark', ratio: 1.8, note: 'dark --neb-border-{intent} visibility' }],
}

/* ------------------------------------------------------------------ */
/* Colour maths (hand-rolled, so culori's surface stays tiny)          */
/* ------------------------------------------------------------------ */

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

interface Rgb { mode: 'rgb', r: number, g: number, b: number }

export function parseHexSeed(hex: string): Rgb {
  const m = HEX_RE.exec(hex.trim())
  const group = m?.[1]
  if (!group)
    throw new Error(`[nebula] not a hex colour: ${JSON.stringify(hex)}`)

  const full = group.length === 3 ? group.replace(/./g, ch => ch + ch) : group
  const int = Number.parseInt(full, 16)

  return {
    mode: 'rgb',
    r: ((int >> 16) & 0xFF) / 255,
    g: ((int >> 8) & 0xFF) / 255,
    b: (int & 0xFF) / 255,
  }
}

const GAMUT_EPS = 1e-4

function inSrgb(rgb: Rgb): boolean {
  return rgb.r >= -GAMUT_EPS && rgb.r <= 1 + GAMUT_EPS
    && rgb.g >= -GAMUT_EPS && rgb.g <= 1 + GAMUT_EPS
    && rgb.b >= -GAMUT_EPS && rgb.b <= 1 + GAMUT_EPS
}

/** Largest chroma ≤ `want` that is in sRGB at this lightness and hue. */
function fitChroma(l: number, want: number, h: number): number {
  if (want <= 0)
    return 0
  if (inSrgb(toRgb({ mode: 'oklch', l, c: want, h })))
    return want

  let lo = 0
  let hi = want
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (inSrgb(toRgb({ mode: 'oklch', l, c: mid, h })))
      lo = mid
    else
      hi = mid
  }
  return lo
}

function maxChroma(l: number, h: number): number {
  return fitChroma(l, 0.4, h)
}

type Ints = readonly [number, number, number]

function clampByte(x: number): number {
  return x < 0 ? 0 : x > 255 ? 255 : Math.round(x)
}

function quantise(rgb: Rgb): Ints {
  return [clampByte(rgb.r * 255), clampByte(rgb.g * 255), clampByte(rgb.b * 255)]
}

/**
 * The 0–255 triple that actually ships for an OKLCH coordinate. Every contrast
 * probe measures this, not the ideal float — otherwise a step reads 4.49:1 in
 * production.
 */
function stepInts(l: number, c: number, h: number): Ints {
  return quantise(toRgb({ mode: 'oklch', l, c, h }))
}

export function hexOf(ints: Ints): string {
  return `#${ints.map(n => n.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

function componentsOf(ints: Ints): string {
  return ints.join(', ')
}

function channelLum(n: number): number {
  const c = n / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(ints: Ints): number {
  return 0.2126 * channelLum(ints[0]) + 0.7152 * channelLum(ints[1]) + 0.0722 * channelLum(ints[2])
}

function contrast(a: Ints, b: Ints): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

export function nebContrast(hexA: string, hexB: string): number {
  return contrast(quantise(parseHexSeed(hexA)), quantise(parseHexSeed(hexB)))
}

const WHITE: Ints = [255, 255, 255]

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
  /**
   * Dark-ground hex for dark-mode contrast floors. Omit on the first neutral
   * pass (there is nothing to measure against yet).
   */
  darkGround?: string
  /** Name used in diagnostic messages, e.g. `warningColor`. */
  label?: string
}

interface SolveResult {
  l: number
  conflict: boolean
  unsatisfiable: boolean
}

function solveStepL(targetL: number, cTarget: number, h: number, floors: Floor[], darkGround: Ints | null): SolveResult {
  let lo = 0
  let hi = 1
  let conflict = false
  let unsatisfiable = false

  const cAt = (l: number): number => fitChroma(l, cTarget, h)
  const ratioAt = (l: number, ground: Ints): number => contrast(stepInts(l, cAt(l), h), ground)

  for (const f of floors) {
    const ground = f.ground === 'light' ? WHITE : darkGround
    if (!ground)
      continue

    if (ratioAt(targetL, ground) >= f.ratio)
      continue

    if (f.ground === 'light') {
      // white contrast rises as L falls — find the largest L ≤ target that passes
      if (ratioAt(0, ground) < f.ratio) {
        unsatisfiable = true
        hi = 0
        continue
      }
      let a = 0
      let b = targetL
      for (let i = 0; i < 22; i++) {
        const mid = (a + b) / 2
        if (ratioAt(mid, ground) >= f.ratio)
          a = mid
        else
          b = mid
      }
      hi = Math.min(hi, a)
    }
    else {
      // dark-ground contrast rises as L rises — find the smallest L ≥ target that passes
      if (ratioAt(1, ground) < f.ratio) {
        unsatisfiable = true
        lo = 1
        continue
      }
      let a = targetL
      let b = 1
      for (let i = 0; i < 22; i++) {
        const mid = (a + b) / 2
        if (ratioAt(mid, ground) >= f.ratio)
          b = mid
        else
          a = mid
      }
      lo = Math.max(lo, b)
    }
  }

  let l: number
  if (lo > hi) {
    l = hi // light-ground readability wins the tie
    conflict = true
  }
  else {
    l = Math.min(Math.max(targetL, lo), hi)
  }
  return { l, conflict, unsatisfiable }
}

export function buildNebRamp(seedHex: string, opts: BuildNebRampOptions = {}): NebRamp {
  const { neutral = false, darkGround: darkGroundHex, label = 'colour' } = opts
  const diagnostics: string[] = []

  const seed = toOklch(parseHexSeed(seedHex))
  const lTable = neutral ? NEB_NEUTRAL_L : NEB_INTENT_L
  const cShape = neutral ? NEB_NEUTRAL_C_SHAPE : NEB_INTENT_C_SHAPE
  const floorTable = neutral ? NEUTRAL_FLOORS : INTENT_FLOORS

  const hue = neutral ? (opts.hue ?? 0) : (seed.h ?? 0)
  const cSeed = seed.c ?? 0

  const darkGround: Ints | null = darkGroundHex ? quantise(parseHexSeed(darkGroundHex)) : null

  // Peak chroma
  let peak: number
  if (neutral) {
    peak = opts.tint ?? NEB_NEUTRAL_TINT_DEFAULT
  }
  else {
    const sat = cSeed < 1e-4 ? 0 : cSeed / maxChroma(seed.l, hue)
    peak = sat * maxChroma(NEB_CHROMA_ANCHOR_L, hue)
  }

  // Solve each step's lightness
  const solvedL = {} as Record<NebColorStep, number>
  for (const step of NEB_COLOR_STEPS) {
    const cTarget = peak * cShape[step]
    // The 600/700 pair carries the light-mode solid fill's hover; shifting it
    // darker restores darken-on-hover at the cost of step 700's vividness. 0 by
    // default — see NEB_SOLID_HOVER_SHIFT_MAX.
    const solidHoverShift = !neutral && (step === 600 || step === 700) ? NEB_SOLID_HOVER_SHIFT_MAX : 0
    const res = solveStepL(lTable[step] - solidHoverShift, cTarget, hue, floorTable[step] ?? [], darkGround)
    solvedL[step] = res.l
    if (res.unsatisfiable)
      diagnostics.push(`${label} step ${step}: contrast floor cannot be met by lightness alone`)
    else if (res.conflict)
      diagnostics.push(`${label} step ${step}: light- and dark-ground floors conflict; kept the light-ground value`)
  }

  // Monotonic post-pass — keep the ramp strictly darkening with a quantisable gap
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
    const c = fitChroma(l, peak * cShape[step], hue)
    const ints = stepInts(l, c, hue)
    steps[step] = { hex: hexOf(ints), components: componentsOf(ints), l, c }
  }

  // Advisory checks — never move lightness
  if (!neutral) {
    for (const step of NEB_COLOR_STEPS) {
      for (const adv of INTENT_ADVISORIES[step] ?? []) {
        const ground = adv.ground === 'light' ? WHITE : darkGround
        if (!ground)
          continue
        const r = contrast(quantise(parseHexSeed(steps[step].hex)), ground)
        if (r < adv.ratio)
          diagnostics.push(`${label} step ${step}: ${r.toFixed(2)}:1 vs ${adv.ground} ground, want ≥ ${adv.ratio} (${adv.note})`)
      }
    }
  }

  // Bare token
  let bare: NebRampStep
  if (neutral) {
    const l = NEB_NEUTRAL_BARE_L
    const c = fitChroma(l, peak, hue)
    const ints = stepInts(l, c, hue)
    bare = { hex: hexOf(ints), components: componentsOf(ints), l, c }
  }
  else {
    const ints = quantise(parseHexSeed(seedHex))
    bare = { hex: hexOf(ints), components: componentsOf(ints), l: seed.l, c: cSeed }
    // The solid button fill is step 600 (contrast-floored), so a pale seed no
    // longer breaks it — but the raw `--{intent}-color` still shows through in
    // `--neb-border-{intent}-alert`, so flag a seed that would be a faint stripe.
    const r = contrast(ints, WHITE)
    if (r < 3) {
      diagnostics.push(
        `${label} ${hexOf(ints)} is very light — ${r.toFixed(2)}:1 on white — so --neb-border-${label.replace('Color', '')}-alert `
        + `will read as a faint stripe. A darker seed (e.g. ${steps[600].hex}, ${contrast(quantise(parseHexSeed(steps[600].hex)), WHITE).toFixed(2)}:1) reads cleaner.`,
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
  const seed = toOklch(parseHexSeed(primaryHex))
  const cSeed = seed.c ?? 0
  const effTint = cSeed < NEB_ACHROMATIC_C ? 0 : tint
  const effHue = hue ?? seed.h ?? 0

  const c = fitChroma(NEB_NEUTRAL_BARE_L, effTint, effHue)
  const seedHex = hexOf(stepInts(NEB_NEUTRAL_BARE_L, c, effHue))
  return { seedHex, hue: effHue, tint: effTint }
}
