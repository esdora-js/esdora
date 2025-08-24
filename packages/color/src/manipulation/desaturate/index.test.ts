import { describe, expect, it } from 'vitest'
import { desaturate } from '.'

describe('desaturate', () => {
  describe('基础去饱和化功能', () => {
    it('应该按比例减少饱和度', () => {
      const result = desaturate('#ff0000', 0.5)
      // 红色去饱和化 50% 应该变成偏灰的红色
      expect(result).toBe('#bf4040')
    })

    it('应该支持小数比例', () => {
      const result = desaturate('#00ff00', 0.3)
      // 绿色去饱和化 30%
      expect(result).toBe('#26d926')
    })

    it('应该支持百分比值（大于1）', () => {
      const result = desaturate('#0000ff', 50) // 50% = 0.5
      // 蓝色去饱和化 50%
      expect(result).toBe('#4040bf')
    })
  })

  describe('边界情况处理', () => {
    it('应该处理 amount = 0（无变化）', () => {
      const result = desaturate('#ff0000', 0)
      expect(result).toBe('#ff0000')
    })

    it('应该处理 amount = 1（完全去饱和）', () => {
      const result = desaturate('#ff0000', 1)
      // 完全去饱和应该变成灰色
      expect(result).toBe('#808080')
    })

    it('应该处理已经是灰色的颜色', () => {
      const result = desaturate('#808080', 0.5)
      // 灰色去饱和化应该保持不变
      expect(result).toBe('#808080')
    })

    it('应该处理白色', () => {
      const result = desaturate('#ffffff', 0.5)
      expect(result).toBe('#ffffff')
    })

    it('应该处理黑色', () => {
      const result = desaturate('#000000', 0.5)
      expect(result).toBe('#000000')
    })
  })

  describe('不同颜色格式输入', () => {
    it('应该处理 RGB 字符串', () => {
      const result = desaturate('rgb(255, 0, 0)', 0.3)
      expect(result).toBe('#d92626')
    })

    it('应该处理 HSL 字符串', () => {
      const result = desaturate('hsl(120, 100%, 50%)', 0.3)
      expect(result).toBe('#26d926')
    })

    it('应该处理带透明度的颜色', () => {
      const result = desaturate('rgba(255, 0, 0, 0.8)', 0.3)
      // 应该返回 8 位 Hex（包含透明度）
      expect(result).toBe('#d92626cc')
    })

    it('应该处理 3 位 Hex', () => {
      const result = desaturate('#f00', 0.3)
      expect(result).toBe('#d92626')
    })

    it('应该处理颜色名称', () => {
      const result = desaturate('red', 0.3)
      expect(result).toBe('#d92626')
    })
  })

  describe('函数式调整器', () => {
    it('应该支持自定义饱和度调整函数', () => {
      const result = desaturate('#ff0000', s => s - 0.3)
      // 直接减少 0.3 的饱和度
      expect(result).toBe('#d92626')
    })

    it('应该支持设置固定饱和度值', () => {
      const result = desaturate('#ff0000', () => 0.5)
      // 设置饱和度为 0.5
      expect(result).toBe('#bf4040')
    })

    it('应该支持复杂的饱和度计算', () => {
      const result = desaturate('#00ff00', s => Math.max(0, s * 0.7))
      // 饱和度乘以 0.7，但不低于 0
      expect(result).toBe('#26d926')
    })

    it('应该处理调整器返回负值', () => {
      const result = desaturate('#ff0000', () => -0.1)
      // 负值应该被限制为 0
      expect(result).toBe('#808080')
    })

    it('应该处理调整器返回超过1的值', () => {
      const result = desaturate('#808080', () => 1.5)
      // 超过 1 的值应该被限制为 1
      expect(result).toBe('#ff0101')
    })
  })

  describe('错误处理', () => {
    it('应该处理无效颜色字符串', () => {
      const result = desaturate('invalid-color', 0.5)
      expect(result).toBe(null)
    })

    it('应该处理空字符串', () => {
      const result = desaturate('', 0.5)
      expect(result).toBe(null)
    })

    it('应该处理 null 输入', () => {
      const result = desaturate(null as any, 0.5)
      expect(result).toBe(null)
    })

    it('应该处理 undefined 输入', () => {
      const result = desaturate(undefined as any, 0.5)
      expect(result).toBe(null)
    })
  })

  describe('透明度处理', () => {
    it('应该保持透明度不变', () => {
      const result = desaturate('rgba(255, 0, 0, 0.5)', 0.3)
      // 透明度应该保持为 0.5 (80 in hex)
      expect(result).toBe('#d9262680')
    })

    it('应该处理完全透明的颜色', () => {
      const result = desaturate('rgba(255, 0, 0, 0)', 0.5)
      expect(result).toBe('#bf404000')
    })

    it('应该在透明度为1时返回6位Hex', () => {
      const result = desaturate('rgba(255, 0, 0, 1)', 0.3)
      expect(result).toBe('#d92626')
    })
  })

  describe('实际使用场景', () => {
    it('应该适合创建柔和的UI颜色', () => {
      const primaryColor = '#3498db'
      const softColor = desaturate(primaryColor, 0.2)
      expect(softColor).toBe('#4595ca')
      expect(softColor).not.toBe(primaryColor)
    })

    it('应该适合创建禁用状态的颜色', () => {
      const activeColor = '#e74c3c'
      const disabledColor = desaturate(activeColor, 0.6)
      expect(disabledColor).toBe('#b4766f')
      expect(disabledColor).not.toBe(activeColor)
    })

    it('应该适合创建灰度效果', () => {
      const colorfulColor = '#9b59b6'
      const grayishColor = desaturate(colorfulColor, 0.8)
      expect(grayishColor).toBe('#8b7e91')
      expect(grayishColor).not.toBe(colorfulColor)
    })

    it('应该适合创建渐进的去饱和效果', () => {
      const baseColor = '#f39c12'
      const step1 = desaturate(baseColor, 0.25)
      const step2 = desaturate(baseColor, 0.5)
      const step3 = desaturate(baseColor, 0.75)

      expect(step1).toBe('#d7962e')
      expect(step2).toBe('#bb8f4a')
      expect(step3).toBe('#9f8966')

      // 每一步都应该更接近灰色
      expect(step1).not.toBe(baseColor)
      expect(step2).not.toBe(step1)
      expect(step3).not.toBe(step2)
    })
  })
})
