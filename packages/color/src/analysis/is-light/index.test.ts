import { describe, expect, it } from 'vitest'
import { isLight } from '.'

describe('isLight', () => {
  describe('基础颜色判断', () => {
    it('当传入白色时，必须判断为浅色', () => {
      const result = isLight('#FFFFFF')
      expect(result).toBe(true)
    })

    it('当传入黑色时，必须判断为深色', () => {
      const result = isLight('#000000')
      expect(result).toBe(false)
    })

    it('当传入中灰色时，必须判断为浅色', () => {
      const result = isLight('#808080')
      expect(result).toBe(true)
    })

    it('当传入深蓝色时，必须判断为深色', () => {
      const result = isLight('#000080')
      expect(result).toBe(false)
    })

    it('当传入亮黄色时，必须判断为浅色', () => {
      const result = isLight('yellow')
      expect(result).toBe(true)
    })
  })

  describe('多种输入格式支持', () => {
    it('当传入 RGB 对象时，必须正确判断', () => {
      const result = isLight({ r: 0, g: 0, b: 0 } as any)
      expect(result).toBe(false)
    })

    it('当传入 HSL 字符串时，必须正确判断', () => {
      const result = isLight('hsl(0, 0%, 100%)')
      expect(result).toBe(true)
    })

    it('当传入 culori 颜色对象时，必须正确判断', () => {
      const result = isLight({ mode: 'rgb', r: 1, g: 1, b: 1 })
      expect(result).toBe(true)
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      const result = isLight('invalid-color')
      expect(result).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      const result = isLight('')
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = isLight(null as any)
      expect(result).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      const result = isLight(undefined as any)
      expect(result).toBe(null)
    })

    it('当传入无法转换的对象时，必须返回 null', () => {
      const result = isLight({ invalid: 'object' } as any)
      expect(result).toBe(null)
    })
  })

  describe('与 isDark 的一致性', () => {
    it('当 isDark 返回 true 时，必须返回 false', () => {
      const result = isLight('#000000')
      expect(result).toBe(false)
    })

    it('当 isDark 返回 false 时，必须返回 true', () => {
      const result = isLight('#FFFFFF')
      expect(result).toBe(true)
    })

    it('当 isDark 返回 null 时，必须返回 null', () => {
      const result = isLight('invalid-color')
      expect(result).toBe(null)
    })
  })
})
