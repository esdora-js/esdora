---
title: toRgbString
description: toRgbString - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为 RGB(A) 字符串。
---

# toRgbString

<!-- 1. 简介：一句话核心功能描述 -->

将任意合法的颜色字符串或颜色对象转换为 `rgb()` 或 `rgba()` 格式的 CSS 颜色字符串。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 函数可以接受多种颜色格式
toRgbString('#FF0000')
// => 'rgb(255, 0, 0)'

toRgbString('hsl(120, 100%, 50%)')
// => 'rgb(0, 255, 0)'

toRgbString({ h: 240, s: 100, l: 50, mode: 'hsl' })
// => 'rgb(0, 0, 255)'
```

### 处理透明度

```typescript
// 当颜色包含透明度时，会自动使用 rgba() 格式
toRgbString('hsla(0, 100%, 50%, 0.5)')
// => 'rgba(255, 0, 0, 0.5)'

// 当颜色完全不透明 (alpha = 1) 时，会简化为 rgb() 格式
toRgbString('rgba(255, 0, 0, 1)')
// => 'rgb(255, 0, 0)'
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 将任意合法的颜色字符串或颜色对象转换为 RGB 颜色字符串。
 *
 * 如果输入颜色包含透明度（alpha < 1），函数将返回 `rgba()` 格式的字符串。
 * 否则，将返回 `rgb()` 格式的字符串。
 *
 * @param color 任意合法的颜色字符串（如 '#FF0000', 'hsl(...)', 'rgb(...)'）或颜色对象。
 * @returns 一个 RGB 或 RGBA 格式的颜色字符串，如果输入无效则返回 `null`。
 */
export function toRgbString(color: string | EsdoraColor): string | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于输出格式**: 当颜色包含小于 `1` 的 `alpha` 值时，函数返回 `rgba()` 格式字符串；否则，返回 `rgb()` 格式。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串（如 `'invalid-color'`）、空字符串、`null` 或无法解析的对象时，函数将返回 `null`。
- **输入灵活性**: 函数内部使用强大的颜色解析器，可以接受多种格式的输入，包括但不限于 HEX（完整和缩写形式）、HSL、RGB 字符串以及各类颜色对象。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/conversion/to-rgb-string/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/conversion/to-rgb-string/index.ts)
