import type { EsdoraColor } from '../../_internal/types'
import { isDark } from '../is-dark'

/**
 * 检查一个颜色是否是“亮色”。
 *
 * @param color 要检查的颜色字符串或颜色对象
 * @returns 如果颜色被认为是亮色，则返回 `true`；如果是暗色，则返回 `false`；如果输入无效，则返回 `null`
 *
 * @example
 * ```typescript
 * isLight('#FFFFFF'); // => true
 * isLight('#000000'); // => false
 * isLight('yellow');  // => true
 * isLight('invalid'); // => null
 * ```
 */
export function isLight(color: string | EsdoraColor): boolean | null {
  const darkResult = isDark(color)

  if (darkResult === null)
    return null

  return !darkResult
}
