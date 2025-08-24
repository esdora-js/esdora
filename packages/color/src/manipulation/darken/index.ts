import type { EsdoraColor } from '../../_internal/types'
import type { LightnessAdjuster } from '../../composition/adjust-lightness'
import { formatHex, formatHex8 } from 'culori/fn'
import { adjustLightness } from '../../composition/adjust-lightness'

/**
 * 按比例将颜色变暗，获得符合视觉感知的效果。
 * @param color 要操作的颜色，可以是字符串或一个 EsdoraColor 对象。
 * @param amount 变暗的比例 (0 to 1)。例如 `0.2` 表示变暗 20%。支持大于 1 的百分比值（如 `20` 表示 20%）。
 * @returns 返回一个十六进制颜色字符串，如果输入无效则返回 `null`。
 * @example
 * ```typescript
 * darken('#3498db', 0.2); // => '#2980b9'
 * darken('#3498db', 20);  // => '#2980b9' (相当于 20%)
 * darken('invalid', 0.2); // => null
 * ```
 */
export function darken(color: string | EsdoraColor, amount: number): string | null

/**
 * 使用自定义函数来调整颜色亮度，以实现变暗效果。
 * @remarks 这是一个高级用法，为你提供了完全的自定义控制权。
 * @param color 要操作的颜色，可以是字符串或一个 EsdoraColor 对象。
 * @param adjuster 接收当前亮度 `l` (0-1)，返回一个新的亮度值的函数。
 * @returns 返回一个十六进制颜色字符串，如果输入无效则返回 `null`。
 * @example
 * ```typescript
 * // 将亮度值固定减少 0.1
 * darken('#3498db', l => l - 0.1); // => '#2471a3'
 * // 将亮度设置为固定值
 * darken('#3498db', l => 0.3); // => '#1b4f72'
 * ```
 */
export function darken(color: string | EsdoraColor, adjuster: LightnessAdjuster): string | null

export function darken(color: string | EsdoraColor, amountOrAdjuster: number | LightnessAdjuster): string | null {
  let adjuster: LightnessAdjuster
  if (typeof amountOrAdjuster === 'function') {
    adjuster = amountOrAdjuster
  }
  else {
    // 智能归一化 amount 参数
    const ratio = amountOrAdjuster > 1 ? amountOrAdjuster / 100 : amountOrAdjuster
    adjuster = (l: number) => l * (1 - ratio)
  }

  const darkenColor = adjustLightness(color, adjuster)
  if (!darkenColor) {
    return null
  }

  // 遵循项目宪法第五条：Hex 格式化标准
  // 仅当颜色包含 Alpha 通道（透明度不为 1）时，才返回 8 位小写的 Hex 字符串
  if ((darkenColor.alpha ?? 1) < 1) {
    return formatHex8(darkenColor)
  }

  return formatHex(darkenColor)
}
