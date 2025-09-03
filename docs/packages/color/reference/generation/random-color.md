---
title: randomColor
description: randomColor / randomColors - 来自 Dora Pocket 的颜色“道具”，用于生成具有可配置约束的随机颜色。
---

# randomColor / randomColors

<!-- 1. 简介：一句话核心功能描述 -->

生成一个或多个具有可配置约束（如色相、饱和度、亮度、格式）的随机颜色。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 不带任何参数，生成一个随机的十六进制颜色
randomColor()
// => '#a3b8d1' (示例输出)

// 使用 randomColors 生成一个包含 3 个随机颜色的数组
randomColors(3)
// => ['#f1c40f', '#8e44ad', '#3498db'] (示例输出)
```

### 指定格式与预设

```typescript
// 生成一个柔和色调 (pastel) 的 HSL 格式颜色
randomColor({ preset: 'pastel', format: 'hsl' })
// => 'hsl(208.7, 33.3%, 80%)' (示例输出)

// 生成一组 4 个深色的 RGB 格式颜色
randomColors(4, { preset: 'dark', format: 'rgb' })
// => ['rgb(52, 73, 94)', 'rgb(120, 2, 45)', 'rgb(22, 102, 98)', 'rgb(91, 44, 111)'] (示例输出)
```

### 自定义范围与透明度

```typescript
// 生成一个指定范围内的、半透明的 RGBA 颜色
randomColor({
  hue: [0, 60], // 红色到黄色之间
  lightness: [70, 90], // 较亮的颜色
  alpha: 0.5, // 50% 的透明度
  format: 'rgb'
})
// => 'rgba(255, 230, 204, 0.5)' (示例输出)
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 生成一个随机颜色字符串。
 *
 * @param options (可选) 生成颜色的配置选项。
 * @param options.format (可选) 输出颜色格式。
 * @param options.preset (可选) 使用预设的颜色范围，如 'bright', 'dark', 'pastel' 等。
 * @param options.hue (可选) 色相值或范围 (0-360)。
 * @param options.saturation (可选) 饱和度值或范围 (0-100)。
 * @param options.lightness (可选) 亮度值或范围 (0-100)。
 * @param options.alpha (可选) 透明度值或范围 (0-1)。
 * @returns 一个随机颜色字符串。
 * @default
 */
export function randomColor(options?: RandomColorOptions): string | null

/**
 * 生成一个随机颜色字符串数组。
 *
 * @param count 要生成的颜色数量。
 * @param options (可选) 应用于所有生成颜色的配置选项，与 `randomColor` 的选项相同。
 * @returns 一个随机颜色字符串数组。
 */
export function randomColors(count: number, options?: RandomColorOptions): string[]

// 选项类型定义
export interface RandomColorOptions {
  format?: 'hex' | 'rgb' | 'hsl'
  preset?: 'bright' | 'dark' | 'light' | 'pastel' | 'vibrant' | 'monochrome'
  hue?: number | [number, number] | 'random'
  saturation?: number | [number, number] | 'random'
  lightness?: number | [number, number] | 'random'
  alpha?: number | [number, number] | 'random'
}
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于默认格式**: 如果未指定 `format`，`randomColor` 和 `randomColors` 默认返回十六进制 (`hex`) 格式的颜色字符串。
- **关于参数优先级**: 自定义参数的优先级高于 `preset`。例如，`randomColor({ preset: 'bright', saturation: 10 })` 将使用 `saturation: 10` 而不是 `bright` 预设的高饱和度范围。
- **关于饱和度和亮度值**: `saturation` 和 `lightness` 接受 `0-100` 的百分比数值（如 `80`）或 `0-1` 的小数值（如 `0.8`），函数内部会自动处理转换。
- **关于透明度**: 只有当提供了 `alpha` 选项且 `format` 为 `rgb` 或 `hsl` 时，才会生成带透明度通道的 `rgba()` 或 `hsla()` 格式字符串。
- **关于 `randomColors`**: 如果提供的 `count` 小于或等于 `0`，将返回一个空数组。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/generation/random-color/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/generation/random-color/index.ts)
