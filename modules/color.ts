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
    whiteColor: '#FFFFFF',
    primaryColor: '#9E77ED',
    secondaryColor: '#9E77ED',
    neutralColor: '#667085',
    successColor: '#17B26A',
    errorColor: '#F04438',
    warningColor: '#F79009',
    infoColor: '#667085',
  },
  async setup(options, nuxt) {
    const colorsFileLines = []
    const colorComponentsFileLines = []

    colorsFileLines.push(':root {')
    colorComponentsFileLines.push(':root {')

    createNeutralShades(colorsFileLines, colorComponentsFileLines, 'white-color', options.whiteColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'primary-color', options.primaryColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'secondary-color', options.secondaryColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'success-color', options.successColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'error-color', options.errorColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'warning-color', options.warningColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'info-color', options.infoColor)
    createNeutralShades(colorsFileLines, colorComponentsFileLines, 'neutral-color', options.neutralColor)

    colorsFileLines.push('}')
    colorComponentsFileLines.push('}')

    const stylesheetsDirPath = resolve('./stylesheets')
    if (!fs.existsSync(stylesheetsDirPath))
      await fs.promises.mkdir(stylesheetsDirPath)

    const colorsPath = resolve('./stylesheets/colors.css')
    const colorComponentsPath = resolve('./stylesheets/colorComponents.css')

    await fs.promises.writeFile(colorsPath, colorsFileLines.join('\n'))
    await fs.promises.writeFile(colorComponentsPath, colorComponentsFileLines.join('\n'))

    nuxt.options.css.push(resolve(colorsPath))
    nuxt.options.css.push(resolve(colorComponentsPath))

    nuxt.hook('close', async () => {
      const unlinks = []

      if (fs.existsSync(colorsPath))
        unlinks.push(fs.promises.unlink(colorsPath))

      if (fs.existsSync(colorComponentsPath))
        unlinks.push(fs.promises.unlink(colorComponentsPath))

      await Promise.all(unlinks)
    })
  },
})

function createColorShades(colorsFileLines: string[], colorComponentsFileLines: string[], name: string, color: string) {
  const MIN_LIGHTNESS = 20
  const MAX_LIGHTNESS = 98

  const MIN_SATURATION = 20
  const MAX_SATURATION = 98

  const baseColor = new Color(color)

  const lightnessDistToMin = Math.max(baseColor.lightness() - MIN_LIGHTNESS, 0)
  const lightnessDistToMax = Math.max(MAX_LIGHTNESS - baseColor.lightness(), 0)

  const saturationDistToMin = baseColor.saturationl() - MIN_SATURATION
  const saturationDistToMax = MAX_SATURATION - baseColor.saturationl()

  colorsFileLines.push(formatColorToCss(name, baseColor))
  colorComponentsFileLines.push(formatColorComponentToCss(`${name}-component`, baseColor))

  for (const shade of [25, 50, 100, 200, 300, 400]) {
    const percent = 1 - (shade / 500)
    const shifted = 1 - ((1 - percent) ** 2)

    const color = new Color ({
      h: baseColor.hue(),
      s: baseColor.saturationl() + shifted * saturationDistToMax,
      l: baseColor.lightness() + shifted * lightnessDistToMax,
    })

    colorsFileLines.push(formatColorToCss(`${name}-${shade}`, color))
    colorComponentsFileLines.push(formatColorComponentToCss(`${name}-component-${shade}`, color))
  }

  for (const shade of [500, 600, 700, 800, 900, 950, 975]) {
    const percent = (shade - 500) / 500

    const color = new Color ({
      h: baseColor.hue(),
      s: baseColor.saturationl() - percent * saturationDistToMin,
      l: baseColor.lightness() - percent * lightnessDistToMin,
    })

    colorsFileLines.push(formatColorToCss(`${name}-${shade}`, color))
    colorComponentsFileLines.push(formatColorComponentToCss(`${name}-component-${shade}`, color))
  }
}

function createNeutralShades(colorsFileLines: string[], colorComponentsFileLines: string[], name: string, color: string) {
  const MIN_LIGHTNESS = 10
  const MAX_LIGHTNESS = 98

  const baseColor = new Color(color)

  const lightnessDistToMin = Math.max(baseColor.lightness() - MIN_LIGHTNESS, 0)
  const lightnessDistToMax = Math.max(MAX_LIGHTNESS - baseColor.lightness(), 0)

  colorsFileLines.push(formatColorToCss(name, baseColor))
  colorComponentsFileLines.push(formatColorComponentToCss(`${name}-component`, baseColor))

  for (const shade of [25, 50, 100, 200, 300, 400]) {
    const percent = 1 - (shade / 500)
    const shifted = 1 - ((1 - percent) ** 2)
    const color = baseColor.lightness(baseColor.lightness() + shifted * lightnessDistToMax)

    colorsFileLines.push(formatColorToCss(`${name}-${shade}`, color))
    colorComponentsFileLines.push(formatColorComponentToCss(`${name}-component-${shade}`, color))
  }

  for (const shade of [500, 600, 700, 800, 900, 950, 975]) {
    const percent = (shade - 500) / 500
    const color = baseColor.lightness(baseColor.lightness() - percent * lightnessDistToMin)

    colorsFileLines.push(formatColorToCss(`${name}-${shade}`, color))
    colorComponentsFileLines.push(formatColorComponentToCss(`${name}-component-${shade}`, color))
  }
}

function formatColorToCss(name: string, color: Color) {
  return `--${name}: ${color.hex()};`
}

function formatColorComponentToCss(name: string, color: Color) {
  return `--${name}: ${color.red()}, ${color.green()}, ${color.blue()};`
}
