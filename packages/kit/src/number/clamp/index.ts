/**
 * 将一个数字限制在指定的最小和最大值之间（包含边界）。
 *
 * @remarks
 * 这个函数确保一个数值不会超出指定的范围。如果数值小于最小值，则返回最小值；
 * 如果数值大于最大值，则返回最大值；否则，返回数值本身。
 * 这是一个在处理动画、UI 控件（如音量条）和任何需要数值范围约束的场景中都非常有用的工具。
 *
 * @param number - 需要被限制范围的数字。
 * @param min - 范围的下限（最小值），默认为 0。
 * @param max - 范围的上限（最大值），默认为 1。
 * @returns 返回在 [min, max] 范围内的数字。
 *
 * @example
 * ```typescript
 * // 基础用法
 * clamp(5, 0, 10);   // => 5
 * clamp(-5, 0, 10);  // => 0
 * clamp(15, 0, 10);  // => 10
 *
 * // 使用默认范围
 * clamp(0.5);      // => 0.5
 * clamp(1.5);      // => 1
 *
 * // 即使 min 和 max 被意外写反，函数也能健壮地处理
 * clamp(5, 10, 0);   // => 5
 * ```
 */
export function clamp(number: number, min: number = 0, max: number = 1): number {
  // 确保 min 和 max 的顺序正确，使函数更健壮
  const realMin = Math.min(min, max)
  const realMax = Math.max(min, max)

  // 先确保不小于最小值，再确保不大于最大值
  return Math.min(Math.max(number, realMin), realMax)
}
