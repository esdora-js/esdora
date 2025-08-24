import { describe, expect, it } from 'vitest'
import { toOklch } from '.'

describe('toOklch', () => {
  it('should convert hex string to OKLCH object', () => {
    const result = toOklch('#FF0000')
    expect(result).toEqual({ l: 0.628, c: 0.258, h: 29.234 })
  })

  it('should convert RGB string to OKLCH object', () => {
    const result = toOklch('rgb(255, 0, 0)')
    expect(result).toEqual({ l: 0.628, c: 0.258, h: 29.234 })
  })

  it('should convert HSL string to OKLCH object', () => {
    const result = toOklch('hsl(0, 100%, 50%)')
    expect(result).toEqual({ l: 0.628, c: 0.258, h: 29.234 })
  })

  it('should handle different colors', () => {
    expect(toOklch('#00FF00')).toEqual({ l: 0.866, c: 0.295, h: 142.495 })
    expect(toOklch('#0000FF')).toEqual({ l: 0.452, c: 0.313, h: 264.052 })
    expect(toOklch('#FFFFFF')).toEqual({ l: 1, c: 0, h: 0 })
    expect(toOklch('#000000')).toEqual({ l: 0, c: 0, h: 0 })
  })

  it('should handle colors with alpha', () => {
    const result = toOklch('rgba(255, 0, 0, 0.5)')
    expect(result).toEqual({ l: 0.628, c: 0.258, h: 29.234, a: 0.5 })
  })

  it('should handle short hex format', () => {
    const result = toOklch('#f00')
    expect(result).toEqual({ l: 0.628, c: 0.258, h: 29.234 })
  })

  it('should handle grayscale colors', () => {
    const result = toOklch('#808080')
    expect(result).toEqual({ l: 0.6, c: 0, h: 0 })
  })

  it('should handle invalid colors', () => {
    expect(toOklch('invalid-color')).toBe(null)
    expect(toOklch('')).toBe(null)
    expect(toOklch(null as any)).toBe(null)
  })

  describe('边界情况', () => {
    it('should handle colors with alpha = 1 (no alpha property)', () => {
      const result = toOklch('rgba(255, 0, 0, 1)')
      expect(result).toEqual({ l: 0.628, c: 0.258, h: 29.234 })
      expect(result).not.toHaveProperty('a')
    })

    it('should handle edge cases with undefined values', () => {
      // Test colors that might have undefined l, c, or h values
      const result = toOklch('#808080') // Gray color might have undefined chroma/hue
      expect(result).toEqual({ l: 0.6, c: 0, h: 0 })
    })

    it('should handle colors that fail oklch conversion', () => {
      // Test with a color object that has an invalid mode
      // This is a real scenario where parseColor accepts it but oklch converter fails
      const invalidModeColor = { mode: 'invalid', r: 0.5, g: 0.5, b: 0.5 } as any
      const result = toOklch(invalidModeColor)
      expect(result).toBe(null)
    })

    it('应该正确处理 OKLCH 值为 undefined 的颜色', () => {
      // 测试当 OKLCH 颜色对象的亮度、色度和色相值为 undefined 时的默认值处理
      const edgeCaseColor = {
        mode: 'oklch',
        l: undefined,
        c: undefined,
        h: undefined,
      } as any

      // 当亮度、色度和色相值为 undefined 时，默认为 0
      const result = toOklch(edgeCaseColor)
      expect(result).toEqual({ l: 0, c: 0, h: 0 })
    })
  })
})
