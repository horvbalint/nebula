/**
 * Prints the generated colour ramps with OKLCH coordinates and WCAG contrast,
 * and flags any step that misses its contrast floor. This repo has no test
 * runner — this script is the regression harness for `lib/neb-color-scale.ts`.
 *
 *   node --experimental-strip-types scripts/neb-color-report.mts
 *   node --experimental-strip-types scripts/neb-color-report.mts '#2563eb' '#FFD700'
 *   pnpm color:report -- --check          # exit non-zero on any hard-floor miss
 *
 * With no seed arguments it runs a fixed adversarial list (the shipped defaults,
 * the playground presets, plus pale / achromatic / extreme-chroma / hue-wrap
 * edge cases).
 */
import process from 'node:process'
import {
  buildNebRamp,
  deriveNeutral,
  NEB_COLOR_STEPS,
  nebContrast,
} from '../lib/neb-color-scale.ts'

const FIXED_SEEDS = [
  '#7c4ddb', // primary default
  '#D92D20', // error default (post-fix)
  '#A96000', // warning default (post-fix)
  '#198754', // success default
  '#756b8a', // info default
  '#2563eb', // cool — the hue-collision regression case
  '#0f766e', // teal — low absolute chroma, high saturation
  '#FFD700', // pale gold — near-max lightness
  '#00FF00', // extreme chroma
  '#111827', // near-black seed
  '#808080', // achromatic — exercises the neutral hue guard
  '#FF00FF', // magenta — hue wrap near 0/360
]

const FLOORS: Record<'intent' | 'neutral', Record<number, { g: 'W' | 'D', r: number }>> = {
  intent: {
    200: { g: 'D', r: 4.5 },
    300: { g: 'D', r: 4.5 },
    600: { g: 'W', r: 4.5 },
    700: { g: 'W', r: 4.5 },
  },
  neutral: {
    300: { g: 'D', r: 7.0 },
    400: { g: 'D', r: 4.5 },
    500: { g: 'D', r: 3.0 },
    600: { g: 'W', r: 4.5 },
    700: { g: 'W', r: 4.5 },
    900: { g: 'W', r: 7.0 },
  },
}

const WHITE = '#FFFFFF'
const RESET = '\x1B[0m'
const DIM = '\x1B[2m'
const RED = '\x1B[31m'
const GREEN = '\x1B[32m'
const YELLOW = '\x1B[33m'

const args = process.argv.slice(2)
const check = args.includes('--check')
const seeds = args.filter(a => !a.startsWith('--'))
const list = seeds.length ? seeds : FIXED_SEEDS

let failures = 0

function reportRamp(name: string, ramp: ReturnType<typeof buildNebRamp>, darkGround: string, kind: 'intent' | 'neutral') {
  console.log(`\n  ${name}   ${DIM}bare ${ramp.bare.hex}${RESET}`)
  console.log(`  ${DIM}   step  hex        L      C       ΔL      vs #FFF   vs ${darkGround}${RESET}`)

  let prevL: number | null = null
  for (const step of NEB_COLOR_STEPS) {
    const s = ramp.steps[step]
    const cw = nebContrast(s.hex, WHITE)
    const cd = nebContrast(s.hex, darkGround)
    const dl = prevL === null ? '     ' : (prevL - s.l).toFixed(3)
    prevL = s.l

    const floor = FLOORS[kind][step]
    let mark = '   '
    if (floor) {
      const got = floor.g === 'W' ? cw : cd
      const ok = got >= floor.r
      mark = ok ? ` ${GREEN}✓${RESET} ` : ` ${RED}✗${RESET} `
      if (!ok) {
        failures++
      }
    }

    console.log(
      `  ${mark}${String(step).padStart(4)}  ${s.hex}  ${s.l.toFixed(3)}  ${s.c.toFixed(3)}   ${dl.padStart(6)}   `
      + `${cw.toFixed(2).padStart(6)}   ${cd.toFixed(2).padStart(6)}`,
    )
  }

  for (const d of ramp.diagnostics)
    console.log(`     ${YELLOW}! ${d}${RESET}`)
}

for (const seed of list) {
  console.log(`\n${'━'.repeat(74)}\nSEED  ${seed}`)

  const spec = deriveNeutral(seed)
  const neutralPass1 = buildNebRamp(spec.seedHex, { neutral: true, hue: spec.hue, tint: spec.tint, label: 'neutral' })
  const darkGround = neutralPass1.steps[950].hex

  const neutral = buildNebRamp(spec.seedHex, { neutral: true, hue: spec.hue, tint: spec.tint, darkGround, label: 'neutral' })
  reportRamp('NEUTRAL', neutral, darkGround, 'neutral')

  const primary = buildNebRamp(seed, { darkGround, label: 'primary' })
  reportRamp('PRIMARY', primary, darkGround, 'intent')
}

console.log(`\n${'━'.repeat(74)}`)
if (check) {
  if (failures) {
    console.log(`${RED}${failures} hard-floor miss(es)${RESET}`)
    process.exit(1)
  }
  console.log(`${GREEN}all hard floors met across ${list.length} seed(s)${RESET}`)
}
