import type { EsdoraColor } from '../../_internal/types'
import { oklch } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

export type HueAdjuster = (currentHue: number) => number

/**
 * 标准化色相值到 0-360 度范围内。
 * @param hue 色相值
 * @returns 标准化后的色相值
 * @internal
 */
function normalizeHue(hue: number): number {
  // 将色相值标准化到 0-360 度范围内
  const normalized = hue % 360
  return normalized < 0 ? normalized + 360 : normalized
}

/**
 * [核心内部引擎] 以感知均匀的方式，调整任意有效颜色的色相。
 *
 * @remarks
 * 此函数会先将任何输入颜色智能地转换为 OKLCH 色彩空间，
 * 然后再对色相 (H) 通道进行操作，以确保调整效果最符合人类视觉感知。
 *
 * @param color 基础颜色字符串或颜色对象
 * @param adjuster 一个数字或一个函数来修改色相
 * @returns 一个新的、调整色相后的颜色对象，如果输入无效则返回 null
 *
 * @example
 * ```typescript
 * adjustHue('#FF0000', 180);              // 设置色相为 180 度
 * adjustHue('#FF0000', h => h + 30);      // 将色相增加 30 度
 * adjustHue('invalid', 90);               // => null
 * ```
 *
 * @internal
 */
export function adjustHue(color: string | EsdoraColor, adjuster: number | HueAdjuster): EsdoraColor | null {
  const parsed: EsdoraColor | null = parseColor(color)
  if (!parsed)
    return null

  let oklchColor
  try {
    oklchColor = oklch(parsed)
  }
  catch {
    return null
  }

  let newHue: number
  if (typeof adjuster === 'function') {
    newHue = adjuster(oklchColor.h ?? 0)
  }
  else {
    newHue = adjuster
  }

  oklchColor.h = normalizeHue(newHue)

  return oklchColor
}
