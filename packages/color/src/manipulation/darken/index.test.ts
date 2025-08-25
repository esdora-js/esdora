import { describe, expect, it } from 'vitest'
import { darken } from '.'

describe('darken', () => {
  describe('基础变暗功能', () => {
    it('当传入白色和最大变暗值时，必须返回黑色', () => {
      const result = darken('#ffffff', 1)
      expect(result).toBe('#000000')
    })

    it('当传入红色和 0.5 变暗值时，必须返回更暗的红色', () => {
      const result = darken('#ff0000', 0.5)
      expect(result).toBe('#890000')
    })

    it('当传入蓝色和 0.3 变暗值时，必须返回更暗的蓝色', () => {
      const result = darken('#0000ff', 0.3)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
      expect(result).not.toBe('#000000')
      expect(result).not.toBe('#0000ff')
    })

    it('当传入黑色时，必须保持黑色不变', () => {
      const result = darken('#000000', 0.5)
      expect(result).toBe('#000000')
    })
  })

  describe('多种输入格式支持', () => {
    it('当传入 RGB 字符串时，必须返回十六进制格式', () => {
      const result = darken('rgb(255, 0, 0)', 0.3)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('当传入 HSL 字符串时，必须返回十六进制格式', () => {
      const result = darken('hsl(0, 100%, 50%)', 0.2)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('当传入带透明度的颜色时，必须返回带透明度的十六进制格式', () => {
      const result = darken('rgba(255, 0, 0, 0.8)', 0.3)
      expect(result).toMatch(/^#[0-9a-f]{8}$/i)
    })
  })

  describe('函数调整器支持', () => {
    it('当传入函数调整器时，必须基于当前亮度进行调整', () => {
      const result = darken('#ff0000', l => l * 0.5)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('当传入返回固定值的函数时，必须设置为该亮度值', () => {
      const result = darken('#ff0000', () => 0.3)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })

  describe('参数处理', () => {
    it('当传入 0 时，必须保持原色不变', () => {
      const result = darken('#ff0000', 0)
      expect(result).toBe('#ff0000')
    })

    it('当传入大于 1 的百分比值时，必须正确处理', () => {
      const result = darken('#ff0000', 50)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('当传入小于等于 1 的小数值时，必须正确处理', () => {
      const result = darken('#ff0000', 0.5)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })

  describe('实际应用场景', () => {
    it('当用于 UI hover 效果时，必须产生合适的深色变体', () => {
      const primaryColor = '#3498db'
      const hoverColor = darken(primaryColor, 0.1)

      expect(hoverColor).toMatch(/^#[0-9a-f]{6}$/i)
      expect(hoverColor).not.toBe(primaryColor)
      expect(hoverColor).not.toBe('#000000')
    })

    it('当用于创建阴影效果时，必须产生明显更暗的颜色', () => {
      const baseColor = '#e74c3c'
      const shadowColor = darken(baseColor, 0.3)

      expect(shadowColor).toMatch(/^#[0-9a-f]{6}$/i)
      expect(shadowColor).not.toBe(baseColor)
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      const result = darken('invalid-color', 0.5)
      expect(result).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      const result = darken('', 0.5)
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = darken(null as any, 0.5)
      expect(result).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      const result = darken(undefined as any, 0.5)
      expect(result).toBe(null)
    })
  })
})
