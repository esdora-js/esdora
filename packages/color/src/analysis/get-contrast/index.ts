import type { EsdoraColor } from '../../_internal/types'
import { wcagContrast } from 'culori/fn'
import { parseColor } from '../../_internal/parser'

/**
 * 计算两种颜色之间的对比度。
 *
 * @remarks
 * 这个函数对于确保文本和背景色符合 WCAG (Web Content Accessibility Guidelines)
 * 等可访问性标准至关重要。一个常见的标准是，普通文本的对比度应至少为 4.5:1。
 * 返回值的范围为 1 到 21。
 *
 * @param color1 第一个颜色字符串。
 * @param color2 第二个颜色字符串。
 * @returns 两种颜色之间的对比度数值。
 *
 * @example
 * ```typescript
 * const contrast = getContrast('#FFFFFF', '#000000');
 * // contrast => 21
 *
 * const lowContrast = getContrast('#808080', '#FFFFFF');
 * // lowContrast => 2.15
 * ```
 */
export function getContrast(color1: string | EsdoraColor, color2: string | EsdoraColor): number | null {
  const parsed1 = parseColor(color1)

  const parsed2 = parseColor(color2)

  if (!parsed1 || !parsed2) {
    return null
  }

  const ratio = wcagContrast(parsed1, parsed2)

  return ratio
}
