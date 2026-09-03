<script setup lang="ts">
import type { ButtonType } from '@nebula/components/form-elements/neb-button.vue'
import type { Route } from '@nebula/components/navigation/header-nav/neb-header-nav.vue'
import type { Tab } from '@nebula/components/navigation/neb-tabs.vue'
import type { Menu } from '@nebula/components/overlays/neb-menu.vue'
import type { Step } from '@nebula/components/patterns/neb-stepper.vue'
import type { Columns, FormattedRow } from '@nebula/components/table/neb-table-frame.vue'
import type { MaybeFile } from '@nebula/composables/neb-file'
import { nebContrast } from '@nebula/lib/neb-color-scale'

definePageMeta({
  nebula: {
    name: 'Showcase',
    icon: 'material-symbols:palette-outline',
  },
})

/* ------------------------------------------------------------------ */
/* Page chrome: theme, palette, locale, table of contents              */
/* ------------------------------------------------------------------ */

const isDark = ref(false)
useHead({
  htmlAttrs: {
    class: computed(() => isDark.value ? 'dark-mode' : ''),
  },
})

const primaryColor = ref('#7c4ddb')
const presetColors = [
  '#7c4ddb',
  '#2563eb',
  '#0f766e',
  '#c2410c',
  '#be123c',
  '#334155',
  // adversarial seeds — pale, near-black, achromatic
  '#eab308',
  '#111827',
  '#808080',
]
watch(primaryColor, color => setNebColorPalette({ primaryColor: color as `#${string}` }))

const { locale, setLocale } = useI18n()
const selectedLocale = ref(locale.value)
watch(selectedLocale, value => setLocale(value))

const sections = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges', label: 'Badges & tags' },
  { id: 'avatars', label: 'Avatars' },
  { id: 'text-inputs', label: 'Text inputs' },
  { id: 'select', label: 'Select' },
  { id: 'datepicker', label: 'Datepicker' },
  { id: 'choice', label: 'Choice controls' },
  { id: 'files', label: 'Files' },
  { id: 'editor', label: 'Rich text' },
  { id: 'forms', label: 'Form composition' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'feedback', label: 'Feedback & states' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'data', label: 'Data display' },
  { id: 'layout', label: 'Layout patterns' },
  { id: 'images', label: 'Images' },
]

const colorScales = ['primary', 'neutral', 'success', 'error', 'warning', 'info']
const shades = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const textStyles = [
  { name: 'title-lg', fg: 'text' },
  { name: 'title', fg: 'text' },
  { name: 'heading', fg: 'text' },
  { name: 'label-strong', fg: 'text' },
  { name: 'label', fg: 'text' },
  { name: 'body', fg: 'text-subtle' },
  { name: 'body-sm', fg: 'text-subtle' },
  { name: 'caption', fg: 'text-subtle' },
  { name: 'hint', fg: 'text-subtle' },
]
const backgrounds = ['page', 'base', 'raised', 'subtle', 'hover', 'active', 'selected', 'disabled']
const intents = ['primary', 'success', 'error', 'warning', 'info']
const spaces = [1, 2, 3, 4, 6, 8, 12, 16]
const shadows = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

/* ------------------------------------------------------------------ */
/* Contrast audit — reads the *shipped* variables back off the DOM, so */
/* it validates generator -> module -> CSS -> cascade, not just maths. */
/* ------------------------------------------------------------------ */

interface AuditRow { label: string, token: string, ground: string, ratio: number, floor: number, ok: boolean }
const auditRows = ref<AuditRow[]>([])
const swatchInk = ref<Record<string, string>>({})

function readVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function runColorAudit() {
  const checks: Omit<AuditRow, 'ratio' | 'ok'>[] = []

  // Every row resolves *semantic* tokens for the current theme, so this checks
  // the semantic.css mapping, not just the generated ramp.
  for (const intent of intents) {
    checks.push(
      { label: `${intent} text`, token: `--neb-text-${intent}`, ground: '--neb-bg-page', floor: 4.5 },
      { label: `${intent} text-hover`, token: `--neb-text-${intent}-hover`, ground: '--neb-bg-page', floor: 4.5 },
      { label: `${intent} on-solid`, token: '--neb-text-on-solid', ground: `--neb-bg-${intent}-solid`, floor: 4.5 },
      { label: `${intent} on-solid-hover`, token: '--neb-text-on-solid', ground: `--neb-bg-${intent}-solid-hover`, floor: 4.5 },
    )
  }

  checks.push(
    { label: 'body text', token: '--neb-text', ground: '--neb-bg-page', floor: 7 },
    { label: 'subtle text', token: '--neb-text-subtle', ground: '--neb-bg-page', floor: 4.5 },
    { label: 'disabled text', token: '--neb-text-disabled', ground: '--neb-bg-page', floor: 3 },
    { label: 'neutral on-solid', token: '--neb-text-on-solid', ground: '--neb-bg-neutral-solid', floor: 4.5 },
    { label: 'neutral on-solid-hover', token: '--neb-text-on-solid', ground: '--neb-bg-neutral-solid-hover', floor: 4.5 },
  )

  auditRows.value = checks.map((c) => {
    const fg = readVar(c.token)
    const bg = readVar(c.ground)
    const ratio = fg && bg ? nebContrast(fg, bg) : 0
    return { ...c, ratio, ok: ratio >= c.floor }
  })

  const ink: Record<string, string> = {}
  for (const scale of colorScales) {
    for (const shade of shades) {
      const hex = readVar(`--${scale}-color-${shade}`)
      ink[`${scale}-${shade}`] = hex && nebContrast(hex, '#000000') >= nebContrast(hex, '#ffffff') ? '#000' : '#fff'
    }
  }
  swatchInk.value = ink
}

const auditFailures = computed(() => auditRows.value.filter(r => !r.ok).length)

onMounted(runColorAudit)
watch([primaryColor, isDark], () => nextTick(runColorAudit))

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

const buttonTypes: ButtonType[] = ['primary', 'secondary', 'secondary-neutral', 'tertiary', 'tertiary-neutral', 'link', 'link-neutral']

/* ------------------------------------------------------------------ */
/* Badges & tags                                                       */
/* ------------------------------------------------------------------ */

const badgeColors = ['error', 'warning', 'success', 'info', 'primary'] as const
const tags = ref(['design', 'system', 'nebula'])

/* ------------------------------------------------------------------ */
/* Text inputs                                                         */
/* ------------------------------------------------------------------ */

const inputValue = ref('')
const emailValue = ref('')
const numberValue = ref(42)
const passwordValue = ref('')
const lazyValue = ref('')
const textareaValue = ref('')
const searchTerm = ref('')
const tagInputValue = ref<string[]>(['alpha', 'beta'])

/* ------------------------------------------------------------------ */
/* Select                                                              */
/* ------------------------------------------------------------------ */

interface Country { id: number, name: string, continent: string }
const countries: Country[] = [
  { id: 1, name: 'Hungary', continent: 'Europe' },
  { id: 2, name: 'Austria', continent: 'Europe' },
  { id: 3, name: 'Japan', continent: 'Asia' },
  { id: 4, name: 'Brazil', continent: 'South America' },
  { id: 5, name: 'Canada', continent: 'North America' },
  { id: 6, name: 'Kenya', continent: 'Africa' },
]

const simpleSelect = ref('hu')
const objectSelect = ref<Country | null>(null)
const multiSelect = ref<Country[]>([])
const trackedSelect = ref<number | null>(3)
const creatableOptions = ref(['Bug', 'Feature'])
const creatableSelect = ref<string | null>(null)
function handleNewOption(term: string) {
  creatableOptions.value.push(term)
  creatableSelect.value = term
}

/* ------------------------------------------------------------------ */
/* Datepicker                                                          */
/* ------------------------------------------------------------------ */

const date = ref<Date | null>(new Date())
const rangedDate = ref<Date | null>(null)

/* ------------------------------------------------------------------ */
/* Choice controls                                                     */
/* ------------------------------------------------------------------ */

const checkboxValue = ref(true)
const checkboxList = ref<string[]>(['a'])
const radioValue = ref('one')
const radioGroupValue = ref('grid')
const radioGroupOptions = [
  { icon: 'material-symbols:grid-view-outline-rounded', text: 'Grid', value: 'grid' },
  { icon: 'material-symbols:view-list-outline-rounded', text: 'List', value: 'list' },
  { icon: 'material-symbols:calendar-month-outline-rounded', text: 'Calendar', value: 'calendar' },
]
const toggleValue = ref(true)

/* ------------------------------------------------------------------ */
/* Files                                                               */
/* ------------------------------------------------------------------ */

const singleFile = ref<MaybeFile | File | null>(null)
const multiFiles = ref<MaybeFile[] | File[]>([
  { name: 'quarterly-report.pdf', size: 2_411_724, type: 'application/pdf' },
])
const demoFile: MaybeFile = { name: 'nebula-spec.docx', size: 184_320, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }

/* ------------------------------------------------------------------ */
/* Rich text                                                           */
/* ------------------------------------------------------------------ */

const editorValue = ref('<h2>Nebula editor</h2><p>A <strong>tiptap</strong> based editor with the layer toolbar.</p><ul><li>Lists</li><li>Alignment</li><li>Highlights</li></ul>')

/* ------------------------------------------------------------------ */
/* Form composition                                                    */
/* ------------------------------------------------------------------ */

interface ContactRow { name: string, email: string }
const formList = ref<ContactRow[]>([{ name: 'Ada', email: 'ada@example.com' }])

const isFormValid = ref(false)
const validatedName = ref('')
const validatedEmail = ref('')
const validatedAge = ref<number | undefined>(undefined)

const errorListDemo: (keyof ValidityState)[] = ['valueMissing', 'typeMismatch', 'tooShort']

/* ------------------------------------------------------------------ */
/* Overlays                                                            */
/* ------------------------------------------------------------------ */

const modalOpen = ref(false)
const popUpOpen = ref(false)
const menus: Menu[] = [
  { text: 'Edit', icon: 'material-symbols:edit-outline-rounded', callback: () => useNebToast({ type: 'info', title: 'Edit clicked' }) },
  { text: 'Duplicate', icon: 'material-symbols:content-copy-outline-rounded', callback: () => useNebToast({ type: 'info', title: 'Duplicate clicked' }) },
  { text: 'Archive', icon: 'material-symbols:archive-outline-rounded', disabled: true, callback: () => {} },
  { text: 'Delete', icon: 'material-symbols:delete-outline-rounded', segment: true, desctructive: true, callback: () => useNebToast({ type: 'error', title: 'Delete clicked' }) },
]

/* ------------------------------------------------------------------ */
/* Feedback & states                                                   */
/* ------------------------------------------------------------------ */

const toastTypes = ['neutral', 'info', 'success', 'warning', 'error'] as const
function showToast(type: (typeof toastTypes)[number]) {
  useNebToast({
    type,
    title: `${type[0]!.toUpperCase()}${type.slice(1)} toast`,
    description: 'Toasts stack in the corner and pause on hover.',
    actions: [{ text: 'Undo', callback: () => useNebToast({ type: 'neutral', title: 'Undone' }) }],
  })
}

const confirmResult = ref<boolean | null>(null)
async function askConfirm() {
  confirmResult.value = await useNebConfirm({
    title: 'Delete this project?',
    description: 'This action cannot be undone. All of the related data will be permanently removed.',
  })
}

const contentStatus = ref<'idle' | 'pending' | 'success' | 'error'>('success')
const statuses = ['idle', 'pending', 'success', 'error'] as const

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

const crumbs = [
  { id: 'home', text: 'Home', icon: 'material-symbols:home-outline-rounded' },
  { id: 'projects', text: 'Projects', icon: 'material-symbols:folder-outline-rounded' },
  { id: 'nebula', text: 'Nebula', icon: 'material-symbols:widgets-outline-rounded' },
]

const navRoutes: Route[] = [
  { name: 'Dashboard', path: '/#foundations', icon: 'material-symbols:dashboard-outline-rounded' },
  {
    name: 'Library',
    path: '/#library',
    icon: 'material-symbols:widgets-outline-rounded',
    subRoutes: [
      { name: 'Buttons', path: '/#buttons', group: 'Forms', icon: 'material-symbols:smart-button' },
      { name: 'Inputs', path: '/#text-inputs', group: 'Forms', icon: 'material-symbols:input-rounded' },
      { name: 'Tables', path: '/#data', group: 'Data', icon: 'material-symbols:table-rows-outline' },
    ],
  },
  { name: 'Settings', path: '/#layout', icon: 'material-symbols:settings-outline-rounded' },
]

const tabs: Record<string, Tab | string> = {
  overview: { text: 'Overview', icon: 'material-symbols:dashboard-outline-rounded' },
  members: { text: 'Members', icon: 'material-symbols:group-outline-rounded', count: 12 },
  billing: { text: 'Billing', description: 'Plans and invoices', icon: 'material-symbols:credit-card-outline' },
  archived: { text: 'Archived', disabled: true },
}
const activeTab = ref('overview')
const verticalTab = ref('overview')

const stepperValue = ref(1)
const steps: Step[] = [
  { title: 'Account', text: 'Basic details' },
  { title: 'Workspace', text: 'Name and members' },
  { title: 'Billing', text: 'Skipped for now', unfinished: true },
  { title: 'Done', text: 'Start building' },
]

const paginatedSource = Array.from({ length: 84 }, (_, i) => ({ id: i + 1, label: `Item #${i + 1}` }))
const pagedItems = ref<{ id: number, label: string }[]>([])

/* ------------------------------------------------------------------ */
/* Data display                                                        */
/* ------------------------------------------------------------------ */

interface User { name: string, email: string, role: string, joinedAt: Date, score: number }
const users: User[] = [
  { name: 'Ada Lovelace', email: 'ada@example.com', role: 'Owner', joinedAt: new Date('2021-03-14'), score: 98 },
  { name: 'Alan Turing', email: 'alan@example.com', role: 'Admin', joinedAt: new Date('2022-06-01'), score: 91 },
  { name: 'Grace Hopper', email: 'grace@example.com', role: 'Admin', joinedAt: new Date('2020-11-23'), score: 95 },
  { name: 'Linus Torvalds', email: 'linus@example.com', role: 'Member', joinedAt: new Date('2023-01-09'), score: 74 },
  { name: 'Margaret Hamilton', email: 'margaret@example.com', role: 'Member', joinedAt: new Date('2019-08-30'), score: 88 },
  { name: 'Ken Thompson', email: 'ken@example.com', role: 'Viewer', joinedAt: new Date('2024-02-17'), score: 63 },
]
const userColumns: Columns<User> = {
  name: { text: 'Name' },
  email: { text: 'Email' },
  role: { text: 'Role', align: 'center' },
  joinedAt: { text: 'Joined' },
  score: { text: 'Score', align: 'right', formatFunction: value => `${value} pts` },
}
const selectedUsers = ref<User[] | null>([])
const tableStatus = ref<'idle' | 'pending' | 'success' | 'error'>('success')

interface FrameRow { file: string, size: string, state: string }
const frameColumns: Columns<FrameRow> = {
  file: { text: 'File' },
  size: { text: 'Size', align: 'right' },
  state: { text: 'State', align: 'center', notSortable: true },
}
const frameRows: FormattedRow<FrameRow>[] = [
  { formatted: { file: 'index.vue', size: '18 KB', state: 'ready' }, original: { file: 'index.vue', size: '18 KB', state: 'ready' } },
  { formatted: { file: 'tokens.css', size: '6 KB', state: 'ready' }, original: { file: 'tokens.css', size: '6 KB', state: 'ready' } },
  { formatted: { file: 'color.ts', size: '3 KB', state: 'stale' }, original: { file: 'color.ts', size: '3 KB', state: 'stale' } },
]

interface Task { id: number, title: string, project: string, createdAt: string }
const groupperItems: Task[] = [
  { id: 1, title: 'Ship the color module', project: 'Nebula', createdAt: '2026-08-30T09:15:00' },
  { id: 2, title: 'Write the table docs', project: 'Nebula', createdAt: '2026-08-30T14:40:00' },
  { id: 3, title: 'Review the select PR', project: 'Playground', createdAt: '2026-08-28T11:05:00' },
  { id: 4, title: 'Fix the dark mode scrim', project: 'Playground', createdAt: '2026-08-27T16:20:00' },
  { id: 5, title: 'Bump the Nuxt version', project: 'Infra', createdAt: '2026-08-27T08:00:00' },
]

/* ------------------------------------------------------------------ */
/* Layout patterns                                                     */
/* ------------------------------------------------------------------ */

const isExpanded = ref(true)
const isDirectiveExpanded = ref(false)

/* ------------------------------------------------------------------ */
/* Images                                                              */
/* ------------------------------------------------------------------ */

function placeholder(label: string, hue: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640">`
    + `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`
    + `<stop offset="0%" stop-color="hsl(${hue} 70% 62%)"/><stop offset="100%" stop-color="hsl(${hue + 40} 65% 42%)"/>`
    + `</linearGradient></defs>`
    + `<rect width="960" height="640" fill="url(#g)"/>`
    + `<text x="480" y="340" font-family="Inter, sans-serif" font-size="64" font-weight="700" fill="rgba(255,255,255,0.92)" text-anchor="middle">${label}</text>`
    + `</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const gallerySources = [
  placeholder('Nebula 1', 265),
  placeholder('Nebula 2', 190),
  placeholder('Nebula 3', 20),
]
const viewerOpen = ref(false)
const viewerIndex = ref(0)
function openViewer(index: number) {
  viewerIndex.value = index
  viewerOpen.value = true
}
</script>

<template>
  <div class="showcase">
    <header class="topbar">
      <div class="topbar-title">
        <h1>Nebula</h1>
        <neb-badge small color="primary">
          component showcase
        </neb-badge>
      </div>

      <div class="topbar-controls">
        <label class="color-control">
          <input v-model="primaryColor" type="color" aria-label="Primary color">
          <span>Primary</span>
        </label>

        <div class="preset-colors">
          <button
            v-for="color in presetColors"
            :key="color"
            type="button"
            class="preset-color"
            :class="{ active: color === primaryColor }"
            :style="{ background: color }"
            :aria-label="`Set primary color to ${color}`"
            @click="primaryColor = color"
          />
        </div>

        <div class="locale-select">
          <neb-select
            v-model="selectedLocale"
            no-search
            :options="['en', 'hu']"
            leading-icon="material-symbols:translate-rounded"
          />
        </div>

        <neb-button
          type="secondary-neutral"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="isDark = !isDark"
        >
          <icon :name="isDark ? 'material-symbols:light-mode-outline-rounded' : 'material-symbols:dark-mode-outline-rounded'" />
          <span>{{ isDark ? 'Light' : 'Dark' }}</span>
        </neb-button>
      </div>
    </header>

    <div class="body">
      <nav class="toc">
        <a v-for="section in sections" :key="section.id" :href="`#${section.id}`">
          {{ section.label }}
        </a>
      </nav>

      <main class="content">
        <!-- ============================ FOUNDATIONS ============================ -->
        <section id="foundations" class="section">
          <neb-content-header
            title="Foundations"
            description="Every color, type style, surface, spacing step and shadow the layer exposes. Change the primary color above to see the whole scale recompute at runtime."
            icon="material-symbols:palette-outline"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Color scales
            </p>
            <div class="scales">
              <div v-for="scale in colorScales" :key="scale" class="scale">
                <span class="scale-name">{{ scale }}</span>
                <div class="swatches">
                  <div
                    v-for="shade in shades"
                    :key="shade"
                    class="swatch"
                    :style="{ background: `var(--${scale}-color-${shade})`, color: swatchInk[`${scale}-${shade}`] }"
                    :title="`--${scale}-color-${shade}`"
                  >
                    {{ shade }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Contrast audit
              <span class="audit-summary" :class="{ fail: auditFailures > 0 }">
                {{ auditFailures > 0 ? `${auditFailures} failing` : 'all pass' }}
                · {{ isDark ? 'dark' : 'light' }}
              </span>
            </p>
            <p class="demo-note">
              WCAG ratios read back from the shipped custom properties for the current primary and theme.
            </p>
            <div class="audit-grid">
              <div v-for="row in auditRows" :key="row.label + row.token" class="audit-row" :class="{ fail: !row.ok }">
                <span class="audit-label">{{ row.label }}</span>
                <code class="audit-token">{{ row.token }}</code>
                <span class="audit-ratio">{{ row.ratio.toFixed(2) }}<span class="audit-floor">/ {{ row.floor.toFixed(1) }}</span></span>
                <span class="audit-badge">{{ row.ok ? '✓' : '✗' }}</span>
              </div>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Semantic backgrounds
            </p>
            <div class="row">
              <div
                v-for="bg in backgrounds"
                :key="bg"
                class="surface-chip"
                :style="{ background: bg === 'base' ? 'var(--neb-bg)' : `var(--neb-bg-${bg})` }"
              >
                {{ bg }}
              </div>
            </div>
            <div class="row">
              <div
                v-for="intent in intents"
                :key="intent"
                class="surface-chip"
                :style="{ background: `var(--neb-bg-${intent})`, color: `var(--neb-text-${intent})` }"
              >
                {{ intent }}
              </div>
              <div
                v-for="intent in intents"
                :key="`${intent}-solid`"
                class="surface-chip"
                :style="{ background: `var(--neb-bg-${intent}-solid)`, color: 'var(--neb-text-on-solid)' }"
              >
                {{ intent }} solid
              </div>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Type styles
            </p>
            <div class="type-list">
              <p
                v-for="style in textStyles"
                :key="style.name"
                :style="{ font: `var(--neb-font-${style.name})`, color: `var(--neb-${style.fg})` }"
              >
                {{ style.name }} — The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Spacing & radii
            </p>
            <div class="row bottom">
              <div v-for="space in spaces" :key="space" class="space-demo">
                <div :style="{ width: `var(--space-${space})`, height: `var(--space-${space})` }" />
                <span>{{ space }}</span>
              </div>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Shadows
            </p>
            <div class="row">
              <div v-for="shadow in shadows" :key="shadow" class="shadow-demo" :style="{ boxShadow: `var(--neb-shadow-${shadow})` }">
                {{ shadow }}
              </div>
            </div>
          </div>
        </section>

        <!-- ============================ BUTTONS ============================ -->
        <section id="buttons" class="section">
          <neb-content-header
            title="Buttons"
            description="neb-button, neb-button-group"
            icon="material-symbols:smart-button"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Hierarchy
            </p>
            <div class="row">
              <neb-button v-for="type in buttonTypes" :key="type" :type="type">
                {{ type }}
              </neb-button>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Destructive
            </p>
            <div class="row">
              <neb-button v-for="type in buttonTypes" :key="type" :type="type" destructive>
                {{ type }}
              </neb-button>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Disabled
            </p>
            <div class="row">
              <neb-button v-for="type in buttonTypes" :key="type" :type="type" disabled>
                {{ type }}
              </neb-button>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Loading
            </p>
            <div class="row">
              <neb-button v-for="type in ['primary', 'secondary', 'tertiary-neutral'] as ButtonType[]" :key="type" :type="type" loading>
                {{ type }}
              </neb-button>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Sizes & modifiers
            </p>
            <div class="row">
              <neb-button small>
                small
              </neb-button>
              <neb-button>
                normal
              </neb-button>
              <neb-button square>
                <icon name="material-symbols:add-rounded" />
              </neb-button>
              <neb-button small square type="secondary-neutral">
                <icon name="material-symbols:more-horiz" />
              </neb-button>
              <neb-button type="tertiary-neutral" adjective>
                adjective
              </neb-button>
              <neb-button type="secondary">
                <icon name="material-symbols:download-rounded" /> with icon
              </neb-button>
            </div>
            <div class="constrained">
              <neb-button full-width>
                full width
              </neb-button>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Button group
            </p>
            <div class="row">
              <neb-button-group>
                <neb-button>Day</neb-button>
                <neb-button>Week</neb-button>
                <neb-button>Month</neb-button>
              </neb-button-group>

              <neb-button-group type="secondary">
                <neb-button>
                  <icon name="material-symbols:format-align-left-rounded" />
                </neb-button>
                <neb-button>
                  <icon name="material-symbols:format-align-center-rounded" />
                </neb-button>
                <neb-button>
                  <icon name="material-symbols:format-align-right-rounded" />
                </neb-button>
              </neb-button-group>
            </div>
          </div>
        </section>

        <!-- ============================ BADGES ============================ -->
        <section id="badges" class="section">
          <neb-content-header
            title="Badges & tags"
            description="neb-badge, neb-tag"
            icon="material-symbols:label-outline-rounded"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Badges
            </p>
            <div class="row">
              <neb-badge>neutral</neb-badge>
              <neb-badge v-for="color in badgeColors" :key="color" :color="color">
                {{ color }}
              </neb-badge>
            </div>
            <div class="row">
              <neb-badge small>
                neutral
              </neb-badge>
              <neb-badge v-for="color in badgeColors" :key="color" small :color="color">
                {{ color }}
              </neb-badge>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Tags
            </p>
            <div class="row">
              <neb-tag v-for="tag in tags" :key="tag" @remove="tags = tags.filter(t => t !== tag)">
                {{ tag }}
              </neb-tag>
              <neb-tag small>
                small
              </neb-tag>
              <neb-button v-if="!tags.length" small type="tertiary" @click="tags = ['design', 'system', 'nebula']">
                reset tags
              </neb-button>
            </div>
          </div>
        </section>

        <!-- ============================ AVATARS ============================ -->
        <section id="avatars" class="section">
          <neb-content-header
            title="Avatars"
            description="neb-avatar, neb-avatar-list, neb-avatar-card"
            icon="material-symbols:account-circle-outline"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Variants & sizes
            </p>
            <div class="row">
              <neb-avatar />
              <neb-avatar text="AL" />
              <neb-avatar icon="material-symbols:rocket-launch-outline-rounded" />
              <neb-avatar :src="placeholder('A', 265)" alt="Placeholder avatar" />
              <neb-avatar size="24px" text="XS" />
              <neb-avatar size="32px" text="S" />
              <neb-avatar size="56px" text="L" />
              <neb-avatar size="72px" text="XL" />
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Avatar list (max 3 of 5)
            </p>
            <neb-avatar-list :max="3" size="40px">
              <neb-avatar text="AL" />
              <neb-avatar text="AT" />
              <neb-avatar text="GH" />
              <neb-avatar text="LT" />
              <neb-avatar text="MH" />
            </neb-avatar-list>
          </div>

          <div class="demo">
            <p class="demo-title">
              Avatar card
            </p>
            <div class="row">
              <neb-avatar-card
                :avatar="{ text: 'AL' }"
                title="Ada Lovelace"
                text="ada@example.com"
              />
              <neb-avatar-card
                :avatar="{ icon: 'material-symbols:groups-outline-rounded' }"
                title="Engineering"
                text="12 members"
              />
            </div>
          </div>
        </section>

        <!-- ============================ TEXT INPUTS ============================ -->
        <section id="text-inputs" class="section">
          <neb-content-header
            title="Text inputs"
            description="neb-input, neb-textarea, neb-search-input, neb-tag-input"
            icon="material-symbols:input-rounded"
            has-separator
          />

          <div class="demo grid-2">
            <neb-input v-model="inputValue" label="Label" hint="A hint line under the field" placeholder="Placeholder" />
            <neb-input v-model="inputValue" label="Required" required />
            <neb-input v-model="inputValue" label="Disabled" disabled />
            <neb-input v-model="inputValue" label="Leading icon" leading-icon="material-symbols:search-rounded" />
            <neb-input v-model="inputValue" label="Trailing icon" trailing-icon="material-symbols:mic-outline-rounded" />
            <neb-input v-model="emailValue" label="Email" type="email" required />
            <neb-input v-model="passwordValue" label="Password" type="password" minlength="8" />
            <neb-input v-model="numberValue" label="Number" type="number" :min="0" :max="100" />
            <neb-input v-model="lazyValue" lazy label="Lazy (emits on change)" hint="Blur or press enter to emit" />
            <neb-input v-model="inputValue" auto-height label="Auto height" />
          </div>

          <div class="demo grid-2">
            <neb-textarea v-model="textareaValue" label="Textarea" hint="Resizes vertically" />
            <neb-textarea v-model="textareaValue" label="Required textarea" required :min-height="140" />
          </div>

          <div class="demo grid-2">
            <neb-search-input v-model="searchTerm" />
            <neb-tag-input v-model="tagInputValue" label="Tag input" />
          </div>
        </section>

        <!-- ============================ SELECT ============================ -->
        <section id="select" class="section">
          <neb-content-header
            title="Select"
            description="neb-select — plain, object, multiple, tracked-key and creatable options"
            icon="material-symbols:arrow-drop-down-circle-outline"
            has-separator
          />

          <div class="demo grid-2">
            <neb-select v-model="simpleSelect" label="Plain options" hint="Searchable by default" :options="['hu', 'en', 'de', 'fr', 'es']" />
            <neb-select v-model="simpleSelect" label="Without search" no-search :options="['hu', 'en', 'de', 'fr', 'es']" />
            <neb-select
              v-model="objectSelect"
              label="Object options"
              track-by-key="id"
              label-key="name"
              :options="countries"
              leading-icon="material-symbols:public"
            />
            <neb-select
              v-model="multiSelect"
              multiple
              label="Multiple"
              track-by-key="id"
              label-key="name"
              :options="countries"
            />
            <neb-select
              v-model="trackedSelect"
              label="Only tracked key"
              use-only-tracked-key
              track-by-key="id"
              label-key="name"
              :options="countries"
            />
            <neb-select
              v-model="objectSelect"
              label="Custom label & slots"
              track-by-key="id"
              label-key="name"
              :options="countries"
              :custom-label="(option) => `${option.name} (${option.continent})`"
            >
              <template #option="{ option }">
                <div class="select-option">
                  <strong>{{ option.name }}</strong>
                  <neb-badge small>
                    {{ option.continent }}
                  </neb-badge>
                </div>
              </template>
            </neb-select>
            <neb-select
              v-model="creatableSelect"
              label="Creatable"
              hint="Type something that does not exist, then press enter"
              :options="creatableOptions"
              :on-new="handleNewOption"
              @new="handleNewOption"
            />
            <neb-select v-model="simpleSelect" label="Required" required :options="['hu', 'en']" />
            <neb-select v-model="simpleSelect" label="Disabled" disabled :options="['hu', 'en']" />
          </div>
        </section>

        <!-- ============================ DATEPICKER ============================ -->
        <section id="datepicker" class="section">
          <neb-content-header
            title="Datepicker"
            description="neb-datepicker — day / month / year views, optional range limits"
            icon="material-symbols:calendar-month-outline-rounded"
            has-separator
          />

          <div class="demo grid-2">
            <neb-datepicker v-model="date" label="Date" />
            <neb-datepicker v-model="rangedDate" label="Required, this month only" required :from="new Date(new Date().getFullYear(), new Date().getMonth(), 1)" :to="new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)" />
            <neb-datepicker v-model="date" label="Stays open on select" :close-on-select="false" />
            <neb-datepicker v-model="date" label="Disabled" disabled />
          </div>
        </section>

        <!-- ============================ CHOICE ============================ -->
        <section id="choice" class="section">
          <neb-content-header
            title="Choice controls"
            description="neb-checkbox, neb-radio-button, neb-radio-group, neb-toggle"
            icon="material-symbols:check-box-outline"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Checkbox
            </p>
            <div class="row">
              <neb-checkbox v-model="checkboxValue" label="Boolean checkbox" />
              <neb-checkbox v-model="checkboxList" value="a" label="Array: a" />
              <neb-checkbox v-model="checkboxList" value="b" label="Array: b" />
              <neb-checkbox v-model="checkboxValue" label="Custom icon" icon="material-symbols:star-rounded" />
              <neb-checkbox v-model="checkboxValue" label="Top aligned with a much longer label that wraps onto more lines" align="top" />
            </div>
            <p class="demo-note">
              selected: {{ checkboxList.join(', ') || '—' }}
            </p>
          </div>

          <div class="demo">
            <p class="demo-title">
              Radio button
            </p>
            <div class="row">
              <neb-radio-button v-model="radioValue" value="one" label="One" />
              <neb-radio-button v-model="radioValue" value="two" label="Two" />
              <neb-radio-button v-model="radioValue" value="three" label="Three" disabled />
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Radio group
            </p>
            <neb-radio-group v-model="radioGroupValue" :options="radioGroupOptions" />
            <p class="demo-note">
              value: {{ radioGroupValue }}
            </p>
          </div>

          <div class="demo">
            <p class="demo-title">
              Toggle
            </p>
            <div class="row">
              <neb-toggle v-model="toggleValue" size="small" label="Small" />
              <neb-toggle v-model="toggleValue" label="Normal" />
              <neb-toggle v-model="toggleValue" size="large" label="Large" />
            </div>
          </div>
        </section>

        <!-- ============================ FILES ============================ -->
        <section id="files" class="section">
          <neb-content-header
            title="Files"
            description="neb-single-file-picker, neb-multi-file-picker, neb-file-item"
            icon="material-symbols:attach-file-rounded"
            has-separator
          />

          <div class="demo grid-2">
            <neb-single-file-picker
              v-model="singleFile"
              label="Single file"
              hint="Max 2 MB"
              :max-size="2 * 1024 * 1024"
              accept="image/*"
            />
            <neb-single-file-picker v-model="singleFile" label="Required" required />
          </div>

          <div class="demo">
            <neb-multi-file-picker
              v-model="multiFiles"
              label="Multiple files"
              :accept="['image/png', 'image/jpeg', 'application/pdf']"
              :max-size="5 * 1024 * 1024"
              :max-count="5"
            />
          </div>

          <div class="demo">
            <p class="demo-title">
              File item
            </p>
            <div class="constrained">
              <neb-file-item
                :file="demoFile"
                @remove="useNebToast({ type: 'info', title: 'Remove clicked' })"
                @download="useNebToast({ type: 'info', title: 'Download clicked' })"
              />
            </div>
          </div>
        </section>

        <!-- ============================ EDITOR ============================ -->
        <section id="editor" class="section">
          <neb-content-header
            title="Rich text"
            description="neb-tiptap-editor"
            icon="material-symbols:edit-document-outline-rounded"
            has-separator
          />

          <div class="demo">
            <neb-tiptap-editor v-model="editorValue" label="Description" required />
          </div>
        </section>

        <!-- ============================ FORMS ============================ -->
        <section id="forms" class="section">
          <neb-content-header
            title="Form composition"
            description="neb-validator, neb-form-list, neb-input-controll-wrapper, neb-error-list"
            icon="material-symbols:list-alt-outline-rounded"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Validator
            </p>
            <neb-validator v-model="isFormValid">
              <div class="grid-2">
                <neb-input v-model="validatedName" label="Name" required minlength="3" />
                <neb-input v-model="validatedEmail" label="Email" type="email" required />
                <neb-input v-model="validatedAge" label="Age" type="number" :min="18" :max="120" required />
              </div>
            </neb-validator>
            <div class="row">
              <neb-badge :color="isFormValid ? 'success' : 'error'">
                {{ isFormValid ? 'form is valid' : 'form is invalid' }}
              </neb-badge>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Form list
            </p>
            <neb-form-list v-model="formList" label="Contacts" :factory="() => ({ name: '', email: '' })">
              <template #default="{ item }">
                <div class="grid-2">
                  <neb-input v-model="item.name" label="Name" />
                  <neb-input v-model="item.email" label="Email" type="email" />
                </div>
              </template>
            </neb-form-list>
          </div>

          <div class="demo">
            <p class="demo-title">
              Input control wrapper
            </p>
            <div class="constrained">
              <neb-input-controll-wrapper label="Notifications" required>
                <neb-toggle v-model="toggleValue" />
              </neb-input-controll-wrapper>
              <neb-input-controll-wrapper label="Vertical layout" vertical>
                <neb-radio-group v-model="radioGroupValue" :options="radioGroupOptions" />
              </neb-input-controll-wrapper>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Error list
            </p>
            <neb-error-list :errors="errorListDemo" />
          </div>
        </section>

        <!-- ============================ OVERLAYS ============================ -->
        <section id="overlays" class="section">
          <neb-content-header
            title="Overlays"
            description="neb-dropdown, neb-menu, neb-tooltip, neb-modal, neb-pop-up"
            icon="material-symbols:layers-outline-rounded"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Dropdown & menu
            </p>
            <div class="row">
              <neb-dropdown>
                <template #trigger="{ toggle, isOpen }">
                  <neb-button type="secondary-neutral" @click="toggle()">
                    Dropdown
                    <icon :name="isOpen ? 'material-symbols:expand-less-rounded' : 'material-symbols:expand-more-rounded'" />
                  </neb-button>
                </template>
                <template #content="{ placement }">
                  <div class="dropdown-content">
                    <p>Anything can live in a dropdown.</p>
                    <p class="demo-note">
                      placement: {{ placement }}
                    </p>
                  </div>
                </template>
              </neb-dropdown>

              <neb-menu :menus="menus">
                <template #trigger="{ toggle }">
                  <neb-button type="secondary-neutral" square @click="toggle()">
                    <icon name="material-symbols:more-vert" />
                  </neb-button>
                </template>
              </neb-menu>

              <neb-menu :menus="menus" small>
                <template #header>
                  <p class="menu-header">
                    Row actions
                  </p>
                </template>
                <template #trigger="{ toggle }">
                  <neb-button small type="tertiary-neutral" @click="toggle()">
                    Small menu with header
                  </neb-button>
                </template>
              </neb-menu>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Tooltip
            </p>
            <div class="row">
              <neb-tooltip title="Tooltip title" text="A longer description that explains what this control does." :timing="200">
                <neb-button type="secondary-neutral">
                  Hover me
                </neb-button>
              </neb-tooltip>

              <neb-tooltip title="Title only" :timing="200">
                <neb-avatar text="AL" />
              </neb-tooltip>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Modal & pop-up
            </p>
            <div class="row">
              <neb-button @click="modalOpen = true">
                Open modal
              </neb-button>
              <neb-button type="secondary-neutral" @click="popUpOpen = true">
                Open pop-up
              </neb-button>
            </div>
          </div>
        </section>

        <!-- ============================ FEEDBACK ============================ -->
        <section id="feedback" class="section">
          <neb-content-header
            title="Feedback & states"
            description="neb-toast, neb-confirm, neb-empty-state, neb-error-state, neb-loading-state, neb-success-state, neb-state-content"
            icon="material-symbols:notifications-outline-rounded"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Toasts
            </p>
            <div class="row">
              <neb-button v-for="type in toastTypes" :key="type" small type="secondary-neutral" @click="showToast(type)">
                {{ type }}
              </neb-button>
            </div>
            <div class="constrained toast-preview">
              <neb-toast type="success" title="Static toast" description="Rendered inline, outside of the toast stack." :progress="0.4" />
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Confirm
            </p>
            <div class="row">
              <neb-button destructive @click="askConfirm()">
                Delete project
              </neb-button>
              <neb-badge v-if="confirmResult !== null" :color="confirmResult ? 'success' : 'warning'">
                answered: {{ confirmResult }}
              </neb-badge>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              States
            </p>
            <div class="grid-2">
              <div class="state-box">
                <neb-empty-state title="No results" description="Try another keyword or clear the filters." />
              </div>
              <div class="state-box">
                <neb-error-state title="Something went wrong" description="We could not load this list." />
              </div>
              <div class="state-box">
                <neb-loading-state title="Loading" description="Fetching the latest data..." />
              </div>
              <div class="state-box">
                <neb-success-state title="All done" description="Your workspace is ready." />
              </div>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              State content
            </p>
            <div class="row">
              <neb-button
                v-for="status in statuses"
                :key="status"
                small
                :type="contentStatus === status ? 'primary' : 'secondary-neutral'"
                @click="contentStatus = status"
              >
                {{ status }}
              </neb-button>
            </div>
            <div class="state-box">
              <neb-state-content :status="contentStatus" :refresh="async () => { contentStatus = 'success' }">
                <p>The wrapped content renders once the status is <code>success</code>.</p>
              </neb-state-content>
            </div>
          </div>
        </section>

        <!-- ============================ NAVIGATION ============================ -->
        <section id="navigation" class="section">
          <neb-content-header
            title="Navigation"
            description="neb-header-nav, neb-breadcrumbs, neb-route-breadcrumbs, neb-tabs, neb-stepper, neb-pagination"
            icon="material-symbols:menu-rounded"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Header nav
            </p>
            <div class="framed">
              <neb-header-nav :from-router="false" :routes="navRoutes" @logout="useNebToast({ type: 'info', title: 'Logout clicked' })">
                <template #logo>
                  <div class="logo">
                    <icon name="material-symbols:blur-on" />
                    <strong>Nebula</strong>
                  </div>
                </template>
              </neb-header-nav>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Breadcrumbs
            </p>
            <neb-breadcrumbs :crumbs="['Home', 'Section', 'Page']" />
            <neb-breadcrumbs :crumbs="crumbs" separator="material-symbols:chevron-right-rounded" />
            <p class="demo-note">
              neb-route-breadcrumbs, generated from the current route's <code>nebula</code> page meta:
            </p>
            <neb-route-breadcrumbs with-icons />
          </div>

          <div class="demo">
            <p class="demo-title">
              Tabs
            </p>
            <neb-tabs v-model="activeTab" :tabs="tabs" />
            <neb-tabs v-model="activeTab" :tabs="tabs" hierarchy="tertiary" />
            <neb-tabs v-model="activeTab" :tabs="{ one: 'One', two: 'Two', three: 'Three' }" full-width />
            <div class="tabs-vertical">
              <neb-tabs v-model="verticalTab" vertical :tabs="tabs" />
              <p class="demo-note">
                active: {{ verticalTab }}
              </p>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Stepper
            </p>
            <neb-stepper v-model="stepperValue" :steps="steps" skippable />
            <div class="row">
              <neb-button small type="secondary-neutral" @click="stepperValue--">
                Back
              </neb-button>
              <neb-button small @click="stepperValue++">
                Next
              </neb-button>
            </div>
            <div class="stepper-vertical">
              <neb-stepper v-model="stepperValue" vertical skippable :steps="steps" />
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Pagination
            </p>
            <ul class="paged-list">
              <li v-for="item in pagedItems" :key="item.id">
                {{ item.label }}
              </li>
            </ul>
            <neb-pagination v-model="pagedItems" :data="paginatedSource" />
          </div>
        </section>

        <!-- ============================ DATA ============================ -->
        <section id="data" class="section">
          <neb-content-header
            title="Data display"
            description="neb-table, neb-table-frame, neb-groupper, neb-timeline"
            icon="material-symbols:table-rows-outline"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Table — search, sort, select, paginate
            </p>
            <div class="row">
              <neb-button
                v-for="status in statuses"
                :key="status"
                small
                :type="tableStatus === status ? 'primary' : 'secondary-neutral'"
                @click="tableStatus = status"
              >
                {{ status }}
              </neb-button>
            </div>
            <neb-table
              v-model="selectedUsers"
              :columns="userColumns"
              :rows="users"
              :status="tableStatus"
              :refresh="async () => { tableStatus = 'success' }"
              @click="useNebToast({ type: 'info', title: 'Row clicked', description: $event.name })"
            >
              <template #actions>
                <neb-button small>
                  <icon name="material-symbols:add-rounded" /> New user
                </neb-button>
              </template>

              <template #td-role="{ formatted }">
                <neb-badge small :color="formatted === 'Owner' ? 'primary' : formatted === 'Admin' ? 'info' : undefined">
                  {{ formatted }}
                </neb-badge>
              </template>

              <template #row-actions="{ data }">
                <neb-menu :menus="menus" small>
                  <template #trigger="{ toggle }">
                    <neb-button small square type="tertiary-neutral" :aria-label="`Actions for ${data.original.name}`" @click.stop="toggle()">
                      <icon name="material-symbols:more-vert" />
                    </neb-button>
                  </template>
                </neb-menu>
              </template>
            </neb-table>
            <p class="demo-note">
              selected: {{ selectedUsers?.length || 0 }} row(s)
            </p>
          </div>

          <div class="demo">
            <p class="demo-title">
              Table frame — the presentational half, driven by pre-formatted rows
            </p>
            <neb-table-frame :columns="frameColumns" :rows="frameRows">
              <template #td-state="{ formatted }">
                <neb-badge small :color="formatted === 'ready' ? 'success' : 'warning'">
                  {{ formatted }}
                </neb-badge>
              </template>
            </neb-table-frame>
          </div>

          <div class="demo">
            <p class="demo-title">
              Groupper — grouped by project
            </p>
            <neb-groupper
              :items="groupperItems"
              group-key="project"
              has-line
              :group-sort-fun="(a: any, b: any) => String(a.value.label).localeCompare(String(b.value.label))"
              :item-sort-process-fun="(item: any) => new Date(item.createdAt).getTime()"
            >
              <template #group="{ group }">
                <div class="group">
                  <p class="group-label">
                    {{ group.label }}
                  </p>
                  <div class="group-items">
                    <div v-for="item in group.items" :key="item.id" class="group-item">
                      {{ item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </neb-groupper>
          </div>

          <div class="demo">
            <p class="demo-title">
              Timeline — grouped by date
            </p>
            <neb-timeline :items="groupperItems" group-key="createdAt">
              <template #item="{ item }">
                <div class="group-item">
                  <strong>{{ item.title }}</strong>
                  <neb-badge small>
                    {{ item.project }}
                  </neb-badge>
                </div>
              </template>
            </neb-timeline>
          </div>
        </section>

        <!-- ============================ LAYOUT ============================ -->
        <section id="layout" class="section">
          <neb-content-header
            title="Layout patterns"
            description="neb-content-header, neb-content-separator, neb-expand, v-neb-expand, neb-compact"
            icon="material-symbols:dashboard-customize-outline-rounded"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Content header types
            </p>
            <div class="framed padded stacked">
              <neb-content-header title="Page title" description="type: page" type="page" icon="material-symbols:home-outline-rounded">
                <template #actions>
                  <neb-button small>
                    Action
                  </neb-button>
                </template>
              </neb-content-header>
              <neb-content-header title="Section title" description="type: section" type="section" has-separator />
              <neb-content-header title="Subtitle" description="type: subtitle" type="subtitle" />
              <neb-content-header title="Paragraph title" description="type: paragraph" type="paragraph" />
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Content separator
            </p>
            <neb-content-separator />
            <neb-content-separator text="or" />
            <neb-content-separator>
              <neb-badge small color="primary">
                custom slot
              </neb-badge>
            </neb-content-separator>
          </div>

          <div class="demo">
            <p class="demo-title">
              Expand — component & directive
            </p>
            <div class="row">
              <neb-button small type="secondary-neutral" @click="isExpanded = !isExpanded">
                Toggle neb-expand
              </neb-button>
              <neb-button small type="secondary-neutral" @click="isDirectiveExpanded = !isDirectiveExpanded">
                Toggle v-neb-expand
              </neb-button>
            </div>
            <neb-expand :when="isExpanded">
              <div class="framed padded">
                <p>This block is wrapped in <code>&lt;neb-expand&gt;</code>, which animates a grid-row transition.</p>
              </div>
            </neb-expand>
            <div v-neb-expand="isDirectiveExpanded">
              <div class="framed padded">
                <p>This block uses the <code>v-neb-expand</code> directive, which animates its own height.</p>
              </div>
            </div>
          </div>

          <div class="demo">
            <p class="demo-title">
              Compact — drag the resize handle to collapse the row
            </p>
            <div class="resizable">
              <neb-compact>
                <template #normal-mode="{ setNormalModeRef }">
                  <div :ref="setNormalModeRef" class="compact-row">
                    <neb-button small type="secondary-neutral">
                      Overview
                    </neb-button>
                    <neb-button small type="secondary-neutral">
                      Members
                    </neb-button>
                    <neb-button small type="secondary-neutral">
                      Billing
                    </neb-button>
                    <neb-button small type="secondary-neutral">
                      Integrations
                    </neb-button>
                  </div>
                </template>
                <template #compact-mode>
                  <neb-select v-model="simpleSelect" no-search :options="['hu', 'en']" />
                </template>
              </neb-compact>
            </div>
          </div>
        </section>

        <!-- ============================ IMAGES ============================ -->
        <section id="images" class="section">
          <neb-content-header
            title="Images"
            description="neb-gallery-card, neb-image-viewer"
            icon="material-symbols:image-outline-rounded"
            has-separator
          />

          <div class="demo">
            <p class="demo-title">
              Gallery card — auto-advances, click to open the viewer
            </p>
            <div class="gallery">
              <neb-gallery-card :sources="gallerySources" @click="openViewer($event)" />
              <neb-gallery-card :sources="[gallerySources[0]!]" @click="openViewer(0)" />
            </div>
          </div>

          <div class="demo">
            <div class="row">
              <neb-button type="secondary-neutral" @click="openViewer(0)">
                Open image viewer
              </neb-button>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- ============================ TELEPORTED OVERLAYS ============================ -->
    <neb-modal
      v-model="modalOpen"
      title="Invite a teammate"
      subtitle="They will receive an email with a join link."
      header-icon="material-symbols:person-add-outline-rounded"
      :closed-value="false"
      centered
    >
      <template #content>
        <div class="modal-body">
          <neb-input v-model="emailValue" label="Email" type="email" required />
          <neb-select v-model="simpleSelect" label="Role" no-search :options="['Owner', 'Admin', 'Member', 'Viewer']" />
        </div>
      </template>
      <template #actions>
        <neb-button type="secondary-neutral" small @click="modalOpen = false">
          Cancel
        </neb-button>
        <neb-button small @click="modalOpen = false">
          Send invite
        </neb-button>
      </template>
    </neb-modal>

    <neb-pop-up v-model="popUpOpen" center-content>
      <div class="popup-card">
        <neb-success-state title="Pop-up" description="neb-pop-up is the bare scrim + teleport that neb-modal builds on." />
        <neb-button small @click="popUpOpen = false">
          Close
        </neb-button>
      </div>
    </neb-pop-up>

    <neb-image-viewer
      v-model="viewerOpen"
      :sources="gallerySources"
      :initial-index="viewerIndex"
      title="Nebula placeholders"
    />
  </div>
</template>

<style scoped>
.showcase {
  min-height: 100vh;
  background: var(--neb-bg-page);
  color: var(--neb-text);
}

/* ---------------------------------- topbar --------------------------------- */
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-8);
  background: var(--neb-bg);
  border-bottom: 1px solid var(--neb-border);
  box-shadow: var(--neb-shadow-sm);
}
.topbar-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);

  & h1 {
    font: var(--neb-font-title);
    color: var(--neb-text);
  }
}
.topbar-controls {
  display: flex;
  margin-left: auto;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}
.color-control {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font: var(--neb-font-label);
  color: var(--neb-text);

  & input {
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--neb-border);
    border-radius: var(--radius-default);
    background: none;
    cursor: pointer;
  }
}
.preset-colors {
  display: flex;
  gap: var(--space-1);
}
.preset-color {
  width: 20px;
  height: 20px;
  border: 1px solid var(--neb-border);
  border-radius: var(--radius-full, 999px);
  cursor: pointer;

  &.active {
    outline: 2px solid var(--neb-border-focus);
    outline-offset: 2px;
  }
}
.locale-select {
  width: 132px;
}

/* ----------------------------------- body ---------------------------------- */
.body {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: var(--space-8);
  padding: var(--space-8);
  align-items: start;

  @media (--tablet-viewport) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.toc {
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3);
  border: 1px solid var(--neb-border-subtle);
  border-radius: var(--radius-lg, 12px);
  background: var(--neb-bg);

  & a {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-default);
    font: var(--neb-font-label);
    color: var(--neb-text-subtle);
    text-decoration: none;

    &:hover {
      background: var(--neb-bg-hover);
      color: var(--neb-text);
    }
  }

  @media (--tablet-viewport) {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
.content {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  min-width: 0;
}

/* --------------------------------- sections -------------------------------- */
.section {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  scroll-margin-top: 96px;
}
.demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  border: 1px solid var(--neb-border-subtle);
  border-radius: var(--radius-lg, 12px);
  background: var(--neb-bg);
}
.demo-title {
  font: var(--neb-font-hint);
  color: var(--neb-text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.demo-note {
  font: var(--neb-font-caption);
  color: var(--neb-text-subtle);

  & code {
    font-family: monospace;
  }
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);

  &.bottom {
    align-items: flex-end;
  }
}
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-4);
}
.constrained {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 480px;
}
.framed {
  border: 1px solid var(--neb-border-subtle);
  border-radius: var(--radius-default);
  overflow: hidden;

  &.padded {
    padding: var(--space-4);
  }
  &.stacked {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    padding: var(--space-6);
  }
}

/* ------------------------------- foundations ------------------------------- */
.scales {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.scale {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.scale-name {
  width: 72px;
  font: var(--neb-font-label);
  color: var(--neb-text);
}
.swatches {
  display: flex;
  flex: 1;
  gap: 2px;
}
.swatch {
  flex: 1;
  height: 32px;
  border-radius: var(--radius-sm, 4px);
  display: grid;
  place-items: center;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.audit-summary {
  margin-left: var(--space-2);
  padding: 2px 8px;
  border-radius: var(--radius-small);
  font: var(--neb-font-caption);
  background: var(--neb-bg-success-subtle);
  color: var(--neb-text-success);
}
.audit-summary.fail {
  background: var(--neb-bg-error-subtle);
  color: var(--neb-text-error);
}
.audit-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: var(--space-3);
}
.audit-row {
  display: grid;
  grid-template-columns: 1fr auto 88px 20px;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-small);
  background: var(--neb-bg-subtle);
  font: var(--neb-font-body-sm);
}
.audit-row.fail {
  background: var(--neb-bg-error-subtle);
  color: var(--neb-text-error);
}
.audit-token {
  font-family: ui-monospace, monospace;
  font-size: var(--text-xs);
  color: var(--neb-text-subtle);
}
.audit-row.fail .audit-token {
  color: var(--neb-text-error);
}
.audit-ratio {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.audit-floor {
  margin-left: 4px;
  color: var(--neb-text-subtle);
}
.audit-badge {
  text-align: center;
  color: var(--neb-text-success);
}
.audit-row.fail .audit-badge {
  color: var(--neb-text-error);
}
.surface-chip {
  display: grid;
  place-items: center;
  min-width: 96px;
  height: 56px;
  padding: 0 var(--space-3);
  border: 1px solid var(--neb-border-subtle);
  border-radius: var(--radius-default);
  font: var(--neb-font-caption);
  color: var(--neb-text-subtle);
}
.type-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.space-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  font: var(--neb-font-caption);
  color: var(--neb-text-subtle);

  & div {
    background: var(--neb-bg-primary-solid);
    border-radius: var(--radius-sm, 4px);
  }
}
.shadow-demo {
  display: grid;
  place-items: center;
  width: 88px;
  height: 56px;
  border-radius: var(--radius-default);
  background: var(--neb-bg-raised);
  font: var(--neb-font-caption);
  color: var(--neb-text-subtle);
}

/* ---------------------------------- pieces --------------------------------- */
.select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
}
.dropdown-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  min-width: 240px;
  border: 1px solid var(--neb-border-subtle);
  border-radius: var(--radius-default);
  background: var(--neb-bg-raised);
  box-shadow: var(--neb-shadow-lg);
}
.menu-header {
  padding: var(--space-2) var(--space-3);
  font: var(--neb-font-hint);
  color: var(--neb-text-subtle);
}
.toast-preview {
  max-width: 420px;
}
.state-box {
  display: grid;
  place-items: center;
  min-height: 180px;
  padding: var(--space-4);
  border: 1px dashed var(--neb-border);
  border-radius: var(--radius-default);
}
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--neb-text-primary);
}
.tabs-vertical {
  display: flex;
  align-items: flex-start;
  gap: var(--space-6);
}
.stepper-vertical {
  max-width: 320px;
}
.paged-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-2);
  list-style: none;

  & li {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-default);
    background: var(--neb-bg-subtle);
    font: var(--neb-font-body-sm);
    color: var(--neb-text-subtle);
  }
}
.group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.group-label {
  font: var(--neb-font-label-strong);
  color: var(--neb-text);
}
.group-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.group-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--neb-border-subtle);
  border-radius: var(--radius-default);
  background: var(--neb-bg-subtle);
  font: var(--neb-font-body-sm);
  color: var(--neb-text-subtle);
}
.resizable {
  overflow: auto;
  resize: horizontal;
  width: 100%;
  min-width: 160px;
  max-width: 100%;
  padding: var(--space-3);
  border: 1px dashed var(--neb-border);
  border-radius: var(--radius-default);
}
.compact-row {
  display: flex;
  gap: var(--space-2);
  overflow: hidden;
}
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.popup-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8);
  border-radius: var(--radius-lg, 12px);
  background: var(--neb-bg-raised);
  box-shadow: var(--neb-shadow-2xl);
}
</style>
