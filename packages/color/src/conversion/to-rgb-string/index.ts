import type { EsdoraColor } from '../../_internal/types'
import { formatRgb } from 'culori/fn'
import { rgb } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

/**
 * 将颜色对象转换为 RGB 颜色字符串。
 *
 * @param color 任意合法的颜色
 * @returns 一个 RGB 格式的颜色字符串。
 *
 * @example
 * ```typescript
 * toRgbString('#FF0000'); // => 'rgb(255, 0, 0)'
 * toRgbString('hsl(0, 100%, 50%)'); // => 'rgb(255, 0, 0)'
 * toRgbString({ h: 0, s: 100, l: 50 }); // => 'rgb(255, 0, 0)'
 * ```
 */
export function toRgbString(color: string | EsdoraColor): string | null {
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

  return formatRgb(rgbColor)
}
