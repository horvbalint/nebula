import Color from 'color'

export function getColorResolution() {
  return useState('nebulaColorResolution', () => 50)
}

export function setPrimaryColor(color: string) {
  const primaryColor = new Color(color)

  const colorResolution = getColorResolution().value
  for (let lightness = 0; lightness < 500; lightness += colorResolution) {
    const name = `--primary-color-${500 + lightness}`
    const value = primaryColor.darken(lightness / 100).toString()
    document.documentElement.style.setProperty(name, value)
  }

  for (let lightness = 0; lightness < 500; lightness += colorResolution) {
    const name = `--primary-color-${500 - lightness}`
    const value = primaryColor.lighten(lightness / 100).toString()
    document.documentElement.style.setProperty(name, value)
  }
}
