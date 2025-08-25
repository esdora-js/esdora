import { describe, expect, it } from 'vitest'
import { parseColor } from './parser'

describe('parseColor', () => {
  describe('自定义归一化逻辑验证', () => {
    it('当传入无 mode 的 RGB 对象时，必须正确归一化 0-255 范围的值', () => {
      const rgbObj = {
        r: 255,
        g: 128,
        b: 64,
      }

      const result = parseColor(rgbObj)
      expect(result).toEqual({
        mode: 'rgb',
        r: 1,
        g: 128 / 255,
        b: 64 / 255,
        alpha: 1,
      })
    })

    it('当传入无 mode 的 HSL 对象时，必须正确归一化百分比值', () => {
      const hslObj = {
        h: 180,
        s: 50,
        l: 75,
      }

      const result = parseColor(hslObj)
      expect(result).toEqual({
        mode: 'hsl',
        h: 180,
        s: 0.5,
        l: 0.75,
        alpha: 1,
      })
    })

    it('当传入无 mode 的 HSL 对象且 s、l 值已在0-1范围内时，必须保持原值不变', () => {
      const hslObj = {
        h: 120,
        s: 0.8,
        l: 0.6,
      }

      const result = parseColor(hslObj)
      expect(result).toEqual({
        mode: 'hsl',
        h: 120,
        s: 0.8,
        l: 0.6,
        alpha: 1,
      })
    })

    it('当传入有 mode 的 RGB 对象且需要归一化时，必须正确归一化 0-255 范围的值', () => {
      const rgbObj = {
        mode: 'rgb',
        r: 255,
        g: 128,
        b: 64,
      }

      const result = parseColor(rgbObj)
      expect(result).toEqual({
        mode: 'rgb',
        r: 1,
        g: 128 / 255,
        b: 64 / 255,
        alpha: 1,
      })
    })

    it('当传入有 mode 的 HSL 对象且需要归一化时，必须正确归一化百分比值', () => {
      const hslObj = {
        mode: 'hsl',
        h: 180,
        s: 50,
        l: 75,
      }

      const result = parseColor(hslObj)
      expect(result).toEqual({
        mode: 'hsl',
        h: 180,
        s: 0.5,
        l: 0.75,
        alpha: 1,
      })
    })

    it('当传入已归一化的 RGB 对象时，必须保持原值不变', () => {
      const rgbObj = {
        r: 0.5,
        g: 0.25,
        b: 0.75,
      }

      const result = parseColor(rgbObj)
      expect(result).toEqual({
        mode: 'rgb',
        r: 0.5,
        g: 0.25,
        b: 0.75,
        alpha: 1,
      })
    })

    it('当传入带有 alpha 属性的 RGB 对象时，必须正确处理透明度', () => {
      const rgbObj = {
        r: 255,
        g: 0,
        b: 0,
        alpha: 0.5,
      }

      const result = parseColor(rgbObj)
      expect(result).toEqual({
        mode: 'rgb',
        r: 1,
        g: 0,
        b: 0,
        alpha: 0.5,
      })
    })

    it('当传入带有 a 属性的 HSL 对象时，必须正确处理透明度', () => {
      const hslObj = {
        h: 240,
        s: 100,
        l: 50,
        a: 0.8,
      }

      const result = parseColor(hslObj)
      expect(result).toEqual({
        mode: 'hsl',
        h: 240,
        s: 1,
        l: 0.5,
        alpha: 0.8,
      })
    })
  })

  describe('culori 委托处理验证', () => {
    it('当传入字符串颜色时，必须委托给 culori 解析', () => {
      const result = parseColor('#ff0000')
      expect(result).toEqual({
        mode: 'rgb',
        r: 1,
        g: 0,
        b: 0,
      })
    })

    it('当传入标准 culori 颜色对象时，必须委托给 culori 解析', () => {
      const culoriObj = {
        mode: 'oklch' as const,
        l: 0.5,
        c: 0.1,
        h: 180,
      }

      const result = parseColor(culoriObj)
      expect(result).toEqual(culoriObj)
    })

    it('当传入 CSS 颜色名称时，必须委托给 culori 解析', () => {
      const result = parseColor('red')
      expect(result).toEqual({
        mode: 'rgb',
        r: 1,
        g: 0,
        b: 0,
      })
    })
  })

  describe('无效输入处理', () => {
    it('当传入无效字符串时，必须返回 null', () => {
      expect(parseColor('invalid-color')).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      expect(parseColor(null)).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      expect(parseColor(undefined)).toBe(null)
    })

    it('当传入数字时，必须返回 null', () => {
      expect(parseColor(123)).toBe(null)
    })

    it('当传入布尔值时，必须返回 null', () => {
      expect(parseColor(true)).toBe(null)
    })

    it('当传入空对象时，必须返回 null', () => {
      expect(parseColor({})).toBe(null)
    })
  })
})
