import fs from 'node:fs'
import { calcColorPalette, nebDefaultColorPalette } from '@nebula/composables/neb-color'
import { createResolver, defineNuxtModule } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule({
  meta: {
    name: 'nebula',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: nebDefaultColorPalette,
  async setup(options, nuxt) {
    const colorsFileLines = []
    const colorComponentsFileLines = []

    const { colorPalette, colorComponents } = calcColorPalette(options)

    colorsFileLines.push(':root {')
    for (const name in colorPalette)
      colorsFileLines.push(`--${name}: ${colorPalette[name]};`)
    colorsFileLines.push('}')

    colorComponentsFileLines.push(':root {')
    for (const name in colorComponents)
      colorComponentsFileLines.push(`--${name}: ${colorComponents[name]};`)
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
