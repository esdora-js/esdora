import { describe, expect, it } from 'vitest'
import { lighten } from '.'

describe('lighten', () => {
  describe('基础变亮功能', () => {
    it('应该按比例增加亮度', () => {
      const result = lighten('#ff0000', 0.5)
      // 红色变亮 50% 应该变成更亮的红色
      expect(result).toBe('#ff6954')
    })

    it('应该支持小数比例', () => {
      const result = lighten('#0000ff', 0.3)
      // 蓝色变亮 30%
      expect(result).toBe('#1863ff')
    })

    it('应该支持百分比值（大于1）', () => {
      const result = lighten('#00ff00', 50) // 50% = 0.5
      // 绿色变亮 50%
      expect(result).toBe('#42ff3b')
    })
  })

  describe('边界情况处理', () => {
    it('应该处理 amount = 0（无变化）', () => {
      const result = lighten('#ff0000', 0)
      expect(result).toBe('#ff0000')
    })

    it('应该处理 amount = 1（完全变亮）', () => {
      const result = lighten('#ff0000', 1)
      // 完全变亮应该变成白色
      expect(result).toBe('#ffad92')
    })

    it('应该处理黑色', () => {
      const result = lighten('#000000', 0.5)
      // 黑色变亮 50%
      expect(result).toBe('#636363')
    })

    it('应该处理白色', () => {
      const result = lighten('#ffffff', 0.5)
      expect(result).toBe('#ffffff')
    })

    it('应该处理已经很亮的颜色', () => {
      const result = lighten('#f0f0f0', 0.5)
      // 接近白色的颜色变亮应该变成白色
      expect(result).toBe('#f7f7f7')
    })
  })

  describe('不同颜色格式输入', () => {
    it('应该处理 RGB 字符串', () => {
      const result = lighten('rgb(255, 0, 0)', 0.3)
      expect(result).toBe('#ff4b3a')
    })

    it('应该处理 HSL 字符串', () => {
      const result = lighten('hsl(240, 100%, 50%)', 0.3)
      expect(result).toBe('#1863ff')
    })

    it('应该处理带透明度的颜色', () => {
      const result = lighten('rgba(255, 0, 0, 0.8)', 0.3)
      // 应该返回 8 位 Hex（包含透明度）
      expect(result).toBe('#ff4b3acc')
    })

    it('应该处理 3 位 Hex', () => {
      const result = lighten('#f00', 0.3)
      expect(result).toBe('#ff4b3a')
    })

    it('应该处理颜色名称', () => {
      const result = lighten('red', 0.3)
      expect(result).toBe('#ff4b3a')
    })
  })

  describe('函数式调整器', () => {
    it('应该支持自定义亮度调整函数', () => {
      const result = lighten('#ff0000', l => l + 0.3)
      // 直接增加 0.3 的亮度
      expect(result).toBe('#ff937a')
    })

    it('应该支持设置固定亮度值', () => {
      const result = lighten('#ff0000', () => 0.8)
      // 设置亮度为 0.8
      expect(result).toBe('#ff6450')
    })

    it('应该支持复杂的亮度计算', () => {
      const result = lighten('#808080', l => Math.min(1, l * 1.5))
      // 亮度乘以 1.5，但不超过 1
      expect(result).toBe('#dedede')
    })

    it('应该处理调整器返回负值', () => {
      const result = lighten('#ff0000', () => -0.1)
      // 负值应该被限制为 0
      expect(result).toBe('#100000')
    })

    it('应该处理调整器返回超过1的值', () => {
      const result = lighten('#808080', () => 1.5)
      // 超过 1 的值应该被限制为 1
      expect(result).toBe('#ffffff')
    })
  })

  describe('错误处理', () => {
    it('应该处理无效颜色字符串', () => {
      const result = lighten('invalid-color', 0.5)
      expect(result).toBe(null)
    })

    it('应该处理空字符串', () => {
      const result = lighten('', 0.5)
      expect(result).toBe(null)
    })

    it('应该处理 null 输入', () => {
      const result = lighten(null as any, 0.5)
      expect(result).toBe(null)
    })

    it('应该处理 undefined 输入', () => {
      const result = lighten(undefined as any, 0.5)
      expect(result).toBe(null)
    })
  })

  describe('透明度处理', () => {
    it('应该保持透明度不变', () => {
      const result = lighten('rgba(255, 0, 0, 0.5)', 0.3)
      // 透明度应该保持为 0.5 (80 in hex)
      expect(result).toBe('#ff4b3a80')
    })

    it('应该处理完全透明的颜色', () => {
      const result = lighten('rgba(255, 0, 0, 0)', 0.5)
      expect(result).toBe('#ff695400')
    })

    it('应该在透明度为1时返回6位Hex', () => {
      const result = lighten('rgba(255, 0, 0, 1)', 0.3)
      expect(result).toBe('#ff4b3a')
    })
  })

  describe('实际使用场景', () => {
    it('应该适合创建悬停效果', () => {
      const buttonColor = '#3498db'
      const hoverColor = lighten(buttonColor, 0.2)
      expect(hoverColor).toBe('#4daef2')
      expect(hoverColor).not.toBe(buttonColor)
    })

    it('应该适合创建高亮效果', () => {
      const textColor = '#2c3e50'
      const highlightColor = lighten(textColor, 0.6)
      expect(highlightColor).toBe('#99aec4')
      expect(highlightColor).not.toBe(textColor)
    })

    it('应该适合创建渐进的变亮效果', () => {
      const baseColor = '#e74c3c'
      const step1 = lighten(baseColor, 0.25)
      const step2 = lighten(baseColor, 0.5)
      const step3 = lighten(baseColor, 0.75)

      expect(step1).toBe('#ff6b59')
      expect(step2).toBe('#ff8a75')
      expect(step3).toBe('#ffa992')

      // 每一步都应该更亮
      expect(step1).not.toBe(baseColor)
      expect(step2).not.toBe(step1)
      expect(step3).not.toBe(step2)
    })
  })
})
