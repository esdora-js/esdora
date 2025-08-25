import type { Color as CuloriColor } from 'culori'

/**
 * Esdora RGB 颜色对象接口
 * @remarks r, g, b 值范围为 0-255，a 值范围为 0-1
 */
export interface EsdoraRgbColor {
  r: number
  g: number
  b: number
  a?: number
}

/**
 * Esdora HSL 颜色对象接口
 * @remarks h 值范围为 0-360，s, l 值范围为 0-100，a 值范围为 0-1
 */
export interface EsdoraHslColor {
  h: number
  s: number
  l: number
  a?: number
}

/**
 * Esdora OKLCH 颜色对象接口
 * @remarks l 值范围为 0-1，c 值范围为 0-0.4，h 值范围为 0-360，a 值范围为 0-1
 */
export interface EsdoraOklchColor {
  l: number
  c: number
  h: number
  a?: number
}

/**
 * Esdora 库内部使用的、标准化的颜色表示的【类型】。
 * 它是对底层 `culori` 颜色对象的类型别名，用于实现内部解耦。
 * @internal
 */
export type EsdoraColor = CuloriColor
