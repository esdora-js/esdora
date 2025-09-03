---
title: adjustLightness
description: adjustLightness - 来自 Dora Pocket 的颜色“道具”，用于以感知均匀的方式调整颜色的亮度。
---

# adjustLightness

<!-- 1. 简介：一句话核心功能描述 -->

以感知均匀的 OKLCH 色彩空间为基础，精确调整颜色的亮度。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 设置绝对亮度值

```typescript
// 将红色的亮度设置为 0.5
adjustLightness('#ff0000', 0.5)
// => { mode: 'oklch', l: 0.5, c: 0.222..., h: 29.23... }

// 将亮度设置为 1，颜色变为白色
adjustLightness('#ff0000', 1)
// => { mode: 'oklch', l: 1, c: 0.222..., h: 29.23... }
```

### 使用函数进行相对调整

```typescript
// 将当前亮度降低一半
adjustLightness('#ff0000', l => l * 0.5)
// => { mode: 'oklch', l: 0.3139..., c: 0.222..., h: 29.23... }

// 在当前亮度基础上增加 0.2，并确保不超过 1
adjustLightness('#ff0000', l => l + 0.2)
// => { mode: 'oklch', l: 0.8279..., c: 0.222..., h: 29.23... }
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 以感知均匀的方式，调整任意有效颜色的亮度。
 *
 * 此函数会先将任何输入颜色智能地转换为 OKLCH 色彩空间，
 * 然后再对亮度 (L) 通道进行操作，以确保调整效果最符合人类视觉感知。
 * 最终返回的亮度值将被限制在 [0, 1] 的有效范围内。
 *
 * @param color 基础颜色字符串（如 '#FF0000'）或颜色对象
 * @param adjuster 一个数字或一个函数来修改亮度:
 *        - `number`: 设置一个绝对的亮度值 (0 到 1)。
 *        - `(currentLightness: number) => number`: 接收当前亮度值并返回一个新值的函数。
 * @returns 一个新的、亮度被调整后的 OKLCH 颜色对象，如果输入无效则返回 null
 */
export function adjustLightness(color: string | EsdoraColor, adjuster: number | ((currentLightness: number) => number)): EsdoraColor | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于亮度范围**: 新的亮度值将被自动限制（clamp）在 `0` (纯黑) 到 `1` (纯白) 的有效范围内。任何超出此范围的值都会被修正。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串、`null`、`undefined` 或无法解析的对象时，函数将返回 `null`。
- **返回格式**: 函数总是返回一个 OKLCH 格式的颜色对象 (`{ mode: 'oklch', ... }`) 或 `null`。你需要使用其他函数（如 `formatHex`）来将其转换为更常见的格式。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/composition/adjust-lightness/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/composition/adjust-lightness/index.ts)
