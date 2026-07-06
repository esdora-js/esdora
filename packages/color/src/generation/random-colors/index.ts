import type { RandomColorOptions } from '../random-color'
import { randomColor } from '../random-color'

/**
 * 生成指定数量的随机颜色数组。
 *
 * @param count - 要生成的颜色数量
 * @param options - 随机颜色生成选项
 * @returns 生成的随机颜色数组
 *
 * @example
 * ```typescript
 * // 生成5个随机颜色
 * randomColors(5); // => ['#a7c4e8', '#ff6b9d', '#4ecdc4', '#ffe66d', '#ff6b6b']
 *
 * // 生成3个明亮的颜色
 * randomColors(3, { preset: 'bright' }); // => ['#ff3366', '#33ff66', '#3366ff']
 * ```
 */
export function randomColors(count: number, options: RandomColorOptions = {}): string[] {
  const colors: string[] = []
  for (let i = 0; i < count; i++) {
    const color = randomColor(options)
    if (color) {
      colors.push(color)
    }
  }
  return colors
}
