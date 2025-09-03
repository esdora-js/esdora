---
title: mix
description: mix - 来自 Dora Pocket 的颜色“道具”，用于混合多个颜色以创建一个新的颜色。
---

# mix

<!-- 1. 简介：一句话核心功能描述 -->

将两个或多个颜色混合，通过平均计算它们的 R、G、B 和透明度通道来创建一个新颜色。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 混合红色和蓝色得到紫色
mix('#ff0000', '#0000ff')
// => '#800080'

// 混合红、绿、蓝得到灰色
mix('#ff0000', '#00ff00', '#0000ff')
// => '#555555'
```

### 混合带透明度的颜色

```typescript
// 透明度通道也会被平均计算
mix('rgba(255, 0, 0, 0.8)', 'rgba(0, 255, 0, 0.4)')
// => '#80800099'
```

### 创建渐变中间色

```typescript
const startColor = '#3498db' // 蓝色
const endColor = '#e74c3c' // 红色

const middleColor = mix(startColor, endColor)
// => '#8e728c'
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 混合多个颜色，创建一个新的颜色。
 *
 * 此函数可以混合任意数量的颜色，通过在 RGB 色彩空间中进行平均计算。
 * 每个颜色的权重相等。
 *
 * 混合算法：
 * 1. 将所有颜色转换为 RGB 格式
 * 2. 对每个 RGB 通道分别计算平均值
 * 3. 对透明度通道也计算平均值
 * 4. 返回十六进制格式的颜色
 *
 * @param colors 要混合的颜色数组，可以是一个或多个颜色字符串或 EsdoraColor 对象。
 * @returns 混合后的十六进制颜色字符串。如果任一输入颜色无效，则返回 `null`。
 * @throws {TypeError} 如果没有提供任何颜色。
 */
export function mix(...colors: (string | EsdoraColor)[]): string | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于输入参数**: 必须提供至少一个颜色，否则将抛出 `TypeError`。如果只提供一个颜色，函数将返回该颜色对应的标准十六进制格式。
- **关于无效颜色**: 如果参数列表中**任何一个**颜色是无效的（例如 `'invalid-color'` 或 `null`），整个函数将返回 `null`。
- **关于颜色格式**: `mix` 函数接受多种颜色格式（如 Hex, RGB, HSL, 颜色名称），但输出始终是标准的十六进制字符串。
- **关于透明度**: 函数会平均计算所有颜色的 Alpha（透明度）通道。如果最终混合颜色的透明度不为 1，将返回 8 位的十六进制颜色字符串（例如 `#rrggbbaa`）。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/manipulation/mix/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/manipulation/mix/index.ts)
