---
title: isAccessible
description: "isAccessible - Dora Pocket 中 @esdora/color 库提供的对比度分析工具函数，用于检查两种颜色之间的对比度是否符合 WCAG 可访问性标准。"
---

# isAccessible

基于 WCAG (Web 内容可访问性指南) 标准，检查两种颜色之间的对比度是否满足不同级别与文本大小下的可访问性要求。

## 示例

### 基本用法（AA 级，普通文本）

```typescript
import { isAccessible } from '@esdora/color'

// 默认检查标准 (AA 级，普通文本)
isAccessible('#000000', '#FFFFFF')
// => true

// 对比度不足的情况
isAccessible('#999999', '#FFFFFF')
// => false
```

### 不同级别与文本大小

```typescript
import { isAccessible } from '@esdora/color'

// AAA 级别（普通文本），要求对比度至少 7:1
isAccessible('#767676', '#FFFFFF', { level: 'AAA' })
// => false

// AA 级别 + 大文本，要求对比度至少 3:1
isAccessible('#767676', '#FFFFFF', { level: 'AA', size: 'large' })
// => true

// AAA 级别 + 大文本，要求对比度至少 4.5:1
isAccessible('#767676', '#FFFFFF', { level: 'AAA', size: 'large' })
// => true
```

### 多种颜色格式与无效输入

```typescript
import { isAccessible } from '@esdora/color'

// RGB 字符串
isAccessible('rgb(0, 0, 0)', 'rgb(255, 255, 255)')
// => true

// 颜色对象
isAccessible(
  { r: 0, g: 0, b: 0, mode: 'rgb' },
  { r: 255, g: 255, b: 255, mode: 'rgb' },
)
// => true

// 无效输入将返回 null
isAccessible('invalid-color', '#FFFFFF')
// => null
```

## 签名与说明

### 类型签名

```typescript
export interface AccessibilityOptions {
  /**
   * WCAG 可访问性级别
   * - 'AA': 标准级别，对比度要求 4.5:1 (普通文本) 或 3:1 (大文本)
   * - 'AAA': 增强级别，对比度要求 7:1 (普通文本) 或 4.5:1 (大文本)
   */
  level?: 'AA' | 'AAA'

  /**
   * 文本大小
   * - 'normal': 普通文本 (小于 18pt 或 14pt 粗体)
   * - 'large': 大文本 (18pt 及以上或 14pt 粗体及以上)
   */
  size?: 'normal' | 'large'
}

export function isAccessible(
  color1: string | EsdoraColor,
  color2: string | EsdoraColor,
  options?: AccessibilityOptions,
): boolean | null
```

### 参数说明

| 参数            | 类型                    | 描述                                                                         | 必需 |
| --------------- | ----------------------- | ---------------------------------------------------------------------------- | ---- |
| `color1`        | `string \| EsdoraColor` | 第一个颜色，通常是文本颜色。支持 Hex、RGB、HSL 字符串或 `EsdoraColor` 对象。 | 是   |
| `color2`        | `string \| EsdoraColor` | 第二个颜色，通常是背景颜色。支持 Hex、RGB、HSL 字符串或 `EsdoraColor` 对象。 | 是   |
| `options`       | `AccessibilityOptions`  | 可访问性选项对象，用于指定 WCAG 级别与文本大小。                             | 否   |
| `options.level` | `'AA' \| 'AAA'`         | WCAG 可访问性级别；`'AA'` 为标准级别，`'AAA'` 为增强级别。                   | 否   |
| `options.size`  | `'normal' \| 'large'`   | 文本大小；`'normal'` 表示普通文本，`'large'` 表示大文本。                    | 否   |

### 返回值

- **类型**: `boolean \| null`
- **说明**:
  - 返回 `true` 表示两种颜色在指定级别与文本大小下满足 WCAG 对比度要求。
  - 返回 `false` 表示对比度不足，不满足可访问性要求。
  - 返回 `null` 表示无法解析颜色或无法计算对比度（例如输入无效）。
- **特殊情况**:
  - 当仅传入部分选项（仅 `level` 或仅 `size`）时，未提供的字段将使用默认值。
  - 当 `color1` 或 `color2` 任何一方为无效颜色（包括 `null`、`undefined` 或无法解析的字符串）时，返回 `null`。

### 泛型约束（如适用）

本函数未使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 支持多种颜色格式：十六进制字符串（如 `'#000000'`）、RGB/HSL 字符串（如 `'rgb(0, 0, 0)'`、`'hsl(0, 0%, 0%)'`）以及 `EsdoraColor` 颜色对象。
- 若输入为空字符串或格式不正确的颜色字符串（如 `'invalid-color'`），会被视为无效输入。
- 当传入 `null`、`undefined` 或结构不完整的颜色对象时，同样视为无效输入。

### 错误处理

- 对于无法解析或无法转换的颜色，内部对比度计算会返回 `null`，并直接映射为函数返回值 `null`。
- 函数本身不会抛出异常，调用方只需要判断返回值是否为 `null` 或 `false` 即可进行后续逻辑处理。
- 当只提供 `level` 或 `size` 时，未指定的字段会使用默认值：
  - `level` 默认值为 `'AA'`
  - `size` 默认值为 `'normal'`

### 性能考虑

- **时间复杂度**: O(1) —— 每次调用只进行常数次的颜色解析与对比度计算。
- **空间复杂度**: O(1) —— 仅创建少量中间颜色对象。
- **优化建议**:
  - 在需要对同一对颜色多次检查不同级别或文本大小时，可以在业务层缓存其对比度结果，减少重复计算。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/analysis/is-accessible/index.ts)
