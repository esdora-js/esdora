import type { EsdoraColor } from '../../_internal/types'
import { formatHex, formatHex8 } from 'culori/fn'
import { rgb } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

/**
 * 混合多个颜色，创建一个新的颜色。
 *
 * @remarks
 * 此函数可以混合任意数量的颜色，通过在 RGB 色彩空间中进行平均计算。
 * 每个颜色的权重相等。
 *
 * 混合算法：
 * 1. 将所有颜色转换为 RGB 格式
 * 2. 对每个 RGB 通道分别计算平均值
 * 3. 对透明度通道也计算平均值
 * 4. 返回十六进制格式的颜色
 *
 * @param colors - 要混合的颜色数组，至少需要一个颜色
 * @returns 混合后的十六进制颜色字符串
 *
 * @example
 * ```typescript
 * // 混合两个颜色
 * mix('#ff0000', '#0000ff'); // => '#800080' (红色 + 蓝色 = 紫色)
 *
 * // 混合多个颜色
 * mix('#ff0000', '#00ff00', '#0000ff'); // => '#555555' (红 + 绿 + 蓝)
 * mix('red', 'green', 'blue', 'yellow'); // => '#808040' (四色混合)
 * ```
 */
export function mix(...colors: (string | EsdoraColor)[]): string | null {
  if (colors.length === 0) {
    throw new TypeError('至少需要提供一个颜色')
  }

  if (colors.length === 1) {
    const parsed = parseColor(colors[0])
    if (!parsed)
      return null

    // 遵循项目宪法第五条：Hex 格式化标准
    if ((parsed.alpha ?? 1) < 1) {
      return formatHex8(parsed)
    }
    return formatHex(parsed)
  }

  // 将所有颜色转换为 RGB 格式
  const rgbColors: Array<{ r: number, g: number, b: number, alpha: number }> = []

  for (const color of colors) {
    const parsed = parseColor(color)
    if (!parsed)
      return null

    let rgbColor
    try {
      rgbColor = rgb(parsed)
    }
    catch {
      return null
    }

    rgbColors.push({
      r: rgbColor.r ?? 0,
      g: rgbColor.g ?? 0,
      b: rgbColor.b ?? 0,
      alpha: rgbColor.alpha ?? 1,
    })
  }

  // 计算每个通道的平均值
  const avgR = rgbColors.reduce((sum, rgb) => sum + rgb.r, 0) / rgbColors.length
  const avgG = rgbColors.reduce((sum, rgb) => sum + rgb.g, 0) / rgbColors.length
  const avgB = rgbColors.reduce((sum, rgb) => sum + rgb.b, 0) / rgbColors.length
  const avgA = rgbColors.reduce((sum, rgb) => sum + rgb.alpha, 0) / rgbColors.length

  // 创建混合后的颜色对象
  const mixedColor: EsdoraColor = {
    mode: 'rgb',
    r: avgR,
    g: avgG,
    b: avgB,
    alpha: avgA,
  }

  // 遵循项目宪法第五条：Hex 格式化标准
  // 仅当颜色包含 Alpha 通道（透明度不为 1）时，才返回 8 位小写的 Hex 字符串
  if (avgA < 1) {
    return formatHex8(mixedColor)
  }

  return formatHex(mixedColor)
}
