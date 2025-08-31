---
title: getContrast
description: getContrast - 来自 Dora Pocket 的颜色“道具”，用于计算两种颜色之间的对比度。
---

# getContrast

<!-- 1. 简介：一句话核心功能描述 -->

计算两种颜色之间的 WCAG 对比度，返回值范围为 1 (最低) 到 21 (最高)。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
import { getContrast } from '@esdora/kit'

// 计算纯白和纯黑的对比度
const contrast = getContrast('#FFFFFF', '#000000')
// => 21

// 计算一个较低对比度的例子
const lowContrast = getContrast('#808080', '#FFFFFF')
// => 2.154133400514332
```

### 支持多种颜色格式

函数不仅支持 HEX 字符串，还支持 RGB 字符串以及 `EsdoraColor` 对象。

```typescript
// 使用 RGB 字符串
getContrast('rgb(255, 255, 255)', 'rgb(0, 0, 0)')
// => 21

// 使用 EsdoraColor 对象
getContrast(
  { r: 255, g: 255, b: 255, mode: 'rgb' },
  { r: 0, g: 0, b: 0, mode: 'rgb' }
)
// => 21
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 计算两种颜色之间的对比度。
 *
 * @remarks
 * 这个函数对于确保文本和背景色符合 WCAG (Web Content Accessibility Guidelines)
 * 等可访问性标准至关重要。一个常见的标准是，普通文本的对比度应至少为 4.5:1。
 * 返回值的范围为 1 到 21。
 *
 * @param color1 - 第一个颜色，可以是十六进制、RGB 等格式的字符串，或 EsdoraColor 对象。
 * @param color2 - 第二个颜色，格式同上。
 * @returns 两种颜色之间的对比度数值。如果任一颜色无法被正确解析，则返回 `null`。
 */
export function getContrast(color1: string | EsdoraColor, color2: string | EsdoraColor): number | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于无效颜色**: 如果 `color1` 或 `color2` 中任何一个参数是无效的颜色值（例如，拼写错误的字符串 `'invalid-color'` 或 `null`），函数将无法进行计算并返回 `null`。
- **关于返回值**: 成功时返回一个 `1` 到 `21` 之间的数字。对比度越高，数值越大。根据 WCAG 标准，`4.5` 通常被视为普通文本可接受的最小对比度。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/color/src/analysis/get-contrast/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/color/src/analysis/get-contrast/index.ts)
