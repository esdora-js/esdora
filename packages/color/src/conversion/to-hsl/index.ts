import type { EsdoraColor, EsdoraHslColor } from '../../_internal/types'
import { hsl } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

/**
 * 将颜色对象转换为 HSL 对象。
 *
 * @param color 任意合法的颜色
 * @returns 一个包含 h, s, l 属性的 HSL 颜色对象，如果输入无效则返回 `null`。
 *
 * @example
 * ```typescript
 * toHsl('#FF0000'); // => { h: 0, s: 100, l: 50 }
 * toHsl('rgba(255, 0, 0, 0.5)'); // => { h: 0, s: 100, l: 50, a: 0.5 }
 * toHsl('rgb(255, 0, 0)'); // => { h: 0, s: 100, l: 50 }
 * toHsl({ r: 255, g: 0, b: 0 }); // => { h: 0, s: 100, l: 50 }
 * toHsl('invalid'); // => null
 * ```
 */
export function toHsl(color: string | EsdoraColor): EsdoraHslColor | null {
  const parsed = parseColor(color)
  if (!parsed)
    return null

  let hslColor
  try {
    hslColor = hsl(parsed)
  }
  catch {
    return null
  }

  const result: EsdoraHslColor = {
    h: Math.round(hslColor.h ?? 0),
    s: Math.round((hslColor.s ?? 0) * 100),
    l: Math.round((hslColor.l ?? 0) * 100),
  }

  // 仅当透明度不为 1 时才添加 a 属性
  const alpha = hslColor.alpha ?? 1
  if (alpha < 1) {
    result.a = alpha
  }

  return result
}
