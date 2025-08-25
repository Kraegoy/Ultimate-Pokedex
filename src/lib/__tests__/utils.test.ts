import { capitalizeFirst, formatNumber, slugify, debounce } from '../utils'

describe('Utils', () => {
  describe('capitalizeFirst', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalizeFirst('hello')).toBe('Hello')
      expect(capitalizeFirst('WORLD')).toBe('WORLD')
      expect(capitalizeFirst('')).toBe('')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with locale string', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1234567)).toBe('1,234,567')
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('slugify', () => {
    it('should convert strings to URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Pokémon GO!')).toBe('pokmon-go')
      expect(slugify('  Test  String  ')).toBe('test-string')
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('test1')
      debouncedFn('test2')
      debouncedFn('test3')

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenLastCalledWith('test3')
    })
  })
})