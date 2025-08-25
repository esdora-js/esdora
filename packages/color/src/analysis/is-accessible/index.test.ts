import { describe, expect, it } from 'vitest'
import { isAccessible } from '.'

describe('isAccessible', () => {
  describe('aA 级别普通文本', () => {
    it('当传入黑色文本和白色背景时，必须判断为可访问', () => {
      const result = isAccessible('#000000', '#FFFFFF')
      expect(result).toBe(true)
    })

    it('当传入白色文本和黑色背景时，必须判断为可访问', () => {
      const result = isAccessible('#FFFFFF', '#000000')
      expect(result).toBe(true)
    })

    it('当对比度刚好达到 4.5:1 时，必须判断为可访问', () => {
      // 使用已知对比度为 4.5:1 的颜色组合
      const result = isAccessible('#767676', '#FFFFFF')
      expect(result).toBe(true)
    })

    it('当对比度低于 4.5:1 时，必须判断为不可访问', () => {
      // 使用对比度低于 4.5:1 的颜色组合
      const result = isAccessible('#999999', '#FFFFFF')
      expect(result).toBe(false)
    })
  })

  describe('aA 级别大文本', () => {
    it('当传入大文本选项且对比度达到 3:1 时，必须判断为可访问', () => {
      // 使用已知对比度约为 3:1 的颜色组合
      const result = isAccessible('#949494', '#FFFFFF', { level: 'AA', size: 'large' })
      expect(result).toBe(true)
    })

    it('当传入大文本选项且对比度低于 3:1 时，必须判断为不可访问', () => {
      const result = isAccessible('#CCCCCC', '#FFFFFF', { level: 'AA', size: 'large' })
      expect(result).toBe(false)
    })
  })

  describe('aAA 级别普通文本', () => {
    it('当传入 AAA 级别且对比度达到 7:1 时，必须判断为可访问', () => {
      const result = isAccessible('#000000', '#FFFFFF', { level: 'AAA' })
      expect(result).toBe(true)
    })

    it('当传入 AAA 级别且对比度低于 7:1 时，必须判断为不可访问', () => {
      const result = isAccessible('#767676', '#FFFFFF', { level: 'AAA' })
      expect(result).toBe(false)
    })
  })

  describe('aAA 级别大文本', () => {
    it('当传入 AAA 级别大文本且对比度达到 4.5:1 时，必须判断为可访问', () => {
      const result = isAccessible('#767676', '#FFFFFF', { level: 'AAA', size: 'large' })
      expect(result).toBe(true)
    })

    it('当传入 AAA 级别大文本且对比度低于 4.5:1 时，必须判断为不可访问', () => {
      const result = isAccessible('#999999', '#FFFFFF', { level: 'AAA', size: 'large' })
      expect(result).toBe(false)
    })
  })

  describe('多种输入格式支持', () => {
    it('当传入 RGB 字符串时，必须正确判断', () => {
      const result = isAccessible('rgb(0, 0, 0)', 'rgb(255, 255, 255)')
      expect(result).toBe(true)
    })

    it('当传入颜色对象时，必须正确判断', () => {
      const result = isAccessible(
        { r: 0, g: 0, b: 0, mode: 'rgb' },
        { r: 255, g: 255, b: 255, mode: 'rgb' },
      )
      expect(result).toBe(true)
    })

    it('当传入 HSL 字符串时，必须正确判断', () => {
      const result = isAccessible('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)')
      expect(result).toBe(true)
    })
  })

  describe('无效输入处理', () => {
    it('当第一个颜色无效时，必须返回 null', () => {
      const result = isAccessible('invalid-color', '#FFFFFF')
      expect(result).toBe(null)
    })

    it('当第二个颜色无效时，必须返回 null', () => {
      const result = isAccessible('#000000', 'invalid-color')
      expect(result).toBe(null)
    })

    it('当两个颜色都无效时，必须返回 null', () => {
      const result = isAccessible('invalid-color1', 'invalid-color2')
      expect(result).toBe(null)
    })

    it('当传入 null 时，必须返回 null', () => {
      const result = isAccessible(null as any, '#FFFFFF')
      expect(result).toBe(null)
    })

    it('当传入 undefined 时，必须返回 null', () => {
      const result = isAccessible('#000000', undefined as any)
      expect(result).toBe(null)
    })
  })

  describe('边界情况处理', () => {
    it('当不传入选项时，必须使用默认值 AA 级别普通文本', () => {
      const result1 = isAccessible('#767676', '#FFFFFF')
      const result2 = isAccessible('#767676', '#FFFFFF', { level: 'AA', size: 'normal' })
      expect(result1).toBe(result2)
    })

    it('当只传入级别选项时，必须使用默认文本大小', () => {
      const result1 = isAccessible('#767676', '#FFFFFF', { level: 'AAA' })
      const result2 = isAccessible('#767676', '#FFFFFF', { level: 'AAA', size: 'normal' })
      expect(result1).toBe(result2)
    })

    it('当只传入文本大小选项时，必须使用默认级别', () => {
      const result1 = isAccessible('#999999', '#FFFFFF', { size: 'large' })
      const result2 = isAccessible('#999999', '#FFFFFF', { level: 'AA', size: 'large' })
      expect(result1).toBe(result2)
    })
  })
})
