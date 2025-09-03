---
title: generatePalette
description: generatePalette - 来自 Dora Pocket 的颜色“道具”，用于基于色彩理论生成和谐的调色板。
---

# generatePalette

<!-- 1. 简介：一句话核心功能描述 -->

基于一个基础颜色，根据不同的色彩和谐理论（如单色、类似色、互补色等）生成一个颜色数组。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 默认生成一个包含 5 种颜色的单色调色板
generatePalette('#3498db')
// => ['#1f63a3', '#2980b9', '#3498db', '#5dade2', '#85c1e9']
```

### 生成互补色调色板

```typescript
// 'complementary' 类型会生成色轮上相对的颜色
generatePalette('#ff0000', { type: 'complementary' })
// => ['#ff0000', '#00ffff']

// 可以指定生成更多数量的颜色，函数会自动调整明暗
generatePalette('#ff0000', { type: 'complementary', count: 4, includeBase: true })
// => ['#ff0000', '#00ffff', '#ff4d4d', '#00b3b3']
```

### 生成类似色调色板

```typescript
// 'analogous' 类型会生成色轮上相邻的颜色，常用于创建柔和、自然的配色方案
generatePalette('#ff6b6b', { type: 'analogous', count: 3 })
// => ['#ff9933', '#ff6b6b', '#ff3d9e']
```

### 移除基础颜色

```typescript
// 设置 includeBase: false 可以从结果中排除原始的基础颜色
generatePalette('#ff0000', { type: 'triadic', includeBase: false })
// => ['#00ff00', '#0000ff']
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 基于基础颜色生成调色板。
 *
 * 此函数可以根据不同的色彩理论生成和谐的调色板：
 * - `monochromatic`: 单色，基于同一色相的不同明度和饱和度。
 * - `analogous`: 类似色，使用色轮上相邻的颜色。
 * - `complementary`: 互补色，使用色轮上相对的颜色。
 * - `triadic`: 三角色，使用色轮上等距的三个颜色。
 * - `tetradic`: 四角色，使用色轮上等距的四个颜色。
 * - `split-complementary`: 分裂互补色，使用基础色和其互补色两侧的颜色。
 *
 * @param baseColor 基础颜色字符串或颜色对象，支持 hex, rgb, hsl 等格式。
 * @param options (可选) 调色板生成选项。
 * @param options.count (可选) 生成的颜色数量。
 * @param options.type (可选) 调色板类型。
 * @param options.includeBase (可选) 是否在结果中包含基础颜色。
 * @returns 生成的调色板颜色数组（十六进制格式），如果基础颜色无效则返回 `null`。
 * @default
 */
export function generatePalette(baseColor: string | EsdoraColor, options?: {
  count?: number
  type?: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'split-complementary'
  includeBase?: boolean
}): string[] | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于输出格式**: 所有生成的颜色都将以十六进制字符串（如 `#ffffff`）的形式返回。
- **关于默认行为**: 如果不提供任何 `options`，函数将默认生成一个包含 5 种颜色的 `monochromatic` (单色) 调色板，并包含基础颜色。
- **关于无效输入**: 当 `baseColor` 参数为无效颜色字符串（如 `'invalid-color'`）、空字符串、`null` 或无法解析的对象时，函数将返回 `null`。
- **关于 `count` 选项**:
  - 对于 `triadic`, `tetradic`, `split-complementary` 类型，`count` 选项无效，它们总是返回固定数量的颜色（分别为 3, 4, 3）。
  - 对于 `monochromatic`, `analogous`, `complementary` 类型，`count` 选项有效，用于控制最终生成的颜色数量。
- **关于鲁棒性**: 即使输入的颜色对象缺少 `h`, `s`, `l` 等属性（值为 `undefined`），函数也会使用默认值 `0` 来处理，确保不会因意外输入而崩溃。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/generatePalette/index.ts`](https://github.com/esdora/packages/kit/blob/main/packages/packages/color/generatePalette/index.ts)
