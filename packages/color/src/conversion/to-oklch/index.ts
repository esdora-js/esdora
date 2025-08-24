import type { EsdoraColor, EsdoraOklchColor } from '../../_internal/types'
import { oklch } from 'culori'
import { parseColor } from '../../_internal/parser'

/**
 * 将颜色对象转换为 OKLCH 对象。
 *
 * @param color 任意合法的颜色
 * @returns 一个包含 l, c, h 属性的 OKLCH 颜色对象，如果输入无效则返回 `null`。
 *
 * @example
 * ```typescript
 * toOklch('#FF0000'); // => { l: 0.628, c: 0.258, h: 29.234 }
 * toOklch('rgba(255, 0, 0, 0.5)'); // => { l: 0.628, c: 0.258, h: 29.234, a: 0.5 }
 * toOklch('rgb(255, 0, 0)'); // => { l: 0.628, c: 0.258, h: 29.234 }
 * toOklch({ r: 255, g: 0, b: 0 }); // => { l: 0.628, c: 0.258, h: 29.234 }
 * toOklch('invalid'); // => null
 * ```
 */
export function toOklch(color: string | EsdoraColor): EsdoraOklchColor | null {
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

  const result: EsdoraOklchColor = {
    l: Math.round((oklchColor.l ?? 0) * 1000) / 1000, // 保留3位小数
    c: Math.round((oklchColor.c ?? 0) * 1000) / 1000, // 保留3位小数
    h: Math.round((oklchColor.h ?? 0) * 1000) / 1000, // 保留3位小数
  }

  // 仅当透明度不为 1 时才添加 a 属性
  const alpha = oklchColor.alpha ?? 1
  if (alpha < 1) {
    result.a = alpha
  }

  return result
}
