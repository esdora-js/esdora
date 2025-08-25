import { describe, expect, it } from 'vitest'
import { isDark } from '.'

describe('isDark', () => {
  describe('基础颜色判断', () => {
    it('当传入白色时，必须判断为浅色', () => {
      const result = isDark('#FFFFFF')
      expect(result).toBe(false)
    })

    it('当传入黑色时，必须判断为深色', () => {
      const result = isDark('#000000')
      expect(result).toBe(true)
    })

    it('当传入中灰色时，必须判断为浅色', () => {
      const result = isDark('#808080')
      expect(result).toBe(false)
    })

    it('当传入深蓝色时，必须判断为深色', () => {
      const result = isDark('#000080')
      expect(result).toBe(true)
    })

    it('当传入亮黄色时，必须判断为浅色', () => {
      const result = isDark('yellow')
      expect(result).toBe(false)
    })
  })

  describe('多种输入格式支持', () => {
    it('当传入 RGB 对象时，必须正确判断', () => {
      const result = isDark({ r: 255, g: 255, b: 255 } as any)
      expect(result).toBe(false)
    })

    it('当传入 HSL 字符串时，必须正确判断', () => {
      const result = isDark('hsl(0, 0%, 0%)')
      expect(result).toBe(true)
    })

    it('当传入 culori 颜色对象时，必须正确判断', () => {
      const result = isDark({ mode: 'rgb', r: 0, g: 0, b: 0 })
      expect(result).toBe(true)
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      const result = isDark('invalid-color')
      expect(result).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      const result = isDark('')
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = isDark(null as any)
      expect(result).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      const result = isDark(undefined as any)
      expect(result).toBe(null)
    })

    it('当传入无法转换的对象时，必须返回 null', () => {
      const result = isDark({ invalid: 'object' } as any)
      expect(result).toBe(null)
    })
  })

  describe('边界情况处理', () => {
    it('当 OKLCH 亮度值为 undefined 时，必须使用默认值 1 判断为浅色', () => {
      const edgeCaseColor = {
        mode: 'oklch',
        l: undefined,
        c: 0,
        h: 0,
      } as any

      const result = isDark(edgeCaseColor)
      expect(result).toBe(false)
    })

    it('当亮度值恰好为阈值 0.5 时，必须判断为浅色', () => {
      const thresholdColor = {
        mode: 'oklch' as const,
        l: 0.5,
        c: 0,
        h: 0,
      }

      const result = isDark(thresholdColor)
      expect(result).toBe(false)
    })

    it('当颜色转换为 OKLCH 失败时，必须返回 null', () => {
      // 创建一个会导致 oklch 转换失败的颜色对象
      // 使用一个真正会导致转换失败的无效对象
      const invalidColorForOklch = {
        mode: 'invalid-mode' as any,
        invalid: true,
      }

      const result = isDark(invalidColorForOklch as any)
      expect(result).toBe(null)
    })
  })
})
