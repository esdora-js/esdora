import type { EsdoraColor } from '../../_internal/types'
import { inGamut } from 'culori'
import { parseColor } from '../../_internal/parser'

/**
 * 检查一个颜色是否在指定的色域范围内。
 *
 * @param color 要检查的颜色字符串或颜色对象
 * @param gamut 目标色域，支持 'rgb' 和 'p3'，默认为 'rgb'
 * @returns 如果颜色在指定色域内，则返回 `true`；如果超出色域，则返回 `false`；如果输入无效，则返回 `null`
 *
 * @example
 * ```typescript
 * isInGamut('#FF0000');           // => true (红色在 RGB 色域内)
 * isInGamut('#FF0000', 'rgb');    // => true
 * isInGamut('#FF0000', 'p3');     // => true
 * isInGamut('invalid');           // => null
 * ```
 */
export function isInGamut(color: string | EsdoraColor, gamut: 'rgb' | 'p3' = 'rgb'): boolean | null {
  const parsed = parseColor(color)

  if (!parsed)
    return null

  try {
    return inGamut(gamut)(parsed)
  }
  catch {
    return null
  }
}
