import fs from 'node:fs'
import { createResolver, defineNuxtModule } from '@nuxt/kit'
import Color from 'color'
import { getColors } from 'theme-colors'

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
  },
  async setup(options, nuxt) {
    const colorsFileLines = []
    const colorComponentsFileLines = []

    colorsFileLines.push(':root {')
    colorComponentsFileLines.push(':root {')

    createColorShades(colorsFileLines, colorComponentsFileLines, 'primary-color', options.primaryColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'secondary-color', options.secondaryColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'success-color', options.successColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'error-color', options.errorColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'warning-color', options.warningColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'info-color', options.infoColor)
    createColorShades(colorsFileLines, colorComponentsFileLines, 'neutral-color', options.neutralColor)

    colorsFileLines.push('}')
    colorComponentsFileLines.push('}')

    const stylesheetsDirPath = resolve('./runtime/stylesheets')
    if (!fs.existsSync(stylesheetsDirPath))
      await fs.promises.mkdir(stylesheetsDirPath, { recursive: true })

    const colorsPath = resolve('./runtime/stylesheets/colors.css')
    const colorComponentsPath = resolve('./runtime/stylesheets/colorComponents.css')

    await fs.promises.writeFile(colorsPath, colorsFileLines.join('\n'))
    await fs.promises.writeFile(colorComponentsPath, colorComponentsFileLines.join('\n'))

    nuxt.options.css.push(resolve(colorsPath))
    nuxt.options.css.push(resolve(colorComponentsPath))

    nuxt.hook('close', () => {
      if (fs.existsSync(colorsPath))
        fs.unlinkSync(colorsPath)

      if (fs.existsSync(colorComponentsPath))
        fs.unlinkSync(colorComponentsPath)
    })
  },
})

function createColorShades(colorsFileLines: string[], colorComponentsFileLines: string[], name: string, color: string) {
  const colorShades = getColors(color)

  const baseColor = new Color(color)
  colorsFileLines.push(formatColorToCss(name, baseColor))
  colorComponentsFileLines.push(formatColorComponentToCss(`${name}-component`, baseColor))

  for (const shade in colorShades) {
    const color = new Color(colorShades[shade])
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
