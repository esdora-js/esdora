---
title: adjustChroma
description: adjustChroma - 来自 Dora Pocket 的颜色“道具”，用于以感知均匀的方式调整颜色的色度（饱和度）。
---

# adjustChroma

<!-- 1. 简介：一句话核心功能描述 -->

以感知均匀的 OKLCH 色彩空间为基础，精确调整颜色的色度（饱和度）。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 设置绝对色度值

```typescript
// 将红色的色度直接设置为 0.1
adjustChroma('#FF0000', 0.1)
// => { mode: 'oklch', l: 0.6279..., c: 0.1, h: 29.23... }

// 将色度设置为 0，颜色变为灰色
adjustChroma('#FF0000', 0)
// => { mode: 'oklch', l: 0.6279..., c: 0, h: 29.23... }
```

### 使用函数进行相对调整

```typescript
// 将当前色度减半
adjustChroma('#FF0000', c => c * 0.5)
// => { mode: 'oklch', l: 0.6279..., c: 0.1114..., h: 29.23... }

// 增加 0.05 的色度，并确保不超过范围
adjustChroma('#FF0000', c => c + 0.05)
// => { mode: 'oklch', l: 0.6279..., c: 0.2728..., h: 29.23... }
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 以感知均匀的方式，调整任意有效颜色的色度（饱和度）。
 *
 * 此函数会先将任何输入颜色智能地转换为 OKLCH 色彩空间，
 * 然后再对色度 (C) 通道进行操作，以确保调整效果最符合人类视觉感知。
 * 最终返回的色度值将被限制在 [0, 0.4] 的有效范围内。
 *
 * @param color 基础颜色字符串（如 '#FF0000'）或颜色对象
 * @param adjuster 一个数字或一个函数来修改色度:
 *        - `number`: 设置一个绝对的色度值。
 *        - `(currentChroma: number) => number`: 接收当前色度值并返回一个新值的函数。
 * @returns 一个新的、色度被调整后的 OKLCH 颜色对象，如果输入无效则返回 null
 */
export function adjustChroma(color: string | EsdoraColor, adjuster: number | ((currentChroma: number) => number)): EsdoraColor | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于色度范围**: 新的色度值将被自动限制（clamp）在 `0` 到 `0.4` 的有效范围内，无论是通过数字直接设置还是函数计算，超出此范围的值都会被修正。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串、`null`、`undefined` 或无法解析的对象时，函数将返回 `null`。
- **关于无色度颜色**: 如果输入一个没有色度的颜色（如灰色 `#808080`），其当前色度将被视为 `0`，并在此基础上进行计算。
- **返回格式**: 函数总是返回一个 OKLCH 格式的颜色对象 (`{ mode: 'oklch', ... }`) 或 `null`。你需要使用其他函数（如 `formatHex`）来将其转换为更常见的格式。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/composition/adjust-chroma/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/composition/adjust-chroma/index.ts)
