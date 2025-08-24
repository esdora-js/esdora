import { describe, expect, it } from 'vitest'
import { toHsl } from '.'

describe('toHsl', () => {
  describe('基础转换功能', () => {
    it('当传入红色十六进制时，必须转换为 HSL 对象', () => {
      const result = toHsl('#FF0000')
      expect(result).toEqual({ h: 0, s: 100, l: 50 })
    })

    it('当传入 RGB 字符串时，必须转换为 HSL 对象', () => {
      const result = toHsl('rgb(255, 0, 0)')
      expect(result).toEqual({ h: 0, s: 100, l: 50 })
    })

    it('当传入 RGB 对象时，必须转换为 HSL 对象', () => {
      const result = toHsl({ r: 255, g: 0, b: 0, mode: 'rgb' })
      expect(result).toEqual({ h: 0, s: 100, l: 50 })
    })

    it('当传入 HSL 字符串时，必须正确处理', () => {
      const result = toHsl('hsl(0, 100%, 50%)')
      expect(result).toEqual({ h: 0, s: 100, l: 50 })
    })

    it('当传入不同颜色时，必须正确转换', () => {
      expect(toHsl('#00FF00')).toEqual({ h: 120, s: 100, l: 50 })
      expect(toHsl('#0000FF')).toEqual({ h: 240, s: 100, l: 50 })
      expect(toHsl('#FFFFFF')).toEqual({ h: 0, s: 0, l: 100 })
      expect(toHsl('#000000')).toEqual({ h: 0, s: 0, l: 0 })
    })
  })

  describe('特殊格式处理', () => {
    it('当传入带透明度的颜色时，必须保留透明度信息', () => {
      const result = toHsl('rgba(255, 0, 0, 0.5)')
      expect(result).toEqual({ h: 0, s: 100, l: 50, a: 0.5 })
    })

    it('当传入短格式十六进制时，必须正确转换', () => {
      const result = toHsl('#f00')
      expect(result).toEqual({ h: 0, s: 100, l: 50 })
    })

    it('当传入灰度颜色时，必须正确处理', () => {
      const result = toHsl('#808080')
      expect(result).toEqual({ h: 0, s: 0, l: 50 })
    })

    it('当透明度为 1 时，必须不包含 alpha 属性', () => {
      const result = toHsl('rgba(255, 0, 0, 1)')
      expect(result).toEqual({ h: 0, s: 100, l: 50 })
      expect(result).not.toHaveProperty('a')
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      expect(toHsl('invalid-color')).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      expect(toHsl('')).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      expect(toHsl(null as any)).toBe(null)
    })
  })

  describe('边界情况处理', () => {
    it('当传入可能有 undefined 值的颜色时，必须正确处理', () => {
      const result = toHsl('#808080')
      expect(result).toEqual({ h: 0, s: 0, l: 50 })
    })

    it('当颜色转换失败时，必须返回 null', () => {
      const invalidModeColor = { mode: 'invalid', r: 0.5, g: 0.5, b: 0.5 } as any
      const result = toHsl(invalidModeColor)
      expect(result).toBe(null)
    })

    it('当 HSL 值为 undefined 时，必须使用默认值', () => {
      const edgeCaseColor = {
        mode: 'hsl',
        h: 0,
        s: undefined,
        l: undefined,
      } as any

      const result = toHsl(edgeCaseColor)
      expect(result).toEqual({ h: 0, s: 0, l: 0 })
    })
  })
})
