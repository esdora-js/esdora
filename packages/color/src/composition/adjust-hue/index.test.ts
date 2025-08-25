import { describe, expect, it } from 'vitest'
import { adjustHue } from '.'

describe('adjustHue', () => {
  describe('数值调整功能', () => {
    it('当传入数值时，必须设置为指定的色相值', () => {
      const result = adjustHue('#FF0000', 180)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.h).toBeCloseTo(180, 1)
    })

    it('当传入 0 时，必须将色相设置为 0', () => {
      const result = adjustHue('#FF0000', 0)
      expect(result).not.toBe(null)
      expect((result as any)?.h).toBeCloseTo(0, 1)
    })

    it('当传入 360 时，必须将色相标准化为 0', () => {
      const result = adjustHue('#FF0000', 360)
      expect(result).not.toBe(null)
      expect((result as any)?.h).toBeCloseTo(0, 1)
    })

    it('当传入超出 360 度的值时，必须正确标准化', () => {
      const result1 = adjustHue('#FF0000', 450) // 450 - 360 = 90
      expect((result1 as any)?.h).toBeCloseTo(90, 1)

      const result2 = adjustHue('#FF0000', 720) // 720 - 720 = 0
      expect((result2 as any)?.h).toBeCloseTo(0, 1)
    })

    it('当传入负值时，必须正确标准化', () => {
      const result1 = adjustHue('#FF0000', -30) // -30 + 360 = 330
      expect((result1 as any)?.h).toBeCloseTo(330, 1)

      const result2 = adjustHue('#FF0000', -390) // -390 + 720 = 330
      expect((result2 as any)?.h).toBeCloseTo(330, 1)
    })
  })

  describe('函数调整功能', () => {
    it('当传入函数时，必须基于当前色相值进行调整', () => {
      const result = adjustHue('#FF0000', (currentHue) => {
        expect(typeof currentHue).toBe('number')
        return currentHue + 30
      })
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
    })

    it('当传入增加 30 度的函数时，必须正确调整色相', () => {
      const result = adjustHue('#FF0000', h => h + 30)
      expect(result).not.toBe(null)

      // 获取原始色相
      const originalResult = adjustHue('#FF0000', h => h)
      expect(originalResult).not.toBe(null)

      const expectedHue = (((originalResult as any)?.h ?? 0) + 30) % 360
      expect((result as any)?.h).toBeCloseTo(expectedHue, 1)
    })

    it('当函数返回超出范围的值时，必须正确标准化', () => {
      const result1 = adjustHue('#FF0000', () => 450)
      expect((result1 as any)?.h).toBeCloseTo(90, 1)

      const result2 = adjustHue('#FF0000', () => -30)
      expect((result2 as any)?.h).toBeCloseTo(330, 1)
    })
  })

  describe('多种输入格式支持', () => {
    it('当传入 RGB 对象时，必须正确调整', () => {
      const result = adjustHue({ r: 255, g: 0, b: 0 } as any, 120)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.h).toBeCloseTo(120, 1)
    })

    it('当传入 HSL 字符串时，必须正确调整', () => {
      const result = adjustHue('hsl(0, 100%, 50%)', 240)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.h).toBeCloseTo(240, 1)
    })

    it('当传入 culori 颜色对象时，必须正确调整', () => {
      const result = adjustHue({ mode: 'rgb', r: 1, g: 0, b: 0 }, 60)
      expect(result).not.toBe(null)
      expect(result?.mode).toBe('oklch')
      expect((result as any)?.h).toBeCloseTo(60, 1)
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      const result = adjustHue('invalid-color', 180)
      expect(result).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      const result = adjustHue('', 180)
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = adjustHue(null as any, 180)
      expect(result).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      const result = adjustHue(undefined as any, 180)
      expect(result).toBe(null)
    })

    it('当传入无法转换的对象时，必须返回 null', () => {
      const result = adjustHue({ invalid: 'object' } as any, 180)
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

      const result = adjustHue(invalidColorObject, 180)
      expect(result).toBe(null)
    })

    it('当色相值为 undefined 时，必须使用默认值 0', () => {
      const result = adjustHue('#FF0000', (currentHue) => {
        // 即使当前色相可能为 undefined，函数也应该能处理
        return (currentHue ?? 0) + 90
      })
      expect(result).not.toBe(null)
    })

    it('当处理无色相的颜色时，必须正确处理', () => {
      // 灰色通常没有明确的色相
      const result = adjustHue('#808080', 180)
      expect(result).not.toBe(null)
      expect((result as any)?.h).toBeCloseTo(180, 1)
    })

    it('当传入无色相的颜色并使用函数调整器时，必须正确处理 undefined 色相值', () => {
      // 灰色通常没有明确的色相
      const result = adjustHue('#808080', (currentHue) => {
        // 验证当前色相确实为 undefined 或 0，然后设置新值
        expect(currentHue).toBe(0)
        return 90
      })
      expect(result).not.toBe(null)
      expect((result as any)?.h).toBeCloseTo(90, 1)
    })
  })
})
