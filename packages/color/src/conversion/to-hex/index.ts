import type { EsdoraColor } from '../../_internal/types'
import { formatHex, formatHex8 } from 'culori/fn'
import { parseColor } from '../../_internal/parser'

/**
 * 将颜色对象转换为十六进制 (HEX) 颜色字符串。
 *
 * @param color 任意合法的颜色
 * @returns 一个以 "#" 开头的十六进制颜色字符串。
 *
 * @example
 * ```typescript
 * toHex({ r: 255, g: 0, b: 0 }); // => '#ff0000'
 * toHex('rgb(255, 0, 0)'); // => '#ff0000'
 * toHex('hsl(0, 100%, 50%)'); // => '#ff0000'
 * ```
 */
export function toHex(color: string | EsdoraColor): string | null {
  const parsed = parseColor(color)
  if (!parsed)
    return null

  // 如果有透明度且不是完全不透明，使用 8 位十六进制格式
  if ((parsed.alpha ?? 1) < 1) {
    return formatHex8(parsed)
  }

  return formatHex(parsed)
}
