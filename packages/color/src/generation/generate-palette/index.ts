import type { EsdoraColor } from '../../_internal/types'
import { formatHex } from 'culori/fn'
import { hsl } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

/**
 * 调色板生成选项
 */
export interface PaletteOptions {
  /** 生成的颜色数量，默认为 5 */
  count?: number
  /** 调色板类型 */
  type?: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'split-complementary'
  /** 是否包含基础颜色，默认为 true */
  includeBase?: boolean
}

/**
 * 基于基础颜色生成调色板。
 *
 * @remarks
 * 此函数可以根据不同的色彩理论生成和谐的调色板：
 *
 * - `monochromatic`: 单色调色板，基于同一色相的不同明度和饱和度
 * - `analogous`: 类似色调色板，使用色轮上相邻的颜色
 * - `complementary`: 互补色调色板，使用色轮上相对的颜色
 * - `triadic`: 三角色调色板，使用色轮上等距的三个颜色
 * - `tetradic`: 四角色调色板，使用色轮上等距的四个颜色
 * - `split-complementary`: 分裂互补色调色板，使用基础色和其互补色两侧的颜色
 *
 * @param baseColor - 基础颜色字符串或颜色对象，支持 hex、rgb、hsl 等格式
 * @param options - 调色板生成选项
 * @returns 生成的调色板颜色数组，十六进制格式
 *
 * @example
 * ```typescript
 * // 生成单色调色板
 * generatePalette('#3498db', { type: 'monochromatic', count: 5 });
 * // => ['#1a5490', '#2980b9', '#3498db', '#5dade2', '#85c1e9']
 *
 * // 生成类似色调色板
 * generatePalette('#ff6b6b', { type: 'analogous', count: 3 });
 * // => ['#ff6b6b', '#ff9f43', '#feca57']
 *
 * // 生成互补色调色板
 * generatePalette('hsl(0, 70%, 60%)', { type: 'complementary' });
 * // => ['hsl(0, 70%, 60%)', 'hsl(180, 70%, 60%)']
 *
 * // 生成三角色调色板
 * generatePalette('rgb(255, 107, 107)', { type: 'triadic' });
 * // => ['rgb(255, 107, 107)', 'rgb(107, 255, 107)', 'rgb(107, 107, 255)']
 * ```
 */
export function generatePalette(baseColor: string | EsdoraColor, options: PaletteOptions = {}): string[] | null {
  const { count = 5, type = 'monochromatic', includeBase = true } = options

  const parsed = parseColor(baseColor)
  if (!parsed)
    return null

  const baseHsl = hsl(parsed)

  switch (type) {
    case 'monochromatic':
      return generateMonochromaticPalette(baseHsl, count, includeBase)

    case 'analogous':
      return generateAnalogousPalette(baseHsl, count, includeBase)

    case 'complementary':
      return generateComplementaryPalette(baseHsl, count, includeBase)

    case 'triadic':
      return generateTriadicPalette(baseHsl, includeBase)

    case 'tetradic':
      return generateTetradicPalette(baseHsl, includeBase)

    case 'split-complementary':
      return generateSplitComplementaryPalette(baseHsl, includeBase)

    default:
      return generateMonochromaticPalette(baseHsl, count, includeBase)
  }
}

function generateMonochromaticPalette(baseHsl: EsdoraColor, count: number, includeBase: boolean): string[] {
  const palette: string[] = []
  const step = 1 / (count + 1)

  for (let i = 0; i < count; i++) {
    const lightness = Math.max(0.1, Math.min(0.9, step * (i + 1)))
    const color: EsdoraColor = {
      mode: 'hsl',
      h: (baseHsl as any).h ?? 0,
      s: (baseHsl as any).s ?? 0,
      l: lightness,
      alpha: baseHsl.alpha ?? 1,
    }
    palette.push(formatHex(color))
  }

  if (includeBase) {
    const baseHex = formatHex(baseHsl)
    if (!palette.includes(baseHex)) {
      palette.push(baseHex)
      palette.sort((a, b) => {
        const aColor = parseColor(a)
        const bColor = parseColor(b)
        if (!aColor || !bColor)
          return 0
        const aHsl = hsl(aColor)
        const bHsl = hsl(bColor)
        if (!aHsl || !bHsl)
          return 0
        return ((aHsl as any).l ?? 0) - ((bHsl as any).l ?? 0)
      })
    }
  }

  return palette.slice(0, count)
}

function generateAnalogousPalette(baseHsl: EsdoraColor, count: number, includeBase: boolean): string[] {
  const palette: string[] = []
  const step = 60 / (count - 1) // 类似色通常在60度范围内

  for (let i = 0; i < count; i++) {
    const hue = (((baseHsl as any).h ?? 0) + (i - Math.floor(count / 2)) * step + 360) % 360
    const color: EsdoraColor = {
      mode: 'hsl',
      h: hue,
      s: (baseHsl as any).s ?? 0,
      l: (baseHsl as any).l ?? 0,
      alpha: baseHsl.alpha ?? 1,
    }
    palette.push(formatHex(color))
  }

  if (!includeBase) {
    const baseHex = formatHex(baseHsl)
    return palette.filter(color => color !== baseHex)
  }

  return palette
}

function generateComplementaryPalette(baseHsl: EsdoraColor, count: number, includeBase: boolean): string[] {
  const palette: string[] = []

  if (includeBase) {
    palette.push(formatHex(baseHsl))
  }

  // 互补色（色相相差180度）
  const complementaryHue = (((baseHsl as any).h ?? 0) + 180) % 360
  const complementaryColor: EsdoraColor = {
    mode: 'hsl',
    h: complementaryHue,
    s: (baseHsl as any).s ?? 0,
    l: (baseHsl as any).l ?? 0,
    alpha: baseHsl.alpha ?? 1,
  }
  palette.push(formatHex(complementaryColor))

  // 如果需要更多颜色，添加明度变化
  const remaining = count - palette.length
  for (let i = 0; i < remaining; i++) {
    const isBase = i % 2 === 0
    const hue = isBase ? ((baseHsl as any).h ?? 0) : complementaryHue
    const lightness = ((baseHsl as any).l ?? 0) + (i + 1) * 0.15 * (i % 2 === 0 ? 1 : -1)
    const clampedLightness = Math.max(0.1, Math.min(0.9, lightness))

    const color: EsdoraColor = {
      mode: 'hsl',
      h: hue,
      s: (baseHsl as any).s ?? 0,
      l: clampedLightness,
      alpha: baseHsl.alpha ?? 1,
    }
    palette.push(formatHex(color))
  }

  return palette.slice(0, count)
}

function generateTriadicPalette(baseHsl: EsdoraColor, includeBase: boolean): string[] {
  const palette: string[] = []

  if (includeBase) {
    palette.push(formatHex(baseHsl))
  }

  // 三角色（色相相差120度）
  const hue1 = (((baseHsl as any).h ?? 0) + 120) % 360
  const hue2 = (((baseHsl as any).h ?? 0) + 240) % 360

  const color1: EsdoraColor = {
    mode: 'hsl',
    h: hue1,
    s: (baseHsl as any).s ?? 0,
    l: (baseHsl as any).l ?? 0,
    alpha: baseHsl.alpha ?? 1,
  }
  const color2: EsdoraColor = {
    mode: 'hsl',
    h: hue2,
    s: (baseHsl as any).s ?? 0,
    l: (baseHsl as any).l ?? 0,
    alpha: baseHsl.alpha ?? 1,
  }

  palette.push(formatHex(color1))
  palette.push(formatHex(color2))

  return palette
}

function generateTetradicPalette(baseHsl: EsdoraColor, includeBase: boolean): string[] {
  const palette: string[] = []

  if (includeBase) {
    palette.push(formatHex(baseHsl))
  }

  // 四角色（色相相差90度）
  const hue1 = (((baseHsl as any).h ?? 0) + 90) % 360
  const hue2 = (((baseHsl as any).h ?? 0) + 180) % 360
  const hue3 = (((baseHsl as any).h ?? 0) + 270) % 360

  const color1: EsdoraColor = {
    mode: 'hsl',
    h: hue1,
    s: (baseHsl as any).s ?? 0,
    l: (baseHsl as any).l ?? 0,
    alpha: baseHsl.alpha ?? 1,
  }
  const color2: EsdoraColor = {
    mode: 'hsl',
    h: hue2,
    s: (baseHsl as any).s ?? 0,
    l: (baseHsl as any).l ?? 0,
    alpha: baseHsl.alpha ?? 1,
  }
  const color3: EsdoraColor = {
    mode: 'hsl',
    h: hue3,
    s: (baseHsl as any).s ?? 0,
    l: (baseHsl as any).l ?? 0,
    alpha: baseHsl.alpha ?? 1,
  }

  palette.push(formatHex(color1))
  palette.push(formatHex(color2))
  palette.push(formatHex(color3))

  return palette
}

function generateSplitComplementaryPalette(baseHsl: EsdoraColor, includeBase: boolean): string[] {
  const palette: string[] = []

  if (includeBase) {
    palette.push(formatHex(baseHsl))
  }

  // 分裂互补色（互补色的两侧各30度）
  const complementaryHue = (((baseHsl as any).h ?? 0) + 180) % 360
  const hue1 = (complementaryHue - 30 + 360) % 360
  const hue2 = (complementaryHue + 30) % 360

  const color1: EsdoraColor = {
    mode: 'hsl',
    h: hue1,
    s: (baseHsl as any).s ?? 0,
    l: (baseHsl as any).l ?? 0,
    alpha: baseHsl.alpha ?? 1,
  }
  const color2: EsdoraColor = {
    mode: 'hsl',
    h: hue2,
    s: (baseHsl as any).s ?? 0,
    l: (baseHsl as any).l ?? 0,
    alpha: baseHsl.alpha ?? 1,
  }

  palette.push(formatHex(color1))
  palette.push(formatHex(color2))

  return palette
}
