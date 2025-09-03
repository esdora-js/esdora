---
title: toLchString
description: toLchString - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为 LCH 字符串。
---

# toLchString

<!-- 1. 简介：一句话核心功能描述 -->

将任意合法的颜色字符串或颜色对象转换为现代 CSS 的 LCH 格式颜色字符串。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 函数可以接受多种颜色格式
toLchString('#FF0000')
// => 'lch(54.291 106.839 40.853)'

toLchString('rgb(255, 0, 0)')
// => 'lch(54.291 106.839 40.853)'

toLchString({ h: 0, s: 100, l: 50, mode: 'hsl' })
// => 'lch(54.291 106.839 40.853)'
```

### 处理透明度

```typescript
// 当颜色包含透明度时，会使用现代 CSS 的斜杠语法输出
toLchString('rgba(255, 0, 0, 0.5)')
// => 'lch(54.291 106.839 40.853 / 0.5)'

// 对于完全不透明的颜色，则不包含 alpha 部分
toLchString('rgba(255, 0, 0, 1)')
// => 'lch(54.291 106.839 40.853)'
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 将任意合法的颜色字符串或颜色对象转换为 LCH 颜色字符串。
 *
 * LCH 是一种感知上更均匀的颜色空间，其中 L 代表感知亮度，C 代表色度，
 * H 代表色相。
 * 如果输入颜色包含透明度，函数会以 `lch(l c h / alpha)` 的格式输出。
 *
 * @param color 任意合法的颜色字符串（如 '#FF0000'）或颜色对象。
 * @returns 一个 LCH 格式的颜色字符串，如果输入无效则返回 `null`。
 */
export function toLchString(color: string | EsdoraColor): string | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于输出格式**: 函数遵循现代 CSS Color Module Level 4 规范，使用空格分隔 L, C, H 值。当存在透明度时，使用 `/` 分隔符。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串（如 `'invalid-color'`）、空字符串、`null`、`undefined` 或无法解析的对象时，函数将返回 `null`。
- **关于灰度色**: 对于没有色相的颜色（如黑、白、灰），其色度（Chroma）值接近于 `0`，色相（Hue）值可能返回 `0` 或 `NaN`，最终在 CSS 字符串中可能会被表示为`none`或一个数值（如 `lch(100 0 none)`），具体取决于底层库的实现。
- **输入灵活性**: 函数内部使用强大的颜色解析器，可以接受多种格式的输入，包括但不限于 HEX, RGB, HSL, 颜色名称以及各类颜色对象。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/color/src/conversion/to-lch-string/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-lch-string/index.ts)
