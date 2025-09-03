---
title: darken
description: darken - 来自 Dora Pocket 的颜色“道具”，用于按比例将颜色变暗以获得符合视觉感知的效果。
---

# darken

<!-- 1. 简介：一句话核心功能描述 -->

按比例将颜色变暗，或使用自定义函数精确控制亮度降低。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 将颜色变暗 20%
darken('#3498db', 0.2)
// => '#2980b9'

// 也可以使用 0-100 的百分比数值
darken('#3498db', 20)
// => '#2980b9'
```

### 使用函数进行高级调整

```typescript
// 使用自定义函数，将当前亮度值 (l) 减去 0.1
darken('#3498db', l => l - 0.1)
// => '#2471a3'

// 也可以将亮度设置为一个固定的值
darken('#3498db', l => 0.3)
// => '#1b4f72'
```

### 处理带透明度的颜色

```typescript
// 如果输入颜色包含透明度，输出将是 8 位的十六进制格式
darken('rgba(255, 0, 0, 0.8)', 0.3)
// => '#c00000cc'
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 按比例将颜色变暗，获得符合视觉感知的效果。
 *
 * @param color 要操作的颜色，可以是字符串（如 hex, rgb, hsl）或一个 EsdoraColor 对象。
 * @param amount 变暗的比例 (0 to 1)。例如 `0.2` 表示变暗 20%。支持大于 1 的百分比值（如 `20` 表示 20%）。
 * @returns 返回一个十六进制颜色字符串，如果输入无效则返回 `null`。
 */
export function darken(color: string | EsdoraColor, amount: number): string | null

/**
 * 使用自定义函数来调整颜色亮度，以实现变暗效果。
 * 这是一个高级用法，为你提供了完全的自定义控制权。
 *
 * @param color 要操作的颜色，可以是字符串（如 hex, rgb, hsl）或一个 EsdoraColor 对象。
 * @param adjuster 接收当前亮度 `l` (0-1)，返回一个新的亮度值的函数。
 * @returns 返回一个十六进制颜色字符串，如果输入无效则返回 `null`。
 */
export function darken(color: string | EsdoraColor, adjuster: (l: number) => number): string | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于变暗比例 (`amount`)**: 当 `amount` 是一个数字时，如果值大于 1，将被视为百分比（例如 `20` 会被当作 `0.2` 处理）。如果值为 `0`，函数将返回原始颜色。
- **关于输出格式**: 无论输入颜色格式是什么（如 `rgb` 或 `hsl`），`darken` 函数的输出始终是十六进制（`#rrggbbaa` 或 `#rrggbb`）字符串。
- **关于透明度**: 如果输入的颜色带有 Alpha 通道（透明度不为 1），输出将是一个 8 位的十六进制字符串。否则，将输出 6 位十六进制字符串。
- **关于无效输入**: 如果 `color` 参数是无效的颜色字符串、`null` 或 `undefined`，函数将返回 `null`。
- **关于黑色**: 对黑色（如 `#000000`）应用 `darken` 将不会改变颜色，始终返回 `#000000`。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/color/src/manipulation/darken/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/color/src/manipulation/darken/index.ts)
