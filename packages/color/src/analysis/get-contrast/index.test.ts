import { describe, expect, it } from 'vitest'
import { getContrast } from '.'

describe('getContrast', () => {
  describe('基础功能', () => {
    it('当传入白色与黑色时，必须正确计算对比度', () => {
      const contrast = getContrast('#FFFFFF', '#000000')
      expect(contrast).toBe(21)
    })

    it('当传入 RGB 字符串格式时，必须正确计算对比度', () => {
      const contrast = getContrast('rgb(255, 255, 255)', 'rgb(0, 0, 0)')
      expect(contrast).toBe(21)
    })

    it('当传入颜色对象格式时，必须正确计算对比度', () => {
      const contrast = getContrast(
        { r: 255, g: 255, b: 255, mode: 'rgb' },
        { r: 0, g: 0, b: 0, mode: 'rgb' },
      )
      expect(contrast).toBe(21)
    })
  })

  describe('错误处理', () => {
    it('当第一个颜色无效时，必须返回 null', () => {
      const contrast = getContrast('invalid-color', '#000000')
      expect(contrast).toBe(null)
    })

    it('当第二个颜色无效时，必须返回 null', () => {
      const contrast = getContrast('#ffffff', 'invalid-color')
      expect(contrast).toBe(null)
    })

    it('当两个颜色都无效时，必须返回 null', () => {
      const contrast = getContrast('invalid-color1', 'invalid-color2')
      expect(contrast).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const contrast = getContrast(null as any, '#000000')
      expect(contrast).toBe(null)
    })
  })
})
