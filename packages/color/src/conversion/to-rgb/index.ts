import type { EsdoraColor, EsdoraRgbColor } from '../../_internal/types'
import { rgb } from '../../_internal/format'
import { parseColor } from '../../_internal/parser'

/**
 * 将颜色对象转换为 RGB 对象。
 *
 * @param color 任意合法的颜色
 * @returns 一个包含 r, g, b 属性的 RGB 颜色对象，如果输入无效则返回 `null`。
 *
 * @example
 * ```typescript
 * toRgb('#FF0000'); // => { r: 255, g: 0, b: 0 }
 * toRgb('rgba(255, 0, 0, 0.5)'); // => { r: 255, g: 0, b: 0, a: 0.5 }
 * toRgb('hsl(0, 100%, 50%)'); // => { r: 255, g: 0, b: 0 }
 * toRgb({ h: 0, s: 100, l: 50 }); // => { r: 255, g: 0, b: 0 }
 * toRgb('invalid'); // => null
 * ```
 */
export function toRgb(color: string | EsdoraColor): EsdoraRgbColor | null {
  const parsed = parseColor(color)
  if (!parsed)
    return null

  let rgbColor
  try {
    rgbColor = rgb(parsed)
  }
  catch {
    return null
  }

  const result: EsdoraRgbColor = {
    r: Math.round((rgbColor.r ?? 0) * 255),
    g: Math.round((rgbColor.g ?? 0) * 255),
    b: Math.round((rgbColor.b ?? 0) * 255),
  }

  // 仅当透明度不为 1 时才添加 a 属性
  const alpha = rgbColor.alpha ?? 1
  if (alpha < 1) {
    result.a = alpha
  }

  return result
}
