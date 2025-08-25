import type { EsdoraColor } from '../../_internal/types'
import type { SaturationAdjuster } from '../../composition/adjust-saturation'
import { formatHex, formatHex8 } from 'culori/fn'
import { adjustSaturation } from '../../composition/adjust-saturation'

/**
 * 按比例将颜色饱和化，获得符合视觉感知的效果。
 * @param color 要操作的颜色，可以是字符串或一个 EsdoraColor 对象。
 * @param amount 饱和化的比例 (0 to 1)。例如 `0.2` 表示增加饱和度 20%。支持大于 1 的百分比值（如 `20` 表示 20%）。
 * @returns 返回一个十六进制颜色字符串，如果输入无效则返回 `null`。
 * @example
 * ```typescript
 * saturate('#3498db', 0.2); // => '#2e8ce6'
 * saturate('#3498db', 20);  // => '#2e8ce6' (相当于 20%)
 * saturate('invalid', 0.2); // => null
 * ```
 */
export function saturate(color: string | EsdoraColor, amount: number): string | null

/**
 * 使用自定义函数来调整颜色饱和度，以实现饱和化效果。
 * @remarks 这是一个高级用法，为你提供了完全的自定义控制权。
 * @param color 要操作的颜色，可以是字符串或一个 EsdoraColor 对象。
 * @param adjuster 接收当前饱和度 `s` (0-1)，返回一个新的饱和度值的函数。
 * @returns 返回一个十六进制颜色字符串，如果输入无效则返回 `null`。
 * @example
 * ```typescript
 * // 将饱和度值固定增加 0.1
 * saturate('#3498db', s => s + 0.1); // => '#2e8ce6'
 * // 将饱和度设置为固定值
 * saturate('#3498db', s => 0.8); // => '#1f7dd4'
 * ```
 */
export function saturate(color: string | EsdoraColor, adjuster: SaturationAdjuster): string | null

// --- 这是不对用户暴露的、统一的实现函数 ---

export function saturate(color: string | EsdoraColor, amountOrAdjuster: number | SaturationAdjuster): string | null {
  let adjuster: SaturationAdjuster
  if (typeof amountOrAdjuster === 'function') {
    adjuster = amountOrAdjuster
  }
  else {
    // 智能归一化 amount 参数
    const ratio = amountOrAdjuster > 1 ? amountOrAdjuster / 100 : amountOrAdjuster
    adjuster = (s: number) => s + (1 - s) * ratio
  }

  const saturatedColor = adjustSaturation(color, adjuster)
  if (!saturatedColor) {
    return null
  }

  // 遵循项目宪法第五条：Hex 格式化标准
  // 仅当颜色包含 Alpha 通道（透明度不为 1）时，才返回 8 位小写的 Hex 字符串
  if ((saturatedColor.alpha ?? 1) < 1) {
    return formatHex8(saturatedColor)
  }

  return formatHex(saturatedColor)
}
