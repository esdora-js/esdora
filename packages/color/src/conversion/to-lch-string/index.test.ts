import { describe, expect, it } from 'vitest'
import { toLchString } from '.'

describe('toLchString', () => {
  describe('基础转换功能', () => {
    it('当传入红色十六进制时，必须转换为 LCH 字符串', () => {
      const result = toLchString('#FF0000')
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ [\d.]+\)$/)
      expect(result).toContain('lch(')
    })

    it('当传入绿色十六进制时，必须转换为 LCH 字符串', () => {
      const result = toLchString('#00FF00')
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ [\d.]+\)$/)
      expect(result).toContain('lch(')
    })

    it('当传入蓝色十六进制时，必须转换为 LCH 字符串', () => {
      const result = toLchString('#0000FF')
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ [\d.]+\)$/)
      expect(result).toContain('lch(')
    })

    it('当传入白色时，必须转换为 LCH 字符串', () => {
      const result = toLchString('#FFFFFF')
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ (?:[\d.]+|none)\)$/)
      expect(result).toContain('lch(')
    })

    it('当传入黑色时，必须转换为 LCH 字符串', () => {
      const result = toLchString('#000000')
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ (?:[\d.]+|none)\)$/)
      expect(result).toContain('lch(')
    })
  })

  describe('多种输入格式支持', () => {
    it('当传入 RGB 字符串时，必须转换为 LCH 字符串', () => {
      const result = toLchString('rgb(255, 0, 0)')
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ (?:[\d.]+|none)\)$/)
    })

    it('当传入 RGB 对象时，必须转换为 LCH 字符串', () => {
      const result = toLchString({ r: 255, g: 0, b: 0 } as any)
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ (?:[\d.]+|none)\)$/)
    })

    it('当传入 HSL 字符串时，必须转换为 LCH 字符串', () => {
      const result = toLchString('hsl(0, 100%, 50%)')
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ (?:[\d.]+|none)\)$/)
    })

    it('当传入 HSL 对象时，必须转换为 LCH 字符串', () => {
      const result = toLchString({ h: 0, s: 100, l: 50 } as any)
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ (?:[\d.]+|none)\)$/)
    })

    it('当传入 culori 颜色对象时，必须转换为 LCH 字符串', () => {
      const result = toLchString({ mode: 'rgb', r: 1, g: 0, b: 0 })
      expect(typeof result).toBe('string')
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ (?:[\d.]+|none)\)$/)
    })
  })

  describe('透明度处理', () => {
    it('当传入带透明度的颜色时，必须包含 alpha 值', () => {
      const result = toLchString('rgba(255, 0, 0, 0.5)')
      expect(result).toMatch(/^lch\([\d.]+ [\d.]+ [\d.]+ \/ [\d.]+\)$/)
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      const result = toLchString('invalid-color')
      expect(result).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      const result = toLchString('')
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = toLchString(null as any)
      expect(result).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      const result = toLchString(undefined as any)
      expect(result).toBe(null)
    })

    it('当传入无法转换的对象时，必须返回 null', () => {
      const result = toLchString({ invalid: 'object' } as any)
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

      const result = toLchString(invalidColorObject)
      expect(result).toBe(null)
    })
  })
})
