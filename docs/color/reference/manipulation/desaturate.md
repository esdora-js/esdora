---
title: desaturate
description: desaturate - 来自 Dora Pocket 的颜色“道具”，用于按比例将颜色去饱和化以获得符合视觉感知的效果。
---

# desaturate

<!-- 1. 简介：一句话核心功能描述 -->

按比例降低颜色的饱和度，或使用自定义函数精确控制去饱和效果。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 将颜色的饱和度降低 20%
desaturate('#3498db', 0.2)
// => '#4595ca'

// 也可以使用 0-100 的百分比数值
desaturate('#3498db', 20)
// => '#4595ca'
```

### 完全去饱和 (灰度化)

```typescript
// 将 amount 设置为 1 或 100，可以实现完全去饱和，将颜色变为灰度
desaturate('#ff0000', 1)
// => '#808080'
```

### 使用函数进行高级调整

```typescript
// 使用自定义函数，将当前饱和度值 (s) 减去 0.1
desaturate('#3498db', s => s - 0.1)
// => '#4a9bd1'

// 也可以将饱和度设置为一个固定的值
desaturate('#3498db', s => 0.3)
// => '#6ba3c7'
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 按比例将颜色去饱和化，获得符合视觉感知的效果。
 *
 * @param color 要操作的颜色，可以是字符串（如 hex, rgb, hsl, 'red'）或一个 EsdoraColor 对象。
 * @param amount 去饱和化的比例 (0 to 1)。例如 `0.2` 表示降低饱和度 20%。支持大于 1 的百分比值（如 `20` 表示 20%）。
 * @returns 返回一个十六进制颜色字符串，如果输入无效则返回 `null`。
 */
export function desaturate(color: string | EsdoraColor, amount: number): string | null

/**
 * 使用自定义函数来调整颜色饱和度，以实现去饱和化效果。
 * 这是一个高级用法，为你提供了完全的自定义控制权。
 *
 * @param color 要操作的颜色，可以是字符串（如 hex, rgb, hsl, 'red'）或一个 EsdoraColor 对象。
 * @param adjuster 接收当前饱和度 `s` (0-1)，返回一个新的饱和度值的函数。
 * @returns 返回一个十六进制颜色字符串，如果输入无效则返回 `null`。
 */
export function desaturate(color: string | EsdoraColor, adjuster: (s: number) => number): string | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于去饱和比例 (`amount`)**: 当 `amount` 是一个数字时，如果值大于 1，将被视为百分比（例如 `20` 会被当作 `0.2` 处理）。如果值为 `0`，函数将返回原始颜色。值为 `1` 或 `100` 会使颜色完全灰度化。
- **关于输出格式**: 无论输入颜色格式是什么（如 `rgb` 或 `hsl`），`desaturate` 函数的输出始终是十六进制（`#rrggbbaa` 或 `#rrggbb`）字符串。
- **关于透明度**: 函数会保持原色的透明度。如果输入的颜色带有 Alpha 通道（透明度不为 1），输出将是一个 8 位的十六进制字符串。否则，将输出 6 位十六进制字符串。
- **关于无效输入**: 如果 `color` 参数是无效的颜色字符串、`null` 或 `undefined`，函数将返回 `null`。
- **关于无饱和度颜色**: 对本身没有饱和度的颜色（如灰色、白色、黑色）应用 `desaturate` 将不会改变颜色。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/color/src/manipulation/desaturate/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/color/src/manipulation/desaturate/index.ts)
