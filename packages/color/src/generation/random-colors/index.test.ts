import { describe, expect, it } from 'vitest'
import { randomColors } from '.'

describe('randomColors', () => {
  it('应该生成指定数量的随机颜色', () => {
    const colors = randomColors(5)
    expect(colors).toHaveLength(5)
    colors.forEach((color) => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })

  it('应该生成不同的颜色', () => {
    const colors = randomColors(10)
    const uniqueColors = new Set(colors)
    expect(uniqueColors.size).toBeGreaterThan(1)
  })

  it('应该应用选项到所有颜色', () => {
    const colors = randomColors(5, { preset: 'monochrome', format: 'hsl' })
    colors.forEach((color) => {
      expect(color).toMatch(/^hsl\([\d.]+, 0%/)
    })
  })

  it('应该处理 count = 0', () => {
    const colors = randomColors(0)
    expect(colors).toHaveLength(0)
  })

  it('应该处理大的 count 值', () => {
    const colors = randomColors(100)
    expect(colors).toHaveLength(100)
  })

  it('应该处理负数 count', () => {
    const colors = randomColors(-5)
    expect(colors).toHaveLength(0)
  })
})
