import { describe, expect, it } from 'vitest'
import { toRgbString } from '.'

describe('toRgbString', () => {
  describe('基础转换功能', () => {
    it('当传入红色十六进制时，必须转换为 RGB 字符串', () => {
      const result = toRgbString('#FF0000')
      expect(result).toBe('rgb(255, 0, 0)')
    })

    it('当传入 HSL 字符串时，必须转换为 RGB 字符串', () => {
      const result = toRgbString('hsl(0, 100%, 50%)')
      expect(result).toBe('rgb(255, 0, 0)')
    })

    it('当传入 HSL 对象时，必须转换为 RGB 字符串', () => {
      const result = toRgbString({ h: 0, s: 100, l: 50 })
      expect(result).toBe('rgb(255, 0, 0)')
    })

    it('当传入 RGB 对象时，必须正确处理', () => {
      const result = toRgbString({ r: 255, g: 0, b: 0 })
      expect(result).toBe('rgb(255, 0, 0)')
    })

    it('当传入不同颜色时，必须正确转换', () => {
      expect(toRgbString('#00FF00')).toBe('rgb(0, 255, 0)') // 绿色
      expect(toRgbString('#0000FF')).toBe('rgb(0, 0, 255)') // 蓝色
      expect(toRgbString('#FFFFFF')).toBe('rgb(255, 255, 255)') // 白色
      expect(toRgbString('#000000')).toBe('rgb(0, 0, 0)') // 黑色
    })
  })

  describe('特殊格式处理', () => {
    it('当传入带透明度的颜色时，必须保留透明度信息', () => {
      const result = toRgbString('hsla(0, 100%, 50%, 0.5)')
      expect(result).toBe('rgba(255, 0, 0, 0.5)')
    })

    it('当传入短格式十六进制时，必须正确转换', () => {
      const result = toRgbString('#f00')
      expect(result).toBe('rgb(255, 0, 0)')
    })

    it('当传入灰度颜色时，必须正确处理', () => {
      const result = toRgbString('#808080')
      expect(result).toBe('rgb(128, 128, 128)')
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      const result = toRgbString('invalid-color')
      expect(result).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      const result = toRgbString('')
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = toRgbString(null as any)
      expect(result).toBe(null)
    })
  })

  describe('边界情况处理', () => {
    it('当透明度为 1 时，必须不包含 alpha 值', () => {
      const result = toRgbString('rgba(255, 0, 0, 1)')
      expect(result).toBe('rgb(255, 0, 0)')
    })

    it('当传入可能有 undefined 值的颜色时，必须正确处理', () => {
      const result = toRgbString('#808080')
      expect(result).toBe('rgb(128, 128, 128)')
    })

    it('当颜色转换失败时，必须返回 null', () => {
      const invalidModeColor = { mode: 'invalid', r: 0.5, g: 0.5, b: 0.5 } as any
      const result = toRgbString(invalidModeColor)
      expect(result).toBe(null)
    })
  })
})
