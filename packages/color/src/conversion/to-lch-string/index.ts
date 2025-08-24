import type { EsdoraColor } from '../../_internal/types'
import { formatCss } from 'culori'
import { lch } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

/**
 * 将颜色对象转换为 LCH 颜色字符串。
 *
 * @param color 任意合法的颜色
 * @returns 一个 LCH 格式的颜色字符串，如果输入无效则返回 null
 *
 * @example
 * ```typescript
 * toLchString('#FF0000'); // => 'lch(54.291 106.839 40.853)'
 * toLchString('rgb(255, 0, 0)'); // => 'lch(54.291 106.839 40.853)'
 * toLchString({ r: 255, g: 0, b: 0 }); // => 'lch(54.291 106.839 40.853)'
 * toLchString('invalid'); // => null
 * ```
 */
export function toLchString(color: string | EsdoraColor): string | null {
  const parsed = parseColor(color)
  if (!parsed)
    return null

  let lchColor
  try {
    lchColor = lch(parsed)
  }
  catch {
    return null
  }

  return formatCss(lchColor)
}
