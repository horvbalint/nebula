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
    scss: false,
  },
  async setup({ scss, ...options }, nuxt) {
    const cssFileLines = []

    if (!scss)
      cssFileLines.push(':root {')

    createColorShades(cssFileLines, 'primary-color', options.primaryColor, scss)
    createColorShades(cssFileLines, 'secondary-color', options.secondaryColor, scss)
    createColorShades(cssFileLines, 'neutral-color', options.neutralColor, scss)
    createColorShades(cssFileLines, 'success-color', options.successColor, scss)
    createColorShades(cssFileLines, 'error-color', options.errorColor, scss)
    createColorShades(cssFileLines, 'warning-color', options.warningColor, scss)
    createColorShades(cssFileLines, 'info-color', options.infoColor, scss)

    if (!scss)
      cssFileLines.push('}')

    const stylesheetsDirPath = resolve('./stylesheets')
    if (!fs.existsSync(stylesheetsDirPath))
      await fs.promises.mkdir(stylesheetsDirPath)

    const stylesheetExtension = scss ? 'scss' : 'css'
    const stylesheetPath = resolve(`./stylesheets/colors.${stylesheetExtension}`)
    await fs.promises.writeFile(stylesheetPath, cssFileLines.join('\n'))

    if (!scss)
      nuxt.options.css.push(resolve(stylesheetPath))

    nuxt.hook('close', async () => await fs.promises.unlink(stylesheetPath))
  },
})

function createColorShades(cssFileLines: string[], name: string, color: string, sccs: boolean) {
  const baseColor = new Color(color)
  const saturationDistToFull = (100 - baseColor.saturationv()) / baseColor.saturationv()
  const lightnessDistToFull = (100 - baseColor.lightness()) / baseColor.lightness()

  const formatLine = sccs ? formatToScss : formatToCss

  cssFileLines.push(formatLine(name, baseColor))

  for (const shade of [25, 50, 100, 200, 300, 400]) {
    const fullName = `${name}-${shade}`
    const perecent = (500 - shade) / 500
    const value = baseColor
      .lighten(perecent * lightnessDistToFull)
      .saturate(perecent * saturationDistToFull)

    cssFileLines.push(formatLine(fullName, value))
  }

  for (const shade of [500, 600, 700, 800, 900, 950]) {
    const fullName = `${name}-${shade}`
    const percent = (shade - 500) / 500
    const value = baseColor
      .darken(percent * 0.8)
      .saturate(-percent * 0.8)

    cssFileLines.push(formatLine(fullName, value))
  }
}

function formatToScss(name: string, color: Color) {
  return `$${name}: ${color.hex()};`
}

function formatToCss(name: string, color: Color) {
  return `--${name}: ${color.hex()};`
}
