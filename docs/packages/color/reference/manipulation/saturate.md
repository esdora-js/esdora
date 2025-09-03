---
title: saturate
description: saturate - 来自 Dora Pocket 的颜色“道具”，用于按比例将颜色饱和化以获得符合视觉感知的效果。
---

# saturate

<!-- 1. 简介：一句话核心功能描述 -->

按比例增加颜色的饱和度，或使用自定义函数精确控制饱和化效果。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 将颜色的饱和度增加 20%
saturate('#3498db', 0.2)
// => '#2e8ce6'

// 也可以使用 0-100 的百分比数值
saturate('#3498db', 20)
// => '#2e8ce6'
```

### 为灰色添加色彩

```typescript
// 对灰色进行饱和化会为其添加色彩（通常是红色调）
saturate('#808080', 0.3)
// => '#a65a5a'
```

### 使用函数进行高级调整

```typescript
// 使用自定义函数，将当前饱和度值 (s) 增加 0.1
saturate('#3498db', s => s + 0.1)
// => '#2e8ce6'

// 也可以将饱和度设置为一个固定的值
saturate('#3498db', s => 0.8)
// => '#1f7dd4'
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 按比例将颜色饱和化，获得符合视觉感知的效果。
 *
 * @param color 要操作的颜色，可以是字符串（如 hex, rgb, hsl, 'red'）或一个 EsdoraColor 对象。
 * @param amount 饱和化的比例 (0 to 1)。例如 `0.2` 表示增加饱和度 20%。支持大于 1 的百分比值（如 `20` 表示 20%）。
 * @returns 返回一个十六进制颜色字符串，如果输入无效则返回 `null`。
 */
export function saturate(color: string | EsdoraColor, amount: number): string | null

/**
 * 使用自定义函数来调整颜色饱和度，以实现饱和化效果。
 * 这是一个高级用法，为你提供了完全的自定义控制权。
 *
 * @param color 要操作的颜色，可以是字符串（如 hex, rgb, hsl, 'red'）或一个 EsdoraColor 对象。
 * @param adjuster 接收当前饱和度 `s` (0-1)，返回一个新的饱和度值的函数。
 * @returns 返回一个十六进制颜色字符串，如果输入无效则返回 `null`。
 */
export function saturate(color: string | EsdoraColor, adjuster: (s: number) => number): string | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于饱和化比例 (`amount`)**: 当 `amount` 是一个数字时，如果值大于 1，将被视为百分比（例如 `20` 会被当作 `0.2` 处理）。如果值为 `0`，函数将返回原始颜色。值为 `1` 或 `100` 会使颜色达到最大饱和度。
- **关于输出格式**: 无论输入颜色格式是什么（如 `rgb` 或 `hsl`），`saturate` 函数的输出始终是十六进制（`#rrggbbaa` 或 `#rrggbb`）字符串。
- **关于透明度**: 函数会保持原色的透明度。如果输入的颜色带有 Alpha 通道（透明度不为 1），输出将是一个 8 位的十六进制字符串。
- **关于无效输入**: 如果 `color` 参数是无效的颜色字符串、`null` 或 `undefined`，函数将返回 `null`。
- **关于无饱和度颜色**: 对本身没有色相的颜色（如白色、黑色）应用 `saturate` 将不会改变颜色。对灰色应用 `saturate` 则会为其增加色相（通常是红色调）。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/manipulation/saturate/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/manipulation/saturate/index.ts)
