import fs from 'node:fs'
import { createResolver, defineNuxtModule } from '@nuxt/kit'
import Color from 'color'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule({
  meta: {
    name: 'nebula',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    primaryColor: '#9E77ED',
    secondaryColor: '#9E77ED',
    neutralColor: '#667085',
    successColor: '#17B26A',
    errorColor: '#F04438',
    warningColor: '#F79009',
    infoColor: '#667085',
    colorResolution: 50,
    scss: false,
  },
  async setup({ colorResolution, scss, ...options }, nuxt) {
    const cssFileLines = []

    if (!scss)
      cssFileLines.push(':root {')

    createColorShades(cssFileLines, 'primary-color', options.primaryColor, colorResolution, scss)
    createColorShades(cssFileLines, 'secondary-color', options.secondaryColor, colorResolution, scss)
    createColorShades(cssFileLines, 'neutral-color', options.neutralColor, colorResolution, scss)
    createColorShades(cssFileLines, 'success-color', options.successColor, colorResolution, scss)
    createColorShades(cssFileLines, 'error-color', options.errorColor, colorResolution, scss)
    createColorShades(cssFileLines, 'warning-color', options.warningColor, colorResolution, scss)
    createColorShades(cssFileLines, 'info-color', options.infoColor, colorResolution, scss)

    if (!scss)
      cssFileLines.push('}')

    const runtimeDirPath = resolve('./runtime')
    if (!fs.existsSync(runtimeDirPath))
      await fs.promises.mkdir(runtimeDirPath)

    const stylesheetExtension = scss ? 'scss' : 'css'
    const stylesheetPath = resolve(`./runtime/colors.${stylesheetExtension}`)
    await fs.promises.writeFile(stylesheetPath, cssFileLines.join('\n'))

    if (!scss)
      nuxt.options.css.push(resolve(stylesheetPath))

    nuxt.hook('close', async () => await fs.promises.unlink(stylesheetPath))
  },
})

function createColorShades(cssFileLines: string[], name: string, color: string, resolution: number, sccs: boolean) {
  const baseColor = new Color(color)
  const black = new Color('black')
  const white = new Color('white')

  const formatLine = sccs ? formatToScss : formatToCss

  cssFileLines.push(formatLine(name, baseColor))

  for (let lightness = resolution; lightness < 500; lightness += resolution) {
    const fullName = `${name}-${lightness}`
    const value = white.mix(baseColor, lightness / 500)
    cssFileLines.push(formatLine(fullName, value))
  }

  cssFileLines.push(formatLine(`${name}-500`, baseColor))

  for (let darkness = resolution; darkness < 500; darkness += resolution) {
    const fullName = `${name}-${500 + darkness}`
    const value = baseColor.mix(black, darkness / 500)
    cssFileLines.push(formatLine(fullName, value))
  }
}

function formatToScss(name: string, color: Color) {
  return `$${name}: ${color};`
}

function formatToCss(name: string, color: Color) {
  return `--${name}: ${color};`
}
