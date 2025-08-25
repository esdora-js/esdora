import type { EsdoraColor } from '../../_internal/types'
import { clamp } from '@esdora/kit'
import { formatHex, formatHex8 } from 'culori/fn'
import { parseColor } from '../../_internal/parser'

/**
 * 设置颜色的透明度（alpha 通道）到指定值。
 *
 * @remarks
 * 此函数会将颜色的透明度设置为指定的值，而不改变颜色的其他属性（色相、饱和度、亮度）。
 * 返回十六进制格式的颜色字符串。
 *
 * @param color - 基础颜色字符串或颜色对象，支持 hex、rgb、hsl 等格式
 * @param alpha - 新的透明度值，取值范围 0-1（0 为完全透明，1 为完全不透明）
 * @returns 设置透明度后的十六进制颜色字符串
 *
 * @example
 * ```typescript
 * // 设置透明度
 * setAlpha('#ff0000', 0.5); // => '#ff000080' (50% 透明的红色)
 * setAlpha('red', 0.3);     // => '#ff00004d' (30% 透明的红色)
 * setAlpha('rgb(255, 0, 0)', 0.8); // => '#ff0000cc'
 * setAlpha('hsl(0, 100%, 50%)', 0.6); // => '#ff000099'
 * ```
 */
export function setAlpha(color: string | EsdoraColor, alpha: number): string | null {
  // 限制 alpha 值在 0-1 范围内
  const clampedAlpha = clamp(alpha, 0, 1)

  const parsed = parseColor(color)
  if (!parsed) {
    return null
  }

  // 创建新的颜色对象，设置新的透明度
  const newColor: EsdoraColor = {
    ...parsed,
    alpha: clampedAlpha,
  }

  // 如果透明度是 1，使用标准 hex 格式
  if (clampedAlpha === 1) {
    return formatHex(newColor)
  }

  // 如果透明度小于 1，使用 8 位 hex 格式（包含透明度）
  return formatHex8(newColor)
}
