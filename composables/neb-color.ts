import Color from 'color'
import { getColors } from 'theme-colors'

export interface ColorPaletteSources {
  primaryColor: `#${string}`
  secondaryColor: `#${string}`
  successColor: `#${string}`
  errorColor: `#${string}`
  warningColor: `#${string}`
  infoColor: `#${string}`
}

export const nebDefaultColorPalette: ColorPaletteSources = {
  primaryColor: '#9E77ED',
  secondaryColor: '#9E77ED',
  successColor: '#17B26A',
  errorColor: '#F04438',
  warningColor: '#F79009',
  infoColor: '#756b8a',
}

// saturation: 80-90

export function calcColorPalette(sources: ColorPaletteSources) {
  const colorPalette: Record<string, string> = {}
  const colorComponents: Record<string, string> = {}

  createColorShades(colorPalette, colorComponents, 'primary-color', sources.primaryColor)
  createColorShades(colorPalette, colorComponents, 'secondary-color', sources.secondaryColor)
  createColorShades(colorPalette, colorComponents, 'success-color', sources.successColor)
  createColorShades(colorPalette, colorComponents, 'error-color', sources.errorColor)
  createColorShades(colorPalette, colorComponents, 'warning-color', sources.warningColor)
  createColorShades(colorPalette, colorComponents, 'info-color', sources.infoColor)
  const neutralColor = new Color(sources.primaryColor).saturationl(5).lightness(45)
  createColorShades(colorPalette, colorComponents, 'neutral-color', neutralColor.hex())

  return {
    colorPalette,
    colorComponents,
  }
}

function createColorShades(colorPalette: Record<string, string>, colorComponents: Record<string, string>, name: string, color: string) {
  const colorShades = getColors(color)

  const baseColor = new Color(color)
  colorPalette[name] = baseColor.hex()
  colorComponents[`${name}-component`] = baseColor.rgb().array().join(', ')

  for (const shade in colorShades) {
    const color = new Color(colorShades[shade])
    colorPalette[`${name}-${shade}`] = color.hex()
    colorComponents[`${name}-component-${shade}`] = color.rgb().array().join(', ')
  }
}

export function useNebColorPalette(sources: Partial<ColorPaletteSources>) {
  const paletteSource = { ...nebDefaultColorPalette, ...sources }

  const { colorPalette, colorComponents } = calcColorPalette(paletteSource)

  for (const name in colorPalette)
    document.documentElement.style.setProperty(`--${name}`, colorPalette[name])

  for (const name in colorComponents)
    document.documentElement.style.setProperty(`--${name}`, colorComponents[name])
}
