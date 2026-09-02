# Nuxt Layer Starter

Create Nuxt extendable layer with this GitHub template.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Working on your theme

Your theme is at the root of this repository, it is exactly like a regular Nuxt project, except you can publish it on NPM.

The `.playground` directory should help you on trying your theme during development.

Running `pnpm dev` will prepare and boot `.playground` directory, which imports your theme itself.

## Distributing your theme

Your Nuxt layer is shaped exactly the same as any other Nuxt project, except you can publish it on NPM.

To do so, you only have to check if `files` in `package.json` are valid, then run:

```bash
npm publish --access public
```

Once done, your users will only have to run:

```bash
npm install --save your-theme
```

Then add the dependency to their `extends` in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: 'your-theme'
})
```

## Design tokens

Component styling is driven by a three-layer token system (primitives → generated
color scales → semantic tokens). Components consume only the **semantic** layer,
which is what makes dark mode a zero-per-component concern.

The semantic tokens are named so the prefix tells you which CSS property they go
in — `--neb-bg-*` for `background`, `--neb-text-*` for `color`, `--neb-border-*`,
`--neb-font-*`, `--neb-shadow-*`, `--neb-ring-*` — with a bare token for the
neutral default and an intent segment (`-primary`, `-error`, …) for a hue.

See [docs/semantic-tokens.md](docs/semantic-tokens.md) for the full explanation of
how the tokens in [`assets/semantic.css`](assets/semantic.css) are grouped, why,
and how to use them.

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Or statically generate it with:

```bash
pnpm generate
```

Locally preview production build:

```bash
pnpm preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/docs/deployment) for more information.
