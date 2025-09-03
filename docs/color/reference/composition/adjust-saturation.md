---
title: adjustSaturation
description: adjustSaturation - 来自 Dora Pocket 的颜色“道具”，用于调整颜色的饱和度。
---

# adjustSaturation

<!-- 1. 简介：一句话核心功能描述 -->

在 HSL 色彩空间中精确调整颜色的饱和度。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 设置绝对饱和度值

```typescript
// 将红色的饱和度直接设置为 0.5
adjustSaturation('#ff0000', 0.5)
// => { mode: 'hsl', h: 0, s: 0.5, l: 0.5, alpha: 1 }

// 将饱和度设置为 0，颜色变为灰色
adjustSaturation('#ff0000', 0)
// => { mode: 'hsl', h: 0, s: 0, l: 0.5, alpha: 1 }
```

### 使用函数进行相对调整

```typescript
// 将当前饱和度降低一半
adjustSaturation('#ff0000', s => s * 0.5)
// => { mode: 'hsl', h: 0, s: 0.5, l: 0.5, alpha: 1 }

// 在当前饱和度基础上增加 0.2，并确保不超过 1
adjustSaturation('hsl(0, 50%, 50%)', s => s + 0.2)
// => { mode: 'hsl', h: 0, s: 0.7, l: 0.5, alpha: 1 }
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 调整任意有效颜色的饱和度。
 *
 * 此函数会先将任何输入颜色智能地转换为 HSL 色彩空间，
 * 然后再对饱和度 (S) 通道进行操作。
 * 最终返回的饱和度值将被限制在 [0, 1] 的有效范围内。
 *
 * @param color 基础颜色字符串（如 '#FF0000'）或颜色对象
 * @param adjuster 一个数字或一个函数来修改饱和度:
 *        - `number`: 设置一个绝对的饱和度值 (0 到 1)。
 *        - `(currentSaturation: number) => number`: 接收当前饱和度值并返回一个新值的函数。
 * @returns 一个新的、饱和度被调整后的 HSL 颜色对象，如果输入无效则返回 null
 */
export function adjustSaturation(color: string | EsdoraColor, adjuster: number | ((currentSaturation: number) => number)): EsdoraColor | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于饱和度范围**: 新的饱和度值将被自动限制（clamp）在 `0` (灰色) 到 `1` (最鲜艳) 的有效范围内。任何超出此范围的值都会被修正。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串、`null`、`undefined` 或无法解析的对象时，函数将返回 `null`。
- **关于未定义饱和度**: 如果输入的颜色对象中饱和度 (`s`) 值为 `undefined`，它将被当作 `0` 来处理，并在此基础上进行计算。
- **返回格式**: 函数总是返回一个 HSL 格式的颜色对象 (`{ mode: 'hsl', ... }`) 或 `null`。你需要使用其他函数（如 `formatHex`）来将其转换为更常见的格式。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/color/src/composition/adjust-saturation/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/color/src/composition/adjust-saturation/index.ts)
