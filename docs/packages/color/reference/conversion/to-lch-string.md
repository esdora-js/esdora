---
title: toLchString
description: "toLchString - Dora Pocket 中 @esdora/color 库提供的颜色转换工具函数，用于将任意颜色格式转换为 LCH 颜色字符串。"
---

# toLchString

将任意合法的颜色字符串或颜色对象转换为符合 CSS Color Level 4 规范的 LCH 颜色字符串。

## 示例

### 基本用法

```typescript
import { toLchString } from '@esdora/color'

const red = toLchString('#FF0000')
// => 'lch(54.291 106.839 40.853)'

const redFromRgb = toLchString('rgb(255, 0, 0)')
// => 'lch(54.291 106.839 40.853)'
```

### 支持多种输入格式

```typescript
import { toLchString } from '@esdora/color'

const fromHslObject = toLchString({ mode: 'hsl', h: 0, s: 100, l: 50 })
// => 类似 'lch(54.291 106.839 40.853)'

const fromCuloriRgb = toLchString({ mode: 'rgb', r: 1, g: 0, b: 0 })
// => 返回以 'lch(' 开头的字符串
```

### 处理透明度与无效输入

```typescript
import { toLchString } from '@esdora/color'

const withAlpha = toLchString('rgba(255, 0, 0, 0.5)')
// => 'lch(54.291 106.839 40.853 / 0.5)'

const invalid = toLchString('not-a-color')
// => null

function safeToLchString(input: string | null | undefined) {
  return input ? toLchString(input) : null
}

safeToLchString(null)
// => null
```

## 签名与说明

### 类型签名

```typescript
export function toLchString(color: string | EsdoraColor): string | null
```

### 参数说明

| 参数  | 类型                    | 描述                                                               | 必需 |
| ----- | ----------------------- | ------------------------------------------------------------------ | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色输入，可以是颜色字符串或符合 culori 规范的颜色对象。 | 是   |

### 返回值

- **类型**: `string | null`
- **说明**: 当 `color` 可以成功解析并转换到 LCH 颜色空间时，返回形如 `lch(L C H / A?)` 的字符串；当输入无法解析或转换失败时返回 `null`。
- **特殊情况**: 对于白色、黑色和灰度色等低色度颜色，色相可能在字符串中被表示为数值或 `none`，具体取决于底层颜色库的实现。

### 泛型约束（如适用）

- 本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 接受常见颜色格式：如 `#RRGGBB`、`#RGB`、`rgb(...)`、`rgba(...)`、`hsl(...)` 字符串，以及包含 `mode` 字段的 culori 兼容颜色对象。
- 虽然类型签名只接受 `string` 或 `EsdoraColor`，实现内部对 `null`、`undefined` 等非期望输入做了防御性处理，运行时会安全地返回 `null`。
- 对于灰度颜色（如白色 `#FFFFFF`、黑色 `#000000`、中性灰 `#808080`），其色度接近 `0`，色相可能为数值或 `none`。

### 错误处理

- 当颜色字符串无法被解析器识别（例如 `'invalid-color'` 或空字符串）时，函数返回 `null`。
- 当传入对象虽然可以被解析为颜色，但在转换到 LCH 颜色空间时底层库抛出异常时，内部会捕获异常并返回 `null`，避免抛出到调用方。
- 对于结构不完整或字段类型异常的颜色对象（如缺少必要字段或 `mode` 非法），最终也会返回 `null`。

### 性能考虑

- 单次调用的时间复杂度为 O(1)，适合在运行时动态转换颜色，例如根据主题或状态生成 CSS 变量。
- 每次调用都会重新解析并转换输入颜色；在高频调用的场景（如动画或大规模图形渲染）中，建议对输入和输出进行缓存，或在业务层复用已转换好的 LCH 结果。
- 底层依赖的 culori 库在大多数前端和 Node.js 场景下性能足够，不需要额外的微优化。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-lch-string/index.ts)
