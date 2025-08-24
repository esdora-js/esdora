import { describe, expect, it } from 'vitest'
import { clamp } from './index'

describe('clamp', () => {
  describe('基础功能', () => {
    it('应该返回在范围内的数字', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(3.5, 1, 8)).toBe(3.5)
      expect(clamp(0, -5, 5)).toBe(0)
    })

    it('应该将小于最小值的数字限制为最小值', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(0.5, 1, 8)).toBe(1)
      expect(clamp(-10, -5, 5)).toBe(-5)
    })

    it('应该将大于最大值的数字限制为最大值', () => {
      expect(clamp(15, 0, 10)).toBe(10)
      expect(clamp(10, 1, 8)).toBe(8)
      expect(clamp(20, -5, 5)).toBe(5)
    })
  })

  describe('边界值测试', () => {
    it('应该正确处理等于边界值的情况', () => {
      expect(clamp(0, 0, 10)).toBe(0)
      expect(clamp(10, 0, 10)).toBe(10)
      expect(clamp(5, 5, 5)).toBe(5) // min === max === number
    })

    it('应该处理负数范围', () => {
      expect(clamp(-3, -10, -1)).toBe(-3)
      expect(clamp(-15, -10, -1)).toBe(-10)
      expect(clamp(0, -10, -1)).toBe(-1)
    })

    it('应该处理小数', () => {
      expect(clamp(0.5, 0.1, 0.9)).toBe(0.5)
      expect(clamp(0.05, 0.1, 0.9)).toBe(0.1)
      expect(clamp(0.95, 0.1, 0.9)).toBe(0.9)
    })
  })

  describe('默认参数', () => {
    it('应该使用默认范围 [0, 1]', () => {
      expect(clamp(0.5)).toBe(0.5)
      expect(clamp(0)).toBe(0)
      expect(clamp(1)).toBe(1)
    })

    it('应该将超出默认范围的值限制在 [0, 1] 内', () => {
      expect(clamp(-0.5)).toBe(0)
      expect(clamp(1.5)).toBe(1)
      expect(clamp(2)).toBe(1)
      expect(clamp(-1)).toBe(0)
    })

    it('应该支持只提供 min 参数', () => {
      expect(clamp(0.5, 0.2)).toBe(0.5)
      expect(clamp(0.1, 0.2)).toBe(0.2)
      expect(clamp(1.5, 0.2)).toBe(1) // max 默认为 1
    })
  })

  describe('参数顺序健壮性', () => {
    it('应该正确处理 min > max 的情况', () => {
      expect(clamp(5, 10, 0)).toBe(5) // 相当于 clamp(5, 0, 10)
      expect(clamp(-5, 10, 0)).toBe(0)
      expect(clamp(15, 10, 0)).toBe(10)
    })

    it('应该处理 min === max 的情况', () => {
      expect(clamp(5, 3, 3)).toBe(3)
      expect(clamp(1, 3, 3)).toBe(3)
      expect(clamp(10, 3, 3)).toBe(3)
    })
  })

  describe('特殊数值', () => {
    it('应该处理 NaN', () => {
      expect(clamp(Number.NaN, 0, 10)).toBeNaN()
      expect(clamp(5, Number.NaN, 10)).toBeNaN()
      expect(clamp(5, 0, Number.NaN)).toBeNaN()
    })

    it('应该处理 Infinity', () => {
      expect(clamp(Infinity, 0, 10)).toBe(10)
      expect(clamp(-Infinity, 0, 10)).toBe(0)
      expect(clamp(5, -Infinity, 10)).toBe(5)
      expect(clamp(5, 0, Infinity)).toBe(5)
    })

    it('应该处理零值', () => {
      expect(clamp(0, -1, 1)).toBe(0)
      expect(clamp(-0, -1, 1)).toBe(-0)
      expect(clamp(0, 0, 0)).toBe(0)
    })

    it('应该处理非常小的数字', () => {
      expect(clamp(Number.EPSILON, 0, 1)).toBe(Number.EPSILON)
      expect(clamp(Number.MIN_VALUE, 0, 1)).toBe(Number.MIN_VALUE)
    })

    it('应该处理非常大的数字', () => {
      expect(clamp(Number.MAX_VALUE, 0, 1)).toBe(1)
      expect(clamp(Number.MAX_SAFE_INTEGER, 0, 100)).toBe(100)
    })
  })

  describe('实际使用场景', () => {
    it('应该适用于百分比计算', () => {
      expect(clamp(0.5, 0, 1)).toBe(0.5) // 50%
      expect(clamp(1.2, 0, 1)).toBe(1) // 120% -> 100%
      expect(clamp(-0.1, 0, 1)).toBe(0) // -10% -> 0%
    })

    it('应该适用于音量控制', () => {
      expect(clamp(50, 0, 100)).toBe(50) // 音量 50
      expect(clamp(150, 0, 100)).toBe(100) // 音量超过最大值
      expect(clamp(-10, 0, 100)).toBe(0) // 音量低于最小值
    })

    it('应该适用于颜色值限制', () => {
      expect(clamp(128, 0, 255)).toBe(128) // RGB 值
      expect(clamp(300, 0, 255)).toBe(255) // 超出 RGB 范围
      expect(clamp(-50, 0, 255)).toBe(0) // 低于 RGB 范围
    })

    it('应该适用于动画进度', () => {
      expect(clamp(0.3, 0, 1)).toBe(0.3) // 30% 进度
      expect(clamp(1.1, 0, 1)).toBe(1) // 超过 100%
      expect(clamp(-0.1, 0, 1)).toBe(0) // 负进度
    })
  })

  describe('性能和精度', () => {
    it('应该保持数字精度', () => {
      const precise = 0.1 + 0.2 // 0.30000000000000004
      expect(clamp(precise, 0, 1)).toBe(precise)
    })

    it('应该处理极小的范围', () => {
      expect(clamp(0.5, 0.4999999, 0.5000001)).toBe(0.5)
      expect(clamp(0.4, 0.4999999, 0.5000001)).toBe(0.4999999)
      expect(clamp(0.6, 0.4999999, 0.5000001)).toBe(0.5000001)
    })
  })
})
