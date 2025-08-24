import type { EsdoraColor } from '../../_internal/types'
import { clamp } from '@esdora/kit'
import { oklch } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

export type LightnessAdjuster = (currentLightness: number) => number

/**
 * [核心内部引擎] 以感知均匀的方式，调整任意有效颜色的亮度。
 *
 * @remarks
 * 此函数会先将任何输入颜色智能地转换为 OKLCH 色彩空间，
 * 然后再对亮度 (L) 通道进行操作，以确保调整效果最符合人类视觉感知。
 *
 * @param color 基础颜色字符串。
 * @param adjuster - 一个数字或一个函数来修改亮度。
 * @returns 一个新的、调整亮度后的十六进制颜色字符串，如果输入无效则返回 null。
 * @internal
 */
export function adjustLightness(color: string | EsdoraColor, adjuster: number | LightnessAdjuster): EsdoraColor | null {
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

  let newLightness: number
  if (typeof adjuster === 'function') {
    newLightness = adjuster(oklchColor.l)
  }
  else {
    newLightness = adjuster
  }

  oklchColor.l = clamp(newLightness, 0, 1)

  return oklchColor
}
