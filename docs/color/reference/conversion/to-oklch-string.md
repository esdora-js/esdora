---
title: toOklchString
description: toOklchString - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为 OKLCH 字符串。
---

# toOklchString

<!-- 1. 简介：一句话核心功能描述 -->

将任意合法的颜色字符串或颜色对象转换为现代 CSS 的 OKLCH 格式颜色字符串。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
toOklchString('#FF0000')
// => 'oklch(0.628 0.258 29.234)'

toOklchString('rgb(0, 255, 0)')
// => 'oklch(0.866 0.295 142.495)'

toOklchString({ h: 240, s: 100, l: 50, mode: 'hsl' })
// => 'oklch(0.452 0.313 264.052)'
```

### 处理透明度

```typescript
// 当颜色包含透明度时，会使用现代 CSS 的斜杠语法输出
toOklchString('rgba(255, 0, 0, 0.5)')
// => 'oklch(0.628 0.258 29.234 / 0.5)'

// 对于完全不透明的颜色，则不包含 alpha 部分
toOklchString('rgba(255, 0, 0, 1)')
// => 'oklch(0.628 0.258 29.234)'
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 将任意合法的颜色字符串或颜色对象转换为 OKLCH 颜色字符串。
 *
 * OKLCH 是一种感知上更均匀的颜色空间，特别适合颜色操作和生成色阶。
 * 如果输入颜色包含透明度，函数会以 `oklch(l c h / alpha)` 的格式输出。
 *
 * @param color 任意合法的颜色字符串（如 '#FF0000'）或颜色对象。
 * @returns 一个 OKLCH 格式的颜色字符串，如果输入无效则返回 `null`。
 */
export function toOklchString(color: string | EsdoraColor): string | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于输出格式**: 函数遵循现代 CSS Color Module Level 4 规范，使用空格分隔 L, C, H 值。当存在透明度时，使用 `/` 分隔符。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串（如 `'invalid-color'`）、空字符串、`null`、`undefined` 或无法解析的对象时，函数将返回 `null`。
- **关于灰度色**: 对于没有色相的颜色（如黑、白、灰），其色度（Chroma）值接近于 `0`，色相（Hue）值在 CSS 字符串中可能会被表示为 `none` 或一个数值，例如 `oklch(1 0 none)`。
- **输入灵活性**: 函数内部使用强大的颜色解析器，可以接受多种格式的输入，包括但不限于 HEX, RGB, HSL, 颜色名称以及各类颜色对象。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/color/src/conversion/to-oklch-string/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-oklch-string/index.ts)
