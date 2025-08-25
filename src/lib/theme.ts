import { TypeName } from '@/types/pokemon'

export const TYPE_COLORS: Record<TypeName, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function generateShades(baseColor: string): Record<string, string> {
  const { h, s, l } = hexToHsl(baseColor)
  
  return {
    50: hslToHex(h, s, 95),
    100: hslToHex(h, s, 90),
    200: hslToHex(h, s, 80),
    300: hslToHex(h, s, 70),
    400: hslToHex(h, s, 60),
    500: baseColor,
    600: hslToHex(h, s, Math.max(l - 10, 10)),
    700: hslToHex(h, s, Math.max(l - 20, 5)),
    800: hslToHex(h, s, Math.max(l - 30, 5)),
    900: hslToHex(h, s, Math.max(l - 40, 5)),
    950: hslToHex(h, s, Math.max(l - 50, 2)),
  }
}

export function getTypeTheme(types: TypeName[]): {
  primary: string
  shades: Record<string, string>
  gradient: string
} {
  const primaryType = types[0]
  const primaryColor = TYPE_COLORS[primaryType]
  const shades = generateShades(primaryColor)
  
  let gradient = primaryColor
  if (types.length > 1) {
    const secondaryColor = TYPE_COLORS[types[1]]
    gradient = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
  } else {
    gradient = `linear-gradient(135deg, ${primaryColor} 0%, ${shades[600]} 100%)`
  }
  
  return {
    primary: primaryColor,
    shades,
    gradient,
  }
}

export function applyTypeTheme(types: TypeName[]) {
  const theme = getTypeTheme(types)
  const root = document.documentElement
  
  Object.entries(theme.shades).forEach(([shade, color]) => {
    root.style.setProperty(`--brand-${shade}`, color)
  })
  
  root.style.setProperty('--brand', theme.primary)
  root.style.setProperty('--brand-gradient', theme.gradient)
}