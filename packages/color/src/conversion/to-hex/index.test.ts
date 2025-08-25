import { describe, expect, it } from 'vitest'
import { toHex } from '.'

describe('toHex', () => {
  describe('基础转换功能', () => {
    it('当传入 RGB 字符串时，必须转换为十六进制', () => {
      const result = toHex('rgb(255, 0, 0)')
      expect(result).toBe('#ff0000')
    })

    it('当传入 RGB 对象时，必须转换为十六进制', () => {
      const result = toHex({ r: 255, g: 0, b: 0, mode: 'rgb' })
      expect(result).toBe('#ff0000')
    })

    it('当传入 HSL 字符串时，必须转换为十六进制', () => {
      const result = toHex('hsl(0, 100%, 50%)')
      expect(result).toBe('#ff0000')
    })

    it('当传入 HSL 对象时，必须转换为十六进制', () => {
      const result = toHex({ h: 0, s: 100, l: 50, mode: 'hsl' })
      expect(result).toBe('#ff0000')
    })

    it('当传入不同颜色时，必须正确处理', () => {
      expect(toHex('rgb(0, 255, 0)')).toBe('#00ff00') // 绿色
      expect(toHex('rgb(0, 0, 255)')).toBe('#0000ff') // 蓝色
      expect(toHex('#ffffff')).toBe('#ffffff') // 白色
      expect(toHex('#000000')).toBe('#000000') // 黑色
    })
  })

  describe('特殊格式处理', () => {
    it('当传入带透明度的颜色时，必须正确处理', () => {
      const result = toHex('rgba(255, 0, 0, 0.5)')
      expect(result).toBe('#ff000080')
    })

    it('当传入短格式十六进制时，必须正确处理', () => {
      const result = toHex('#f00')
      expect(result).toBe('#ff0000')
    })
  })

  describe('错误处理', () => {
    it('当传入无效颜色字符串时，必须返回 null', () => {
      const result = toHex('invalid-color')
      expect(result).toBe(null)
    })

    it('当传入空字符串时，必须返回 null', () => {
      const result = toHex('')
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = toHex(null as any)
      expect(result).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      const result = toHex(undefined as any)
      expect(result).toBe(null)
    })
  })
})
