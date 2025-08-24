import type { EsdoraColor } from '../../_internal/types'
import { clamp } from '@esdora/kit'
import { hsl } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

export type SaturationAdjuster = (currentSaturation: number) => number

/**
 * [核心内部引擎] 以感知均匀的方式，调整任意有效颜色的饱和度。
 *
 * @remarks
 * 此函数会先将任何输入颜色智能地转换为 HSL 色彩空间，
 * 然后再对饱和度 (S) 通道进行操作。
 *
 * @param color 基础颜色字符串。
 * @param adjuster - 一个数字或一个函数来修改饱和度。
 * @returns 一个新的、调整饱和度后的颜色对象，如果输入无效则返回 null。
 * @internal
 */
export function adjustSaturation(color: string | EsdoraColor, adjuster: number | SaturationAdjuster): EsdoraColor | null {
  const parsed: EsdoraColor | null = parseColor(color)
  if (!parsed)
    return null

  let hslColor
  try {
    hslColor = hsl(parsed)
  }
  catch {
    return null
  }

  let newSaturation: number
  if (typeof adjuster === 'function') {
    newSaturation = adjuster(hslColor.s ?? 0)
  }
  else {
    newSaturation = adjuster
  }

  hslColor.s = clamp(newSaturation, 0, 1)

  return hslColor
}
