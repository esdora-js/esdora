import { describe, expect, it } from 'vitest'
import { saturate } from '.'

describe('saturate', () => {
  describe('基础饱和化功能', () => {
    it('应该按比例增加饱和度', () => {
      const result = saturate('#bf4040', 0.5)
      // 增加饱和度 50%
      expect(result).toBe('#df2020')
    })

    it('应该支持小数比例', () => {
      const result = saturate('#808080', 0.3)
      // 灰色增加饱和度 30%
      expect(result).toBe('#a65a5a')
    })

    it('应该支持百分比值（大于1）', () => {
      const result = saturate('#bf4040', 50) // 50% = 0.5
      // 增加饱和度 50%
      expect(result).toBe('#df2020')
    })
  })

  describe('边界情况处理', () => {
    it('应该处理 amount = 0（无变化）', () => {
      const result = saturate('#bf4040', 0)
      expect(result).toBe('#bf4040')
    })

    it('应该处理 amount = 1（完全饱和）', () => {
      const result = saturate('#bf4040', 1)
      // 完全饱和化
      expect(result).toBe('#ff0000')
    })

    it('应该处理已经饱和的颜色', () => {
      const result = saturate('#ff0000', 0.5)
      // 已经饱和的颜色应该保持不变
      expect(result).toBe('#ff0000')
    })

    it('应该处理灰色', () => {
      const result = saturate('#808080', 0.5)
      // 灰色增加饱和度
      expect(result).toBe('#c04141')
    })

    it('应该处理白色', () => {
      const result = saturate('#ffffff', 0.5)
      expect(result).toBe('#ffffff')
    })

    it('应该处理黑色', () => {
      const result = saturate('#000000', 0.5)
      expect(result).toBe('#000000')
    })
  })

  describe('不同颜色格式输入', () => {
    it('应该处理 RGB 字符串', () => {
      const result = saturate('rgb(191, 64, 64)', 0.3)
      expect(result).toBe('#d22d2d')
    })

    it('应该处理 HSL 字符串', () => {
      const result = saturate('hsl(0, 50%, 50%)', 0.3)
      expect(result).toBe('#d22d2d')
    })

    it('应该处理带透明度的颜色', () => {
      const result = saturate('rgba(191, 64, 64, 0.8)', 0.3)
      // 应该返回 8 位 Hex（包含透明度）
      expect(result).toBe('#d22d2dcc')
    })

    it('应该处理 3 位 Hex', () => {
      const result = saturate('#f00', 0.3)
      expect(result).toBe('#ff0000')
    })

    it('应该处理颜色名称', () => {
      const result = saturate('red', 0.3)
      expect(result).toBe('#ff0000')
    })
  })

  describe('函数式调整器', () => {
    it('应该支持自定义饱和度调整函数', () => {
      const result = saturate('#bf4040', s => s + 0.3)
      // 直接增加 0.3 的饱和度
      expect(result).toBe('#e51a1a')
    })

    it('应该支持设置固定饱和度值', () => {
      const result = saturate('#bf4040', () => 1.0)
      // 设置饱和度为 1.0（完全饱和）
      expect(result).toBe('#ff0000')
    })

    it('应该支持复杂的饱和度计算', () => {
      const result = saturate('#808080', s => Math.min(1, s + 0.5))
      // 增加饱和度，但不超过 1
      expect(result).toBe('#c04141')
    })

    it('应该处理调整器返回负值', () => {
      const result = saturate('#ff0000', () => -0.1)
      // 负值应该被限制为 0
      expect(result).toBe('#808080')
    })

    it('应该处理调整器返回超过1的值', () => {
      const result = saturate('#808080', () => 1.5)
      // 超过 1 的值应该被限制为 1
      expect(result).toBe('#ff0101')
    })
  })

  describe('错误处理', () => {
    it('应该处理无效颜色字符串', () => {
      const result = saturate('invalid-color', 0.5)
      expect(result).toBe(null)
    })

    it('应该处理空字符串', () => {
      const result = saturate('', 0.5)
      expect(result).toBe(null)
    })

    it('应该处理 null 输入', () => {
      const result = saturate(null as any, 0.5)
      expect(result).toBe(null)
    })

    it('应该处理 undefined 输入', () => {
      const result = saturate(undefined as any, 0.5)
      expect(result).toBe(null)
    })
  })

  describe('透明度处理', () => {
    it('应该保持透明度不变', () => {
      const result = saturate('rgba(191, 64, 64, 0.5)', 0.3)
      // 透明度应该保持为 0.5 (80 in hex)
      expect(result).toBe('#d22d2d80')
    })

    it('应该处理完全透明的颜色', () => {
      const result = saturate('rgba(191, 64, 64, 0)', 0.5)
      expect(result).toBe('#df202000')
    })

    it('应该在透明度为1时返回6位Hex', () => {
      const result = saturate('rgba(191, 64, 64, 1)', 0.3)
      expect(result).toBe('#d22d2d')
    })
  })

  describe('实际使用场景', () => {
    it('应该适合增强颜色鲜艳度', () => {
      const dullColor = '#9b9b9b'
      const vibrantColor = saturate(dullColor, 0.5)
      expect(vibrantColor).toBe('#cd6969')
      expect(vibrantColor).not.toBe(dullColor)
    })

    it('应该适合从灰度创建彩色', () => {
      const grayColor = '#808080'
      const colorfulColor = saturate(grayColor, 0.8)
      expect(colorfulColor).toBe('#e61a1a')
      expect(colorfulColor).not.toBe(grayColor)
    })

    it('应该适合创建渐进的饱和效果', () => {
      const baseColor = '#bf4040'
      const step1 = saturate(baseColor, 0.25)
      const step2 = saturate(baseColor, 0.5)
      const step3 = saturate(baseColor, 0.75)

      expect(step1).toBe('#cf3030')
      expect(step2).toBe('#df2020')
      expect(step3).toBe('#ef1010')

      // 每一步都应该更饱和
      expect(step1).not.toBe(baseColor)
      expect(step2).not.toBe(step1)
      expect(step3).not.toBe(step2)
    })
  })
})
