import { describe, expect, it } from 'vitest'
import { isInGamut } from '.'

describe('isInGamut', () => {
  describe('rgb 色域检查', () => {
    it('当传入标准 RGB 红色时，必须返回 true', () => {
      const result = isInGamut('#FF0000')
      expect(result).toBe(true)
    })

    it('当传入标准 RGB 绿色时，必须返回 true', () => {
      const result = isInGamut('#00FF00', 'rgb')
      expect(result).toBe(true)
    })

    it('当传入标准 RGB 蓝色时，必须返回 true', () => {
      const result = isInGamut('#0000FF', 'rgb')
      expect(result).toBe(true)
    })

    it('当传入白色时，必须返回 true', () => {
      const result = isInGamut('#FFFFFF', 'rgb')
      expect(result).toBe(true)
    })

    it('当传入黑色时，必须返回 true', () => {
      const result = isInGamut('#000000', 'rgb')
      expect(result).toBe(true)
    })
  })

  describe('p3 色域检查', () => {
    it('当传入标准红色时，必须在 P3 色域内', () => {
      const result = isInGamut('#FF0000', 'p3')
      expect(result).toBe(true)
    })

    it('当传入标准绿色时，必须在 P3 色域内', () => {
      const result = isInGamut('#00FF00', 'p3')
      expect(result).toBe(true)
    })

    it('当传入标准蓝色时，必须正确检查 P3 色域', () => {
      const result = isInGamut('#0000FF', 'p3')
      // 标准 sRGB 蓝色实际上不在 P3 色域内
      expect(result).toBe(false)
    })
  })

  describe('多种输入格式支持', () => {
    it('当传入 RGB 对象时，必须正确检查', () => {
      const result = isInGamut({ r: 255, g: 0, b: 0 } as any)
      expect(result).toBe(true)
    })

    it('当传入 HSL 字符串时，必须正确检查', () => {
      const result = isInGamut('hsl(0, 100%, 50%)')
      expect(result).toBe(true)
    })

    it('当传入 culori 颜色对象时，必须正确检查', () => {
      const result = isInGamut({ mode: 'rgb', r: 1, g: 0, b: 0 })
      expect(result).toBe(true)
    })
  })

  describe('默认参数处理', () => {
    it('当不指定色域时，必须默认使用 RGB', () => {
      const result1 = isInGamut('#FF0000')
      const result2 = isInGamut('#FF0000', 'rgb')
      expect(result1).toBe(result2)
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      const result = isInGamut('invalid-color')
      expect(result).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      const result = isInGamut('')
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = isInGamut(null as any)
      expect(result).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      const result = isInGamut(undefined as any)
      expect(result).toBe(null)
    })

    it('当传入无法转换的对象时，必须返回 null', () => {
      const result = isInGamut({ invalid: 'object' } as any)
      expect(result).toBe(null)
    })
  })

  describe('边界情况处理', () => {
    it('当色域转换失败时，必须返回 null', () => {
      const invalidColorObject = {
        mode: 'invalid',
        x: 999,
        y: 999,
        z: 999,
      } as any

      const result = isInGamut(invalidColorObject)
      expect(result).toBe(null)
    })
  })
})
