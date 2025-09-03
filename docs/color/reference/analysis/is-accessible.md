---
title: isAccessible
description: isAccessible - 来自 Dora Pocket 的颜色“道具”，用于检查两种颜色之间的对比度是否符合 WCAG 可访问性标准。
---

# isAccessible

<!-- 1. 简介：一句话核心功能描述 -->

检查两种颜色之间的对比度是否符合 WCAG (Web 内容可访问性指南) 标准。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 默认检查标准 (AA 级，普通文本)
isAccessible('#000000', '#FFFFFF')
// => true

// 对比度不足的情况
isAccessible('#999999', '#FFFFFF')
// => false
```

### 检查 AAA 增强级别

AAA 级别对对比度有更严格的要求（7:1），适用于需要最高可访问性的场景。

```typescript
// 该颜色组合 (#767676 / #FFFFFF) 对比度为 4.5:1，不满足 AAA 标准
isAccessible('#767676', '#FFFFFF', { level: 'AAA' })
// => false
```

### 检查大文本的可访问性

对于大号文本（例如 18pt 或 14pt 粗体），WCAG 的对比度要求会适当放宽。

```typescript
// 同样的颜色组合，当文本为大号时，满足了 AA 级标准 (3:1)
isAccessible('#767676', '#FFFFFF', { level: 'AA', size: 'large' })
// => true
```

### 支持多种颜色格式

函数不仅支持十六进制字符串，还支持 RGB、HSL 字符串和颜色对象。

```typescript
isAccessible('rgb(0, 0, 0)', 'rgb(255, 255, 255)')
// => true

isAccessible({ r: 0, g: 0, b: 0, mode: 'rgb' }, { r: 255, g: 255, b: 255, mode: 'rgb' })
// => true
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 检查两种颜色之间的对比度是否符合 WCAG 可访问性标准。
 *
 * @param color1 第一个颜色，通常是文本颜色。支持 Hex, RGB, HSL 字符串或 EsdoraColor 对象。
 * @param color2 第二个颜色，通常是背景颜色。支持 Hex, RGB, HSL 字符串或 EsdoraColor 对象。
 * @param options 可访问性选项对象。
 * @param options.level - WCAG 可访问性级别。
 *   - 'AA': 标准级别，对比度要求 4.5:1 (普通文本) 或 3:1 (大文本)。
 *   - 'AAA': 增强级别，对比度要求 7:1 (普通文本) 或 4.5:1 (大文本)。
 *   @default
 * @param options.size - 文本大小。
 *   - 'normal': 普通文本 (< 18pt 或 < 14pt 粗体)。
 *   - 'large': 大文本 (>= 18pt 或 >= 14pt 粗体)。
 *   @default
 * @returns 如果符合可访问性标准则返回 `true`，不符合则返回 `false`。如果任一颜色输入无效，则返回 `null`。
 */
export function isAccessible(
  color1: string | EsdoraColor,
  color2: string | EsdoraColor,
  options?: AccessibilityOptions,
): boolean | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于无效输入**: 如果 `color1` 或 `color2` 是无效的颜色字符串（如 `'invalid-color'`）、`null` 或 `undefined`，函数将无法计算对比度，并返回 `null`。
- **关于默认值**: 如果不提供 `options` 参数，函数将默认使用 `{ level: 'AA', size: 'normal' }` 进行检查。
- **关于部分选项**: 如果 `options` 对象只提供了 `level` 或 `size` 中的一个，另一个将自动使用其默认值。例如，仅提供 `{ level: 'AAA' }` 等同于 `{ level: 'AAA', size: 'normal' }`。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/color/src/analysis/is-accessible/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/color/src/analysis/is-accessible/index.ts)
