import { hexToHsl, hslToHex, generateShades, getTypeTheme, TYPE_COLORS } from '../theme'

describe('Theme System', () => {
  describe('hexToHsl', () => {
    it('should convert hex colors to HSL', () => {
      const result = hexToHsl('#FF0000') // Red
      expect(result.h).toBe(0)
      expect(result.s).toBe(100)
      expect(result.l).toBe(50)
    })

    it('should handle different hex formats', () => {
      const result = hexToHsl('#FFFFFF') // White
      expect(result.l).toBe(100)
      expect(result.s).toBe(0)
    })
  })

  describe('hslToHex', () => {
    it('should convert HSL back to hex', () => {
      const hex = hslToHex(0, 100, 50) // Red
      expect(hex.toLowerCase()).toBe('#ff0000')
    })
  })

  describe('generateShades', () => {
    it('should generate a complete shade palette', () => {
      const shades = generateShades('#FF0000')
      
      expect(shades).toHaveProperty('50')
      expect(shades).toHaveProperty('100')
      expect(shades).toHaveProperty('500', '#FF0000')
      expect(shades).toHaveProperty('900')
      expect(shades).toHaveProperty('950')
    })
  })

  describe('getTypeTheme', () => {
    it('should return theme for single type', () => {
      const theme = getTypeTheme(['fire'])
      
      expect(theme.primary).toBe(TYPE_COLORS.fire)
      expect(theme.shades).toHaveProperty('500', TYPE_COLORS.fire)
      expect(theme.gradient).toContain(TYPE_COLORS.fire)
    })

    it('should create gradient for dual types', () => {
      const theme = getTypeTheme(['fire', 'water'])
      
      expect(theme.primary).toBe(TYPE_COLORS.fire)
      expect(theme.gradient).toContain(TYPE_COLORS.fire)
      expect(theme.gradient).toContain(TYPE_COLORS.water)
      expect(theme.gradient).toContain('linear-gradient')
    })
  })

  describe('TYPE_COLORS', () => {
    it('should have colors for all 18 types', () => {
      const expectedTypes = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
      ]

      expectedTypes.forEach(type => {
        expect(TYPE_COLORS).toHaveProperty(type)
        expect(typeof TYPE_COLORS[type as keyof typeof TYPE_COLORS]).toBe('string')
        expect(TYPE_COLORS[type as keyof typeof TYPE_COLORS]).toMatch(/^#[0-9A-Fa-f]{6}$/)
      })
    })
  })
})