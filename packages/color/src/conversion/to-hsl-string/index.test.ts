import { describe, expect, it } from 'vitest'
import { toHslString } from '.'

describe('toHslString', () => {
  describe('基础转换功能', () => {
    it('应该将十六进制字符串转换为 HSL 字符串', () => {
      const result = toHslString('#FF0000')
      expect(result).toBe('hsl(0, 100%, 50%)')
    })

    it('应该将 RGB 字符串转换为 HSL 字符串', () => {
      const result = toHslString('rgb(255, 0, 0)')
      expect(result).toBe('hsl(0, 100%, 50%)')
    })

    it('应该将 RGB 对象转换为 HSL 字符串', () => {
      const result = toHslString({ r: 255, g: 0, b: 0, mode: 'rgb' })
      expect(result).toBe('hsl(0, 100%, 50%)')
    })

    it('应该正确处理 HSL 对象输入', () => {
      const result = toHslString({ h: 0, s: 100, l: 50, mode: 'hsl' })
      expect(result).toBe('hsl(0, 100%, 50%)')
    })

    it('应该正确处理不同的颜色', () => {
      expect(toHslString('#00FF00')).toBe('hsl(120, 100%, 50%)') // 绿色
      expect(toHslString('#0000FF')).toBe('hsl(240, 100%, 50%)') // 蓝色
      expect(toHslString('#FFFFFF')).toBe('hsl(0, 0%, 100%)') // 白色
      expect(toHslString('#000000')).toBe('hsl(0, 0%, 0%)') // 黑色
    })
  })

  describe('特殊格式处理', () => {
    it('应该正确处理带透明度的颜色', () => {
      const result = toHslString('rgba(255, 0, 0, 0.5)')
      expect(result).toBe('hsla(0, 100%, 50%, 0.5)')
    })

    it('应该正确处理短格式十六进制', () => {
      const result = toHslString('#f00')
      expect(result).toBe('hsl(0, 100%, 50%)')
    })

    it('应该正确处理灰度颜色', () => {
      const result = toHslString('#808080')
      expect(result).toBe('hsl(0, 0%, 50.2%)')
    })
  })

  describe('错误处理', () => {
    it('应该处理无效颜色字符串', () => {
      const result = toHslString('invalid-color')
      expect(result).toBe(null)
    })

    it('应该处理空字符串', () => {
      const result = toHslString('')
      expect(result).toBe(null)
    })

    it('应该处理 null 输入', () => {
      const result = toHslString(null as any)
      expect(result).toBe(null)
    })
  })

  describe('边界情况', () => {
    it('should handle colors with alpha = 1 (no alpha in output)', () => {
      const result = toHslString('rgba(255, 0, 0, 1)')
      expect(result).toBe('hsl(0, 100%, 50%)')
    })

    it('should handle edge cases with undefined values', () => {
      // Test colors that might have undefined hue
      const result = toHslString('#808080') // Gray color might have undefined hue
      expect(result).toBe('hsl(0, 0%, 50.2%)')
    })

    it('should handle colors that fail hsl conversion', () => {
      // Test with a color object that has an invalid mode
      // This is a real scenario where parseColor accepts it but hsl converter fails
      const invalidModeColor = { mode: 'invalid', r: 0.5, g: 0.5, b: 0.5 } as any
      const result = toHslString(invalidModeColor)
      expect(result).toBe(null)
    })
  })
})
