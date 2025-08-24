import { describe, expect, it } from 'vitest'
import { setAlpha } from '.'

describe('setAlpha', () => {
  describe('基础透明度设置', () => {
    it('应该设置 hex 颜色的透明度', () => {
      const result = setAlpha('#ff0000', 0.5)
      expect(result).toBe('#ff000080')
    })

    it('应该设置 RGB 颜色的透明度', () => {
      const result = setAlpha('rgb(255, 0, 0)', 0.8)
      expect(result).toBe('#ff0000cc')
    })

    it('应该设置 HSL 颜色的透明度', () => {
      const result = setAlpha('hsl(0, 100%, 50%)', 0.6)
      expect(result).toBe('#ff000099')
    })

    it('应该设置颜色名称的透明度', () => {
      const result = setAlpha('red', 0.3)
      expect(result).toBe('#ff00004d')
    })
  })

  describe('已有透明度格式的处理', () => {
    it('应该更新 RGBA 颜色的透明度', () => {
      const result = setAlpha('rgba(255, 0, 0, 0.3)', 0.9)
      expect(result).toBe('#ff0000e6')
    })

    it('应该更新 HSLA 颜色的透明度', () => {
      const result = setAlpha('hsla(0, 100%, 50%, 0.2)', 0.7)
      expect(result).toBe('#ff0000b3')
    })

    it('应该更新带透明度的 hex 颜色', () => {
      const result = setAlpha('#ff000080', 0.2)
      expect(result).toBe('#ff000033')
    })
  })

  describe('完全不透明的处理', () => {
    it('应该将 RGBA 转换为 RGB 当透明度为 1', () => {
      const result = setAlpha('rgba(255, 0, 0, 0.5)', 1)
      expect(result).toBe('#ff0000')
    })

    it('应该将 HSLA 转换为 HSL 当透明度为 1', () => {
      const result = setAlpha('hsla(0, 100%, 50%, 0.3)', 1)
      expect(result).toBe('#ff0000')
    })

    it('应该保持 hex 格式当透明度为 1', () => {
      const result = setAlpha('#ff000080', 1)
      expect(result).toBe('#ff0000')
    })
  })

  describe('边界值处理', () => {
    it('应该处理透明度为 0（完全透明）', () => {
      const result = setAlpha('#ff0000', 0)
      expect(result).toBe('#ff000000')
    })

    it('应该处理透明度为 1（完全不透明）', () => {
      const result = setAlpha('#ff0000', 1)
      expect(result).toBe('#ff0000')
    })

    it('应该限制透明度值在 0-1 范围内（超出上限）', () => {
      const result = setAlpha('#ff0000', 1.5)
      expect(result).toBe('#ff0000')
    })

    it('应该限制透明度值在 0-1 范围内（超出下限）', () => {
      const result = setAlpha('#ff0000', -0.5)
      expect(result).toBe('#ff000000')
    })
  })

  describe('不同颜色格式的一致性', () => {
    it('相同颜色不同格式应该产生一致的结果', () => {
      const alpha = 0.5
      const hexResult = setAlpha('#ff0000', alpha)
      const rgbResult = setAlpha('rgb(255, 0, 0)', alpha)
      const hslResult = setAlpha('hsl(0, 100%, 50%)', alpha)

      // 所有格式都应该返回相同的 Hex 格式
      expect(hexResult).toBe('#ff000080')
      expect(rgbResult).toBe('#ff000080')
      expect(hslResult).toBe('#ff000080')
    })
  })

  describe('精度处理', () => {
    it('应该正确处理小数透明度值', () => {
      const result = setAlpha('#ff0000', 0.33)
      expect(result).toBe('#ff000054')
    })

    it('应该正确处理高精度透明度值', () => {
      const result = setAlpha('rgb(255, 0, 0)', 0.123)
      expect(result).toBe('#ff00001f')
    })
  })

  describe('实际使用场景', () => {
    it('应该适合创建悬停效果', () => {
      const button = '#3498db'
      const hoverButton = setAlpha(button, 0.8)
      expect(hoverButton).toBe('#3498dbcc')
    })

    it('应该适合创建遮罩层', () => {
      const overlay = setAlpha('#000000', 0.5)
      expect(overlay).toBe('#00000080')
    })

    it('应该适合调整现有透明颜色', () => {
      const semiTransparent = 'rgba(52, 152, 219, 0.3)'
      const moreOpaque = setAlpha(semiTransparent, 0.8)
      expect(moreOpaque).toBe('#3498dbcc')
    })
  })

  describe('错误处理', () => {
    it('应该处理无效颜色字符串', () => {
      const result = setAlpha('invalid-color', 0.5)
      expect(result).toBe(null)
    })

    it('应该处理空字符串', () => {
      const result = setAlpha('', 0.5)
      expect(result).toBe(null)
    })

    it('应该处理 null 输入', () => {
      const result = setAlpha(null as any, 0.5)
      expect(result).toBe(null)
    })

    it('应该处理 undefined 输入', () => {
      const result = setAlpha(undefined as any, 0.5)
      expect(result).toBe(null)
    })
  })
})
