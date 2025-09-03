---
title: adjustHue
description: adjustHue - 来自 Dora Pocket 的颜色“道具”，用于以感知均匀的方式调整颜色的色相。
---

# adjustHue

<!-- 1. 简介：一句话核心功能描述 -->

以感知均匀的 OKLCH 色彩空间为基础，精确调整颜色的色相。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 设置绝对色相值

```typescript
// 将红色的色相设置为 180 度 (变为青色)
adjustHue('#FF0000', 180)
// => { mode: 'oklch', l: 0.6279..., c: 0.222..., h: 180 }

// 设置一个负值，它会自动标准化到 0-360 范围内
adjustHue('#FF0000', -30) // 等同于 330 度
// => { mode: 'oklch', l: 0.6279..., c: 0.222..., h: 330 }
```

### 使用函数进行相对调整

```typescript
// 在当前色相基础上增加 30 度
// 红色 (OKLCH 色相约为 29.23) + 30 度
adjustHue('#FF0000', h => h + 30)
// => { mode: 'oklch', l: 0.6279..., c: 0.222..., h: 59.23... }

// 即使结果超出 360，也会被自动标准化
adjustHue('hsl(350, 100%, 50%)', h => h + 20) // 350 + 20 = 370 -> 10
// => { mode: 'oklch', l: 0.6279..., c: 0.222..., h: 10 }
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 以感知均匀的方式，调整任意有效颜色的色相。
 *
 * 此函数会先将任何输入颜色智能地转换为 OKLCH 色彩空间，
 * 然后再对色相 (H) 通道进行操作，以确保调整效果最符合人类视觉感知。
 * 最终返回的色相值将被自动标准化到 [0, 360) 度范围内。
 *
 * @param color 基础颜色字符串（如 '#FF0000', 'red'）或颜色对象
 * @param adjuster 一个数字或一个函数来修改色相:
 *        - `number`: 设置一个绝对的色相值（单位：度）。
 *        - `(currentHue: number) => number`: 接收当前色相值并返回一个新值的函数。
 * @returns 一个新的、色相被调整后的 OKLCH 颜色对象，如果输入无效则返回 null
 */
export function adjustHue(color: string | EsdoraColor, adjuster: number | ((currentHue: number) => number)): EsdoraColor | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于色相范围**: 新的色相值将被自动标准化到 `0` 至 `360` 度的范围内。例如，`370` 会变为 `10`，`-30` 会变为 `330`。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串、`null`、`undefined` 或无法解析的对象时，函数将返回 `null`。
- **关于无色相颜色**: 如果输入一个没有色相的颜色（如灰色 `#808080`），其当前色相将被视为 `0`，并在此基础上进行计算。
- **返回格式**: 函数总是返回一个 OKLCH 格式的颜色对象 (`{ mode: 'oklch', ... }`) 或 `null`。你需要使用其他函数来将其转换为更常见的格式。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/color/src/composition/adjust-hue/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/color/src/composition/adjust-hue/index.ts)
