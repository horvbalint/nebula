# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Nebula is a **Nuxt 4 layer** (a publishable UI/design-system library), not an app. The repository root *is* the layer: `package.json` has `"main": "./nuxt.config.ts"`, and consumer apps use it via `defineNuxtConfig({ extends: 'nebula' })`. `.playground/` is a throwaway Nuxt app that does `extends: '..'` and is the only way to run/see anything during development.

Because the layer is consumed from another app's context, library deps live in `dependencies` (only `nuxt` is a devDependency), and paths inside the layer must go through the `@nebula` alias (defined in [nuxt.config.ts](nuxt.config.ts)) rather than relative-to-app paths.

## Commands

```bash
pnpm install          # pnpm only (.npmrc uses shamefully-hoist)
pnpm dev              # boots .playground on :3000 — the dev loop
pnpm dev:prepare      # nuxt prepare .playground (regenerate types after config/module changes)
pnpm build            # builds .playground
pnpm lint             # eslint . (@antfu flat config; add --fix to autofix)
```

There is no test suite and no test runner configured. `vue-tsc` is installed but `typescript.typeCheck` is commented out in `nuxt.config.ts`; type errors surface in the editor only.

Editing anything under `.playground/pages/index.vue` is the normal way to try a component out — that file is a scratch showcase, not a spec.

## Architecture

### Color system (build-time Nuxt module)

[modules/color.ts](modules/color.ts) is a Nuxt module (`meta.name: 'nebula'`) that reads the top-level `nebula` key of the consuming `nuxt.config.ts` (`primaryColor`, `secondaryColor`, `successColor`, `errorColor`, `warningColor`, `infoColor`) and, via [composables/neb-color.ts](composables/neb-color.ts), generates two stylesheets into `modules/runtime/stylesheets/` at setup and deletes them on `close`. **Those files are generated and gitignored — never edit or commit them.**

Each source color produces a full shade scale plus an rgb-triple variant:
- `--primary-color`, `--primary-color-50` … `--primary-color-950` — the raw scale. Component styles consume the [semantic tokens](assets/semantic.css) built on top of these, not the scale directly.
- `--primary-color-component-*` — comma-separated rgb triples, only for `rgba(var(--x-component-900), 0.05)`.
- A `neutral-color` scale is derived from the primary color (desaturated), not configured directly.

`setNebColorPalette()` recomputes and writes the same variables onto `document.documentElement` at runtime for live theming.

### Styling conventions

- All spacing, font sizes, radii, and transition durations come from [assets/tokens.css](assets/tokens.css) (`--space-4`, `--text-sm`, `--radius-default`, `--duration-default`, …). Hardcoded px values in component styles are the exception, not the norm.
- **Colors, backgrounds, borders, fonts, shadows and focus rings come from the semantic tokens in [assets/semantic.css](assets/semantic.css)** — `--neb-bg-*`, `--neb-text-*`, `--neb-border-*`, `--neb-font-*`, `--neb-shadow-*`, `--neb-ring-*` (prefix = the property it goes in; bare = neutral, an intent segment adds a hue). See [docs/semantic-tokens.md](docs/semantic-tokens.md).
- Media queries use custom media from [assets/viewports.css](assets/viewports.css), injected globally by `postcss-global-data`: write `@media (--tablet-viewport)`. `postcss-preset-env` also enables native CSS nesting, which every component style uses.
- **Dark mode is not a runtime toggle inside the layer.** Every semantic token re-resolves under `.dark-mode` (which the host app puts on an ancestor), so a component built only on semantic tokens needs **no `.dark-mode` block of its own** — and none in `components/` has one. A component still reaching for a raw color scale is the thing that would need a dark-mode block; prefer adding a semantic token instead.

### Components

Auto-imported from `@nebula/components` with `pathPrefix: false`, so the directory nesting is organizational only and the filename is the component name. Every component is `neb-*` and the file is kebab-case matching it.

SFC shape used throughout: `<script lang="ts" setup>` → `<template>` → `<style scoped>`; `withDefaults(defineProps<{…}>(), {…})`, typed `defineEmits<{…}>()`, `defineModel` for multi-model components, `defineExpose` for imperative handles (e.g. `neb-input` exposes `focus`/`blur`/`input`).

Notable structures:
- **Overlays**: [neb-dropdown.vue](components/overlays/neb-dropdown.vue) wraps `@floating-ui/vue` (`useFloating` + `offset/flip/shift`, `autoUpdate`) and is the base pattern reused by `neb-menu`, `neb-tooltip`, `neb-select`. `neb-pop-up`/`neb-modal` teleport to body and lock `document.body.overflow`.
- **Table**: [neb-table-frame.vue](components/table/neb-table-frame.vue) is the presentational, generic (`generic="T extends Record<string, any>"`) piece that exports the `Column`/`Columns`/`FormattedRow`/`Slots` types driving per-column typed `th-*`/`td-*` slots. [neb-table.vue](components/table/neb-table.vue) wraps it with Fuse.js search, dayjs cell formatting, sorting and localStorage persistence.
- **States**: [neb-state-content.vue](components/patterns/states/neb-state-content.vue) switches on a Nuxt `AsyncDataRequestStatus` to render loading/error/default; `nebCombineStatuses()` in [composables/utils.ts](composables/utils.ts) merges several `useAsyncData` statuses into one.

### Validation

Native-constraint based, no schema library. Inputs call `useNebValidateNative(inputRef)` (or `useNebValidate` with a custom collector) from [composables/neb-validate.ts](composables/neb-validate.ts), which reads the DOM `ValidityState` and returns `errorsToShow` plus a `collectErrors()` trigger. A wrapping `<neb-validator v-model="isValid">` provides callbacks through injection keys, tracks per-element errors in a `Map`, and emits aggregate validity. `<neb-error-list>` renders `ValidityKey`s through i18n keys under `nebula.error-list.*`.

### Global overlays state

`useNebToast()` / `useNebConfirm()` push into `useState`-backed stores ([neb-toast.ts](composables/neb-toast.ts), [neb-confirm.ts](composables/neb-confirm.ts)). They only render if `<neb-toasts />` and `<neb-confirm />` are mounted — [layouts/default.vue](layouts/default.vue) does that, so apps not using the layout must mount them themselves.

### Runtime configuration

[app.config.ts](app.config.ts) holds the app-overridable knobs under `nebula` (`nebCompact.debounce`, `nebSelect.emptyValue`, `nebSaveRestore.storage`, `homePath`) plus `icon` defaults; read them with `useAppConfig().nebula`. Build-time-only options (colors) go through `nuxt.config.ts` instead.

### Navigation metadata

[global.d.ts](global.d.ts) augments `RouteMeta`/`PageMeta` with a `nebula` key (`name`, `icon`, `group`, `skipFromMenu`). [composables/routes.ts](composables/routes.ts) turns the router's routes into the tree consumed by `neb-header-nav`, so a consuming app configures its menu purely via `definePageMeta({ nebula: { … } })`.

### i18n

`@nuxtjs/i18n` with `strategy: 'no_prefix'` and two locales, `en` and `hu`. Every layer string lives under `nebula.*` (or `tiptap.*`) in [i18n/locales/en.json](i18n/locales/en.json) and [hu.json](i18n/locales/hu.json) — **add new keys to both files**; a key present in only one is a silent fallback at runtime.

### Directives and icons

Plugins register global directives: `v-neb-expand` (height-animated collapse with SSR props, [plugins/neb-expand.ts](plugins/neb-expand.ts)), `v-neb-focus`, and `v-on-click-outside` (re-export of VueUse's). Icons come from `@nuxt/icon`: `material-symbols:*` is bundled, and local SVGs in `assets/icons/nebula/` are exposed as the `nebula:` collection.

## Gotchas

- New dependencies used by the layer often need adding to `vite.optimizeDeps.include` in `nuxt.config.ts` (dayjs plugins, `fuse.js`, `@floating-ui/vue` are already listed) — otherwise the consuming app hits pre-bundling issues because the dep resolves out of the layer's own `node_modules`.
- Imports inside the layer that need an absolute path use `@nebula/...`; deep relative imports (`../../composables/...`) also appear but the alias is preferred.
- ESLint (`@antfu/eslint-config` with `formatters.css`) is the formatter for TS, Vue *and* CSS — no Prettier. VS Code is configured to fix on save; otherwise run `pnpm lint --fix` before committing.
