import type { EsdoraColor } from '../../_internal/types'
import { oklch } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

/**
 * 检查一个颜色是否是“暗色”。
 *
 * @param color 要检查的颜色字符串或颜色对象
 * @returns 如果颜色被认为是暗色，则返回 `true`；如果是亮色，则返回 `false`；如果输入无效，则返回 `null`
 *
 * @example
 * ```typescript
 * isDark('#FFFFFF'); // => false
 * isDark('#000000'); // => true
 * isDark('yellow');  // => false
 * isDark('invalid'); // => null
 * ```
 */
export function isDark(color: string | EsdoraColor): boolean | null {
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

  // 使用 OKLCH 的亮度通道来判断，阈值为 0.5
  // 注意：OKLCH 的 L 值范围是 0-1，0.5 是一个合理的阈值
  return (oklchColor.l ?? 1) < 0.5
}
