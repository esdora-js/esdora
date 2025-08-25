import { describe, expect, it } from 'vitest'
import { adjustSaturation } from '.'

describe('adjustSaturation', () => {
  describe('function adjuster', () => {
    it('should adjust saturation using function', () => {
      const result = adjustSaturation('#ff0000', s => s * 0.5)
      expect(result).toBeDefined()
      expect(result?.mode).toBe('hsl')
    })

    it('should handle function that returns 0', () => {
      const result = adjustSaturation('#ff0000', () => 0)
      expect(result).toBeDefined()
      expect((result as any)?.s).toBe(0)
    })

    it('should handle function that returns 1', () => {
      const result = adjustSaturation('#ff0000', () => 1)
      expect(result).toBeDefined()
      expect((result as any)?.s).toBe(1)
    })
  })

  describe('number adjuster', () => {
    it('should adjust saturation using number', () => {
      const result = adjustSaturation('#ff0000', 0.5)
      expect(result).toBeDefined()
      expect((result as any)?.s).toBe(0.5)
    })

    it('should clamp values above 1', () => {
      const result = adjustSaturation('#ff0000', 1.5)
      expect(result).toBeDefined()
      expect((result as any)?.s).toBe(1)
    })

    it('should clamp values below 0', () => {
      const result = adjustSaturation('#ff0000', -0.5)
      expect(result).toBeDefined()
      expect((result as any)?.s).toBe(0)
    })
  })

  describe('error handling', () => {
    it('should return null for invalid color', () => {
      const result = adjustSaturation('invalid-color', 0.5)
      expect(result).toBe(null)
    })

    it('should return null for empty string', () => {
      const result = adjustSaturation('', 0.5)
      expect(result).toBe(null)
    })

    it('should return null for null input', () => {
      const result = adjustSaturation(null as any, 0.5)
      expect(result).toBe(null)
    })

    it('should handle colors that fail hsl conversion', () => {
      // Test with a color object that has an invalid mode
      // This is a real scenario where parseColor accepts it but hsl converter fails
      const invalidModeColor = { mode: 'invalid', r: 0.5, g: 0.5, b: 0.5 } as any
      const result = adjustSaturation(invalidModeColor, 0.5)
      expect(result).toBe(null)
    })

    it('应该正确处理饱和度值为 undefined 的颜色', () => {
      // 测试当 HSL 颜色对象的饱和度值为 undefined 时的默认值处理
      const edgeCaseColor = {
        mode: 'hsl',
        h: 0,
        s: undefined,
        l: 0.5,
        alpha: 1,
      } as any

      // 当饱和度值为 undefined 时，默认为 0，然后加上 0.5
      const result = adjustSaturation(edgeCaseColor, s => s + 0.5)
      expect(result).toEqual({
        mode: 'hsl',
        h: 0,
        s: 0.5,
        l: 0.5,
        alpha: 1,
      })
    })
  })
})
