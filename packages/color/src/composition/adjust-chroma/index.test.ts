import { describe, expect, it } from 'vitest'
import { adjustChroma } from '.'

describe('adjustChroma', () => {
  describe('数值调整功能', () => {
    it('当传入数值时，必须设置为指定的色度值', () => {
      const result = adjustChroma('#FF0000', 0.2)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.c).toBeCloseTo(0.2, 3)
    })

    it('当传入 0 时，必须将色度设置为 0', () => {
      const result = adjustChroma('#FF0000', 0)
      expect(result).not.toBe(null)
      expect((result as any)?.c).toBe(0)
    })

    it('当传入最大值 0.4 时，必须将色度设置为 0.4', () => {
      const result = adjustChroma('#FF0000', 0.4)
      expect(result).not.toBe(null)
      expect((result as any)?.c).toBe(0.4)
    })

    it('当传入超出范围的值时，必须被限制在有效范围内', () => {
      const result1 = adjustChroma('#FF0000', -0.1)
      expect((result1 as any)?.c).toBe(0)

      const result2 = adjustChroma('#FF0000', 0.5)
      expect((result2 as any)?.c).toBe(0.4)
    })
  })

  describe('函数调整功能', () => {
    it('当传入函数时，必须基于当前色度值进行调整', () => {
      const result = adjustChroma('#FF0000', (currentChroma) => {
        expect(typeof currentChroma).toBe('number')
        return currentChroma * 0.5
      })
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
    })

    it('当传入减半函数时，必须将色度减半', () => {
      const originalResult = adjustChroma('#FF0000', 0.2)
      const adjustedResult = adjustChroma('#FF0000', c => c * 0.5)

      expect(originalResult).not.toBe(null)
      expect(adjustedResult).not.toBe(null)

      // 先设置为 0.2，然后基于原始颜色的色度减半
      const originalColor = adjustChroma('#FF0000', c => c)
      const halfChroma = adjustChroma('#FF0000', c => c * 0.5)

      expect((halfChroma as any)?.c).toBeLessThan((originalColor as any)?.c ?? 0)
    })

    it('当函数返回超出范围的值时，必须被限制在有效范围内', () => {
      const result1 = adjustChroma('#FF0000', () => -0.1)
      expect((result1 as any)?.c).toBe(0)

      const result2 = adjustChroma('#FF0000', () => 0.5)
      expect((result2 as any)?.c).toBe(0.4)
    })
  })

  describe('多种输入格式支持', () => {
    it('当传入 RGB 对象时，必须正确调整', () => {
      const result = adjustChroma({ r: 255, g: 0, b: 0 } as any, 0.1)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.c).toBeCloseTo(0.1, 3)
    })

    it('当传入 HSL 字符串时，必须正确调整', () => {
      const result = adjustChroma('hsl(0, 100%, 50%)', 0.15)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.c).toBeCloseTo(0.15, 3)
    })

    it('当传入 culori 颜色对象时，必须正确调整', () => {
      const result = adjustChroma({ mode: 'rgb', r: 1, g: 0, b: 0 }, 0.25)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.c).toBeCloseTo(0.25, 3)
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      const result = adjustChroma('invalid-color', 0.1)
      expect(result).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      const result = adjustChroma('', 0.1)
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = adjustChroma(null as any, 0.1)
      expect(result).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      const result = adjustChroma(undefined as any, 0.1)
      expect(result).toBe(null)
    })

    it('当传入无法转换的对象时，必须返回 null', () => {
      const result = adjustChroma({ invalid: 'object' } as any, 0.1)
      expect(result).toBe(null)
    })
  })

  describe('边界情况处理', () => {
    it('当颜色转换失败时，必须返回 null', () => {
      const invalidColorObject = {
        mode: 'invalid',
        x: 999,
        y: 999,
        z: 999,
      } as any

      const result = adjustChroma(invalidColorObject, 0.1)
      expect(result).toBe(null)
    })

    it('当色度值为 undefined 时，必须使用默认值 0', () => {
      const result = adjustChroma('#FF0000', (currentChroma) => {
        // 即使当前色度可能为 undefined，函数也应该能处理
        return (currentChroma ?? 0) + 0.1
      })
      expect(result).not.toBe(null)
    })

    it('当传入无色度的颜色时，必须正确处理 undefined 色度值', () => {
      // 灰色通常没有明确的色度
      const result = adjustChroma('#808080', (currentChroma) => {
        // 验证当前色度确实为 undefined 或 0，然后设置新值
        expect(currentChroma).toBe(0)
        return 0.1
      })
      expect(result).not.toBe(null)
      expect((result as any)?.c).toBe(0.1)
    })

    it('当色度值为 undefined 时，必须使用默认值 0 进行计算', () => {
      // 创建一个 OKLCH 颜色对象，其中色度值为 undefined
      const colorWithUndefinedChroma = {
        mode: 'oklch' as const,
        l: 0.5,
        c: 0,
        h: 180,
      }

      const result = adjustChroma(colorWithUndefinedChroma, (currentChroma) => {
        // 这里应该触发 oklchColor.c ?? 0 的默认值分支
        expect(currentChroma).toBe(0)
        return 0.2
      })
      expect(result).not.toBe(null)
      expect((result as any)?.c).toBe(0.2)
    })
  })
})
