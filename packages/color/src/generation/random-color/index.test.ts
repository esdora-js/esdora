import { describe, expect, it } from 'vitest'
import { randomColor, randomColors } from '.'

describe('randomColor', () => {
  describe('基础功能', () => {
    it('应该生成有效的随机颜色', () => {
      const color = randomColor()
      expect(color).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('应该每次生成不同的颜色', () => {
      const colors = Array.from({ length: 10 }, () => randomColor())
      const uniqueColors = new Set(colors)
      expect(uniqueColors.size).toBeGreaterThan(1)
    })
  })

  describe('输出格式', () => {
    it('应该生成 hex 格式的颜色', () => {
      const color = randomColor({ format: 'hex' })
      expect(color).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('应该生成 RGB 格式的颜色', () => {
      const color = randomColor({ format: 'rgb' })
      expect(color).toMatch(/^rgb\(\d+, \d+, \d+\)$/)
    })

    it('应该生成 HSL 格式的颜色', () => {
      const color = randomColor({ format: 'hsl' })
      expect(color).toMatch(/^hsl\([\d.]+, [\d.]+%, [\d.]+%\)$/)
    })
  })

  describe('参数约束', () => {
    it('应该生成指定色相范围内的颜色', () => {
      const colors = Array.from({ length: 20 }, () =>
        randomColor({ hue: [0, 60], format: 'hsl' })).filter(Boolean) as string[]

      expect(colors.length).toBeGreaterThan(0)
      colors.forEach((color) => {
        const hueMatch = color.match(/hsl\(([\d.]+),/)
        expect(hueMatch).toBeTruthy()
        const hue = Number.parseFloat(hueMatch![1])
        expect(hue).toBeGreaterThanOrEqual(0)
        expect(hue).toBeLessThanOrEqual(60)
      })
    })

    it('应该生成固定色相的颜色', () => {
      const colors = Array.from({ length: 5 }, () =>
        randomColor({ hue: 120, format: 'hsl' }))

      colors.forEach((color) => {
        expect(color).toMatch(/^hsl\(120,/)
      })
    })

    it('应该生成指定饱和度范围内的颜色', () => {
      const colors = Array.from({ length: 20 }, () =>
        randomColor({ saturation: [80, 100], format: 'hsl' })).filter(Boolean) as string[]

      expect(colors.length).toBeGreaterThan(0)
      colors.forEach((color) => {
        const satMatch = color.match(/hsl\([\d.]+, ([\d.]+)%/)
        expect(satMatch).toBeTruthy()
        const saturation = Number.parseFloat(satMatch![1])
        expect(saturation).toBeGreaterThanOrEqual(80)
        expect(saturation).toBeLessThanOrEqual(100)
      })
    })

    it('应该生成指定亮度范围内的颜色', () => {
      const colors = Array.from({ length: 20 }, () =>
        randomColor({ lightness: [20, 40], format: 'hsl' }))

      colors.forEach((color) => {
        expect(color).toBeTruthy()
        const lightMatch = color!.match(/hsl\([\d.]+, [\d.]+%, ([\d.]+)%/)
        expect(lightMatch).toBeTruthy()
        const lightness = Number.parseFloat(lightMatch![1])
        expect(lightness).toBeGreaterThanOrEqual(20)
        expect(lightness).toBeLessThanOrEqual(40)
      })
    })
  })

  describe('预设类型', () => {
    it('应该生成明亮的颜色 (bright)', () => {
      const colors = Array.from({ length: 10 }, () =>
        randomColor({ preset: 'bright', format: 'hsl' }))

      colors.forEach((color) => {
        const matches = color!.match(/hsl\([\d.]+, ([\d.]+)%, ([\d.]+)%/)
        expect(matches).toBeTruthy()
        const saturation = Number.parseFloat(matches![1])
        const lightness = Number.parseFloat(matches![2])
        expect(saturation).toBeGreaterThanOrEqual(70)
        expect(lightness).toBeGreaterThanOrEqual(45)
        expect(lightness).toBeLessThanOrEqual(65)
      })
    })

    it('应该生成深色 (dark)', () => {
      const colors = Array.from({ length: 10 }, () =>
        randomColor({ preset: 'dark', format: 'hsl' }))

      colors.forEach((color) => {
        const lightMatch = color!.match(/hsl\([\d.]+, [\d.]+%, ([\d.]+)%/)
        expect(lightMatch).toBeTruthy()
        const lightness = Number.parseFloat(lightMatch![1])
        expect(lightness).toBeGreaterThanOrEqual(10)
        expect(lightness).toBeLessThanOrEqual(40)
      })
    })

    it('应该生成浅色 (light)', () => {
      const colors = Array.from({ length: 10 }, () =>
        randomColor({ preset: 'light', format: 'hsl' }))

      colors.forEach((color) => {
        const lightMatch = color!.match(/hsl\([\d.]+, [\d.]+%, ([\d.]+)%/)
        expect(lightMatch).toBeTruthy()
        const lightness = Number.parseFloat(lightMatch![1])
        expect(lightness).toBeGreaterThanOrEqual(70)
        expect(lightness).toBeLessThanOrEqual(95)
      })
    })

    it('应该生成柔和色 (pastel)', () => {
      const colors = Array.from({ length: 10 }, () =>
        randomColor({ preset: 'pastel', format: 'hsl' }))

      colors.forEach((color) => {
        const matches = color!.match(/hsl\([\d.]+, ([\d.]+)%, ([\d.]+)%/)
        expect(matches).toBeTruthy()
        const saturation = Number.parseFloat(matches![1])
        const lightness = Number.parseFloat(matches![2])
        expect(saturation).toBeGreaterThanOrEqual(20)
        expect(saturation).toBeLessThanOrEqual(50)
        expect(lightness).toBeGreaterThanOrEqual(70)
        expect(lightness).toBeLessThanOrEqual(90)
      })
    })

    it('应该生成鲜艳色 (vibrant)', () => {
      const colors = Array.from({ length: 10 }, () =>
        randomColor({ preset: 'vibrant', format: 'hsl' }))

      colors.forEach((color) => {
        const matches = color!.match(/hsl\([\d.]+, ([\d.]+)%, ([\d.]+)%/)
        expect(matches).toBeTruthy()
        const saturation = Number.parseFloat(matches![1])
        const lightness = Number.parseFloat(matches![2])
        expect(saturation).toBeGreaterThanOrEqual(80)
        expect(saturation).toBeLessThanOrEqual(100)
        expect(lightness).toBeGreaterThanOrEqual(40)
        expect(lightness).toBeLessThanOrEqual(70)
      })
    })

    it('应该生成单色 (monochrome)', () => {
      const colors = Array.from({ length: 10 }, () =>
        randomColor({ preset: 'monochrome', format: 'hsl' }))

      colors.forEach((color) => {
        expect(color).toMatch(/^hsl\([\d.]+, 0%/)
      })
    })

    it('应该处理未知预设 (default)', () => {
      const color = randomColor({ preset: 'unknown' as any, format: 'hsl' })
      expect(color).toMatch(/^hsl\([\d.]+, [\d.]+%, [\d.]+%\)$/)
    })
  })

  describe('透明度处理', () => {
    it('应该生成带透明度的颜色', () => {
      const color = randomColor({ alpha: 0.5, format: 'rgb' })
      expect(color).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/)
    })

    it('应该生成透明度范围内的颜色', () => {
      const colors = Array.from({ length: 10 }, () =>
        randomColor({ alpha: [0.3, 0.7], format: 'rgb' }))

      colors.forEach((color) => {
        const alphaMatch = color!.match(/rgba\(\d+, \d+, \d+, ([\d.]+)\)/)
        expect(alphaMatch).toBeTruthy()
        const alpha = Number.parseFloat(alphaMatch![1])
        expect(alpha).toBeGreaterThanOrEqual(0.3)
        expect(alpha).toBeLessThanOrEqual(0.7)
      })
    })

    it('should handle alpha as number type', () => {
      const color = randomColor({ alpha: 0.8, format: 'rgb' })
      expect(color).toMatch(/^rgba\(\d+, \d+, \d+, 0\.8\)$/)
    })

    it('should handle alpha as array type', () => {
      const color = randomColor({ alpha: [0.2, 0.8], format: 'rgb' })
      const alphaMatch = color!.match(/rgba\(\d+, \d+, \d+, ([\d.]+)\)/)
      expect(alphaMatch).toBeTruthy()
      const alpha = Number.parseFloat(alphaMatch![1])
      expect(alpha).toBeGreaterThanOrEqual(0.2)
      expect(alpha).toBeLessThanOrEqual(0.8)
    })
  })

  describe('边界情况', () => {
    it('应该处理超出范围的参数', () => {
      const color = randomColor({
        hue: 400, // 超出 360
        saturation: 150, // 超出 100
        lightness: -10, // 小于 0
      })
      expect(color).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('应该处理空选项对象', () => {
      const color = randomColor({})
      expect(color).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })
})

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

  it('应该处理无效的格式', () => {
    // @ts-expect-error - 测试无效格式
    const color = randomColor({ format: 'invalid' })
    expect(color).toMatch(/^#[0-9a-f]{6}$/i) // 应该回退到默认格式
  })

  describe('亮度百分比处理', () => {
    it('should handle percentage lightness values > 1', () => {
      const color = randomColor({ lightness: 80, format: 'hsl' }) // 80% as percentage
      const lightMatch = color!.match(/hsl\([\d.]+, [\d.]+%, ([\d.]+)%/)
      expect(lightMatch).toBeTruthy()
      const lightness = Number.parseFloat(lightMatch![1])
      expect(lightness).toBeCloseTo(80, 1)
    })

    it('should handle percentage lightness range values > 1', () => {
      const color = randomColor({ lightness: [30, 70], format: 'hsl' }) // percentages
      const lightMatch = color!.match(/hsl\([\d.]+, [\d.]+%, ([\d.]+)%/)
      expect(lightMatch).toBeTruthy()
      const lightness = Number.parseFloat(lightMatch![1])
      expect(lightness).toBeGreaterThanOrEqual(30)
      expect(lightness).toBeLessThanOrEqual(70)
    })

    it('should handle decimal lightness values <= 1', () => {
      const color = randomColor({ lightness: 0.8, format: 'hsl' }) // 80% as decimal
      const lightMatch = color!.match(/hsl\([\d.]+, [\d.]+%, ([\d.]+)%/)
      expect(lightMatch).toBeTruthy()
      const lightness = Number.parseFloat(lightMatch![1])
      expect(lightness).toBeCloseTo(80, 1)
    })

    it('should handle decimal lightness range values <= 1', () => {
      const color = randomColor({ lightness: [0.3, 0.7], format: 'hsl' }) // decimals
      const lightMatch = color!.match(/hsl\([\d.]+, [\d.]+%, ([\d.]+)%/)
      expect(lightMatch).toBeTruthy()
      const lightness = Number.parseFloat(lightMatch![1])
      expect(lightness).toBeGreaterThanOrEqual(30)
      expect(lightness).toBeLessThanOrEqual(70)
    })
  })

  describe('饱和度百分比处理', () => {
    it('should handle percentage saturation range values > 1', () => {
      const color = randomColor({ saturation: [30, 70], format: 'hsl' }) // percentages
      const satMatch = color!.match(/hsl\([\d.]+, ([\d.]+)%, [\d.]+%/)
      expect(satMatch).toBeTruthy()
      const saturation = Number.parseFloat(satMatch![1])
      expect(saturation).toBeGreaterThanOrEqual(30)
      expect(saturation).toBeLessThanOrEqual(70)
    })

    it('should handle decimal saturation range values <= 1', () => {
      const color = randomColor({ saturation: [0.3, 0.7], format: 'hsl' }) // decimals
      const satMatch = color!.match(/hsl\([\d.]+, ([\d.]+)%, [\d.]+%/)
      expect(satMatch).toBeTruthy()
      const saturation = Number.parseFloat(satMatch![1])
      expect(saturation).toBeGreaterThanOrEqual(30)
      expect(saturation).toBeLessThanOrEqual(70)
    })
  })
})
