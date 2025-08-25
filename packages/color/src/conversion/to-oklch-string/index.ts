import type { EsdoraColor } from '../../_internal/types'
import { formatCss } from 'culori'
import { oklch } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

/**
 * 将颜色对象转换为 OKLCH 颜色字符串。
 *
 * @param color 任意合法的颜色
 * @returns 一个 OKLCH 格式的颜色字符串，如果输入无效则返回 null
 *
 * @example
 * ```typescript
 * toOklchString('#FF0000'); // => 'oklch(0.628 0.258 29.234)'
 * toOklchString('rgb(255, 0, 0)'); // => 'oklch(0.628 0.258 29.234)'
 * toOklchString({ r: 255, g: 0, b: 0 }); // => 'oklch(0.628 0.258 29.234)'
 * toOklchString('invalid'); // => null
 * ```
 */
export function toOklchString(color: string | EsdoraColor): string | null {
  const parsed = parseColor(color)
  if (!parsed)
    return null

  let oklchColor
  try {
    oklchColor = oklch(parsed)
  }
  catch {
    return null
  }

  return formatCss(oklchColor)
}
