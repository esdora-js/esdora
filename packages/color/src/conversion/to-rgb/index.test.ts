import { describe, expect, it } from 'vitest'
import { toRgb } from '.'

describe('toRgb', () => {
  it('should convert hex string to RGB object', () => {
    const result = toRgb('#FF0000')
    expect(result).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should convert HSL string to RGB object', () => {
    const result = toRgb('hsl(0, 100%, 50%)')
    expect(result).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should convert HSL object to RGB object', () => {
    const result = toRgb({ h: 0, s: 100, l: 50, mode: 'hsl' })
    expect(result).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should handle RGB string input', () => {
    const result = toRgb('rgb(255, 0, 0)')
    expect(result).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should handle different colors', () => {
    expect(toRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 })
    expect(toRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 })
    expect(toRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 })
    expect(toRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('should handle colors with alpha', () => {
    const result = toRgb('rgba(255, 0, 0, 0.5)')
    expect(result).toEqual({ r: 255, g: 0, b: 0, a: 0.5 })
  })

  it('should handle short hex format', () => {
    const result = toRgb('#f00')
    expect(result).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should handle invalid colors', () => {
    expect(toRgb('invalid-color')).toBe(null)
    expect(toRgb('')).toBe(null)
    expect(toRgb(null as any)).toBe(null)
  })

  describe('边界情况', () => {
    it('should handle colors with alpha = 1 (no alpha property)', () => {
      const result = toRgb('rgba(255, 0, 0, 1)')
      expect(result).toEqual({ r: 255, g: 0, b: 0 })
      expect(result).not.toHaveProperty('a')
    })

    it('should handle edge cases with undefined values', () => {
      // Test colors that might have undefined r, g, or b values
      const result = toRgb('#808080')
      expect(result).toEqual({ r: 128, g: 128, b: 128 })
    })

    it('should handle colors that fail rgb conversion', () => {
      // Test with a color object that has an invalid mode
      // This is a real scenario where parseColor accepts it but rgb converter fails
      const invalidModeColor = { mode: 'invalid', r: 0.5, g: 0.5, b: 0.5 } as any
      const result = toRgb(invalidModeColor)
      expect(result).toBe(null)
    })

    it('应该正确处理 RGB 值为 undefined 的颜色', () => {
      // 测试当 RGB 颜色对象的红、绿、蓝值为 undefined 时的默认值处理
      const edgeCaseColor = {
        mode: 'rgb',
        r: undefined,
        g: undefined,
        b: undefined,
      } as any

      // 当红、绿、蓝值为 undefined 时，默认为 0
      const result = toRgb(edgeCaseColor)
      expect(result).toEqual({ r: 0, g: 0, b: 0 })
    })
  })
})
