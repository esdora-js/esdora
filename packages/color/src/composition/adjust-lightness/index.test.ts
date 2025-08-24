import { describe, expect, it } from 'vitest'
import { adjustLightness } from '.'

describe('adjustLightness', () => {
  describe('函数调整器功能', () => {
    it('当传入函数调整器时，必须基于当前亮度进行调整', () => {
      const result = adjustLightness('#ff0000', l => l * 0.5)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
    })

    it('当函数返回 0 时，必须将亮度设置为 0', () => {
      const result = adjustLightness('#ff0000', () => 0)
      expect(result).not.toBe(null)
      expect((result as any)?.l).toBe(0)
    })

    it('当函数返回 1 时，必须将亮度设置为 1', () => {
      const result = adjustLightness('#ff0000', () => 1)
      expect(result).not.toBe(null)
      expect((result as any)?.l).toBe(1)
    })

    it('当函数返回超出范围的值时，必须被限制在有效范围内', () => {
      const result1 = adjustLightness('#ff0000', () => -0.5)
      expect((result1 as any)?.l).toBe(0)

      const result2 = adjustLightness('#ff0000', () => 1.5)
      expect((result2 as any)?.l).toBe(1)
    })
  })

  describe('数值调整器功能', () => {
    it('当传入数值时，必须直接设置为指定亮度', () => {
      const result = adjustLightness('#ff0000', 0.5)
      expect(result).not.toBe(null)
      expect((result as any)?.l).toBe(0.5)
    })

    it('当传入超过 1 的值时，必须被限制为 1', () => {
      const result = adjustLightness('#ff0000', 1.5)
      expect(result).not.toBe(null)
      expect((result as any)?.l).toBe(1)
    })

    it('当传入小于 0 的值时，必须被限制为 0', () => {
      const result = adjustLightness('#ff0000', -0.5)
      expect(result).not.toBe(null)
      expect((result as any)?.l).toBe(0)
    })

    it('当传入边界值时，必须正确处理', () => {
      const result1 = adjustLightness('#ff0000', 0)
      expect((result1 as any)?.l).toBe(0)

      const result2 = adjustLightness('#ff0000', 1)
      expect((result2 as any)?.l).toBe(1)
    })
  })

  describe('多种输入格式支持', () => {
    it('当传入 RGB 对象时，必须正确调整', () => {
      const result = adjustLightness({ r: 255, g: 0, b: 0 } as any, 0.3)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.l).toBe(0.3)
    })

    it('当传入 HSL 字符串时，必须正确调整', () => {
      const result = adjustLightness('hsl(0, 100%, 50%)', 0.7)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.l).toBe(0.7)
    })

    it('当传入 culori 颜色对象时，必须正确调整', () => {
      const result = adjustLightness({ mode: 'rgb', r: 1, g: 0, b: 0 }, 0.2)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.l).toBe(0.2)
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      const result = adjustLightness('invalid-color', 0.5)
      expect(result).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      const result = adjustLightness('', 0.5)
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = adjustLightness(null as any, 0.5)
      expect(result).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      const result = adjustLightness(undefined as any, 0.5)
      expect(result).toBe(null)
    })

    it('当传入无法转换的对象时，必须返回 null', () => {
      const result = adjustLightness({ invalid: 'object' } as any, 0.5)
      expect(result).toBe(null)
    })
  })

  describe('边界情况处理', () => {
    it('当颜色转换失败时，必须返回 null', () => {
      const invalidModeColor = { mode: 'invalid', r: 0.5, g: 0.5, b: 0.5 } as any
      const result = adjustLightness(invalidModeColor, 0.5)
      expect(result).toBe(null)
    })
  })
})
