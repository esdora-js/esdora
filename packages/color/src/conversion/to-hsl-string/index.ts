import type { EsdoraColor } from '../../_internal/types'
import { formatHsl } from 'culori/fn'
import { hsl } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

/**
 * 将颜色对象转换为 HSL 颜色字符串。
 *
 * @param color 任意合法的颜色
 * @returns 一个 HSL 格式的颜色字符串。
 *
 * @example
 * ```typescript
 * toHslString('#FF0000'); // => 'hsl(0, 100%, 50%)'
 * toHslString('rgb(255, 0, 0)'); // => 'hsl(0, 100%, 50%)'
 * toHslString({ r: 255, g: 0, b: 0 }); // => 'hsl(0, 100%, 50%)'
 * ```
 */
export function toHslString(color: string | EsdoraColor): string | null {
  const parsed = parseColor(color)
  if (!parsed)
    return null

  let hslColor
  try {
    hslColor = hsl(parsed)
  }
  catch {
    return null
  }

  return formatHsl(hslColor)
}
