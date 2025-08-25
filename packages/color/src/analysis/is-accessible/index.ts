import type { EsdoraColor } from '../../_internal/types'
import { getContrast } from '../get-contrast'

export interface AccessibilityOptions {
  /**
   * WCAG 可访问性级别
   * - 'AA': 标准级别，对比度要求 4.5:1 (普通文本) 或 3:1 (大文本)
   * - 'AAA': 增强级别，对比度要求 7:1 (普通文本) 或 4.5:1 (大文本)
   */
  level?: 'AA' | 'AAA'

  /**
   * 文本大小
   * - 'normal': 普通文本 (小于 18pt 或 14pt 粗体)
   * - 'large': 大文本 (18pt 及以上或 14pt 粗体及以上)
   */
  size?: 'normal' | 'large'
}

/**
 * 检查两种颜色之间的对比度是否符合 WCAG 可访问性标准。
 *
 * @param color1 第一个颜色（通常是文本颜色）
 * @param color2 第二个颜色（通常是背景颜色）
 * @param options 可访问性选项
 * @returns 如果符合可访问性标准则返回 `true`，不符合则返回 `false`，输入无效则返回 `null`
 *
 * @example
 * ```typescript
 * // 检查黑色文本在白色背景上是否可访问（默认 AA 级别，普通文本）
 * isAccessible('#000000', '#FFFFFF'); // => true
 *
 * // 检查灰色文本在白色背景上是否符合 AAA 级别
 * isAccessible('#767676', '#FFFFFF', { level: 'AAA' }); // => false
 *
 * // 检查大文本的可访问性
 * isAccessible('#767676', '#FFFFFF', { level: 'AA', size: 'large' }); // => true
 *
 * // 无效输入
 * isAccessible('invalid', '#FFFFFF'); // => null
 * ```
 */
export function isAccessible(
  color1: string | EsdoraColor,
  color2: string | EsdoraColor,
  options: AccessibilityOptions = {},
): boolean | null {
  const { level = 'AA', size = 'normal' } = options

  // 获取对比度
  const contrast = getContrast(color1, color2)

  if (contrast === null) {
    return null
  }

  // 根据级别和文本大小确定最小对比度要求
  let minContrast: number

  if (level === 'AA') {
    minContrast = size === 'large' ? 3 : 4.5
  }
  else { // AAA
    minContrast = size === 'large' ? 4.5 : 7
  }

  return contrast >= minContrast
}
