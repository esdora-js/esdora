import type { EsdoraColor } from './types'
import { parse } from 'culori'

/**
 * 标准化开发者习惯的颜色对象格式，将其转换为 culori 兼容的格式。
 *
 * @remarks
 * 此函数专门处理开发者常用的格式，如 `rgb({r: 255, g: 0, b: 0})`，
 * 自动检测并转换 0-255 范围的 RGB 值和百分比形式的 HSL 值。
 *
 * @param obj 待标准化的颜色对象
 * @param mode 颜色模式 ('rgb' 或 'hsl')
 * @returns 标准化后的 culori 颜色对象
 * @internal
 */
function normalizeColorObject(obj: any, mode: 'rgb' | 'hsl'): EsdoraColor {
  const alpha = obj.alpha ?? obj.a ?? 1

  if (mode === 'rgb') {
    return {
      mode: 'rgb',
      r: obj.r > 1 ? obj.r / 255 : obj.r, // 自动检测并转换 0-255 到 0-1
      g: obj.g > 1 ? obj.g / 255 : obj.g,
      b: obj.b > 1 ? obj.b / 255 : obj.b,
      alpha,
    }
  }
  else {
    return {
      mode: 'hsl',
      h: obj.h,
      s: obj.s > 1 ? obj.s / 100 : obj.s, // 自动检测并转换百分比到 0-1
      l: obj.l > 1 ? obj.l / 100 : obj.l,
      alpha,
    }
  }
}

/**
 * 智能解析任何颜色输入，专门为开发者习惯的格式提供预处理，然后完全委托给 culori。
 *
 * @remarks
 * 此函数的核心职责是为 `rgb({r: 255, g: 0, b: 0})` 这种开发者习惯的格式
 * 进行预处理和归一化，对于所有其他输入格式（字符串、标准 culori 对象等），
 * 直接、无条件地委托给 culori 的 parse 函数。
 *
 * @param color 任意颜色输入
 * @returns 标准化的 culori 颜色对象，如果输入无效则返回 null
 * @internal
 */
export function parseColor(color: unknown): EsdoraColor | null {
  // 如果是对象，检查是否需要我们的自定义归一化逻辑
  if (typeof color === 'object' && color !== null) {
    const obj = color as any

    // 处理开发者习惯的 RGB 格式：{r: 255, g: 0, b: 0}
    if ('r' in obj && 'g' in obj && 'b' in obj && !('mode' in obj)) {
      return normalizeColorObject(obj, 'rgb')
    }

    // 处理开发者习惯的 HSL 格式：{h: 180, s: 100, l: 50}
    if ('h' in obj && 's' in obj && 'l' in obj && !('mode' in obj)) {
      return normalizeColorObject(obj, 'hsl')
    }

    // 处理有 mode 但需要归一化的 RGB 格式
    if (obj.mode === 'rgb' && 'r' in obj && 'g' in obj && 'b' in obj) {
      if (obj.r > 1 || obj.g > 1 || obj.b > 1) {
        return normalizeColorObject(obj, 'rgb')
      }
      // 如果已经是标准化的，直接返回
      return obj as EsdoraColor
    }

    // 处理有 mode 但需要归一化的 HSL 格式
    if (obj.mode === 'hsl' && 'h' in obj && 's' in obj && 'l' in obj) {
      if (obj.s > 1 || obj.l > 1) {
        return normalizeColorObject(obj, 'hsl')
      }
      // 如果已经是标准化的，直接返回
      return obj as EsdoraColor
    }

    // 对于其他 culori 模式（如 oklch），直接返回
    if ('mode' in obj) {
      return obj as EsdoraColor
    }
  }

  // 对于所有其他输入格式，完全委托给 culori
  return parse(color as any) ?? null
}
