import type { EsdoraColor } from '../../_internal/types'
import { clamp } from '@esdora/kit'
import { oklch } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

export type ChromaAdjuster = (currentChroma: number) => number

/**
 * [核心内部引擎] 以感知均匀的方式，调整任意有效颜色的色度（饱和度）。
 *
 * @remarks
 * 此函数会先将任何输入颜色智能地转换为 OKLCH 色彩空间，
 * 然后再对色度 (C) 通道进行操作，以确保调整效果最符合人类视觉感知。
 *
 * @param color 基础颜色字符串或颜色对象
 * @param adjuster 一个数字或一个函数来修改色度
 * @returns 一个新的、调整色度后的颜色对象，如果输入无效则返回 null
 *
 * @example
 * ```typescript
 * adjustChroma('#FF0000', 0.2);           // 设置色度为 0.2
 * adjustChroma('#FF0000', c => c * 0.5);  // 将色度减半
 * adjustChroma('invalid', 0.1);           // => null
 * ```
 *
 * @internal
 */
export function adjustChroma(color: string | EsdoraColor, adjuster: number | ChromaAdjuster): EsdoraColor | null {
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

  let newChroma: number
  if (typeof adjuster === 'function') {
    newChroma = adjuster(oklchColor.c ?? 0)
  }
  else {
    newChroma = adjuster
  }

  oklchColor.c = clamp(newChroma, 0, 0.4)

  return oklchColor
}
