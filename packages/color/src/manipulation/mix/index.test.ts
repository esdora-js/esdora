import { describe, expect, it } from 'vitest'
import { mix } from '.'

describe('mix', () => {
  describe('基础混合功能', () => {
    it('应该混合两个颜色', () => {
      const result = mix('#ff0000', '#0000ff')
      expect(result).toBe('#800080')
    })

    it('应该混合三个颜色', () => {
      const result = mix('#ff0000', '#00ff00', '#0000ff')
      expect(result).toBe('#555555')
    })

    it('应该混合四个颜色', () => {
      const result = mix('#ff0000', '#00ff00', '#0000ff', '#ffff00')
      expect(result).toBe('#808040')
    })

    it('应该处理单个颜色输入', () => {
      const result = mix('#ff0000')
      expect(result).toBe('#ff0000')
    })
  })

  describe('返回格式', () => {
    it('应该总是返回 Hex 格式', () => {
      const result = mix('#ff0000', 'rgb(0, 255, 0)')
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('应该将 RGB 输入转换为 Hex 格式', () => {
      const result = mix('rgb(255, 0, 0)', '#00ff00')
      expect(result).toBe('#808000')
    })

    it('应该将 HSL 输入转换为 Hex 格式', () => {
      const result = mix('hsl(0, 100%, 50%)', 'hsl(120, 100%, 50%)')
      expect(result).toBe('#808000')
    })

    it('应该处理带透明度的颜色并返回 8 位 Hex', () => {
      const result = mix('rgba(255, 0, 0, 0.8)', 'rgba(0, 255, 0, 0.4)')
      expect(result).toBe('#80800099')
    })
  })

  describe('透明度处理', () => {
    it('应该正确混合透明度', () => {
      const result = mix('rgba(255, 0, 0, 0.8)', 'rgba(0, 255, 0, 0.4)')
      expect(result).toBe('#80800099')
    })

    it('应该处理多个带透明度的颜色', () => {
      const result = mix('rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0)')
      expect(result).toBe('#55555580')
    })
  })

  describe('颜色计算准确性', () => {
    it('红色和绿色混合应该得到黄色系', () => {
      const result = mix('#ff0000', '#00ff00')
      expect(result).toBe('#808000')
    })

    it('红色和蓝色混合应该得到紫色系', () => {
      const result = mix('#ff0000', '#0000ff')
      expect(result).toBe('#800080')
    })

    it('绿色和蓝色混合应该得到青色系', () => {
      const result = mix('#00ff00', '#0000ff')
      expect(result).toBe('#008080')
    })

    it('白色和黑色混合应该得到灰色', () => {
      const result = mix('#ffffff', '#000000')
      expect(result).toBe('#808080')
    })
  })

  describe('多颜色混合', () => {
    it('应该正确处理5个颜色的混合', () => {
      const result = mix('#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff')
      // 验证结果是合理的颜色值
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('应该正确处理大量颜色的混合', () => {
      const colors = [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#ff00ff',
        '#00ffff',
        '#ffffff',
        '#000000',
        '#808080',
        '#ffa500',
      ]
      const result = mix(...colors)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })

  describe('边界情况', () => {
    it('应该抛出错误当没有提供颜色时', () => {
      expect(() => mix()).toThrow('至少需要提供一个颜色')
    })

    it('应该处理单个颜色', () => {
      const result = mix('#ff0000')
      expect(result).toBe('#ff0000')
    })

    it('应该处理单个颜色带透明度', () => {
      const result = mix('rgba(255, 0, 0, 0.5)')
      expect(result).toMatch(/^#[0-9a-f]{8}$/i) // 8位hex包含alpha
    })

    it('应该处理相同颜色的混合', () => {
      const result = mix('#ff0000', '#ff0000', '#ff0000')
      expect(result).toBe('#ff0000')
    })

    it('应该处理单个无效颜色', () => {
      const result = mix('invalid-color')
      expect(result).toBe(null)
    })

    it('should handle mix with one invalid color among valid ones', () => {
      const result = mix('#ff0000', 'invalid-color', '#00ff00')
      expect(result).toBe(null)
    })

    it('should handle colors that fail rgb conversion', () => {
      // Test with a color object that has an invalid mode
      // This is a real scenario where parseColor accepts it but rgb converter fails
      const invalidModeColor = { mode: 'invalid', r: 0.5, g: 0.5, b: 0.5 } as any
      const result = mix('#ff0000', invalidModeColor)
      expect(result).toBe(null)
    })
  })

  describe('实际使用场景', () => {
    it('应该适合创建渐变中间色', () => {
      const start = '#3498db'
      const end = '#e74c3c'
      const middle = mix(start, end)
      expect(middle).not.toBe(start)
      expect(middle).not.toBe(end)
    })

    it('应该适合创建调色板', () => {
      const base = '#2c3e50'
      const accent1 = '#3498db'
      const accent2 = '#e74c3c'
      const mixed = mix(base, accent1, accent2)
      expect(mixed).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })

  describe('错误处理', () => {
    it('应该处理无效颜色字符串', () => {
      const result = mix('invalid-color', '#ff0000')
      expect(result).toBe(null)
    })

    it('应该处理第二个颜色无效', () => {
      const result = mix('#ff0000', 'invalid-color')
      expect(result).toBe(null)
    })

    it('应该处理空参数', () => {
      expect(() => mix()).toThrow('至少需要提供一个颜色')
    })

    it('应该处理单个颜色参数', () => {
      const result = mix('#ff0000')
      expect(result).toBe('#ff0000') // 单个颜色返回自身
    })

    it('应该处理 null 输入', () => {
      const result = mix(null as any, '#ff0000')
      expect(result).toBe(null)
    })

    it('应该正确处理 RGB 值为 undefined 的颜色', () => {
      // 测试当 RGB 颜色对象的红、绿、蓝和透明度值为 undefined 时的默认值处理
      const edgeCaseColor1 = {
        mode: 'rgb',
        r: undefined,
        g: undefined,
        b: undefined,
        alpha: undefined,
      } as any

      const edgeCaseColor2 = {
        mode: 'rgb',
        r: 1,
        g: 0,
        b: 0,
        alpha: 1,
      } as any

      // 当 RGB 值为 undefined 时，默认为 0，透明度默认为 1
      const result = mix(edgeCaseColor1, edgeCaseColor2)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })
})
