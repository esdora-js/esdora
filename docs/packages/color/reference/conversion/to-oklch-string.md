---
title: toOklchString
description: "toOklchString - Dora Pocket 中 @esdora/color 库提供的颜色转换工具函数，用于将任意颜色格式转换为 OKLCH 颜色字符串。"
---

# toOklchString

将任意合法的颜色字符串或颜色对象转换为符合 CSS Color Level 4 规范的 OKLCH 颜色字符串。

## 示例

### 基本用法

```typescript
import { toOklchString } from '@esdora/color'

const red = toOklchString('#FF0000')
// => 'oklch(0.628 0.258 29.234)'

const green = toOklchString('rgb(0, 255, 0)')
// => 'oklch(0.866 0.295 142.495)'
```

### 支持多种输入格式

```typescript
import { toOklchString } from '@esdora/color'

const fromHslObject = toOklchString({ mode: 'hsl', h: 240, s: 100, l: 50 })
// => 'oklch(0.452 0.313 264.052)'

const fromCuloriRgb = toOklchString({ mode: 'rgb', r: 1, g: 0, b: 0 })
// => 返回以 'oklch(' 开头的字符串
```

### 处理透明度与无效输入

```typescript
import { toOklchString } from '@esdora/color'

const withAlpha = toOklchString('rgba(255, 0, 0, 0.5)')
// => 'oklch(0.628 0.258 29.234 / 0.5)'

const invalid = toOklchString('invalid-color')
// => null

function safeToOklchString(input: string | null | undefined) {
  return input ? toOklchString(input) : null
}

safeToOklchString(undefined)
// => null
```

## 签名与说明

### 类型签名

```typescript
export function toOklchString(color: string | EsdoraColor): string | null
```

### 参数说明

| 参数  | 类型                    | 描述                                                               | 必需 |
| ----- | ----------------------- | ------------------------------------------------------------------ | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色输入，可以是颜色字符串或符合 culori 规范的颜色对象。 | 是   |

### 返回值

- **类型**: `string | null`
- **说明**: 当 `color` 可以成功解析并转换到 OKLCH 颜色空间时，返回形如 `oklch(l c h / a?)` 的字符串；当输入无法解析或转换失败时返回 `null`。
- **特殊情况**: 对于白色、黑色和灰度色等低色度颜色，色相可能在字符串中被表示为数值或 `none`，具体取决于底层颜色库的实现。

### 泛型约束（如适用）

- 本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 接受常见颜色格式：如 `#RRGGBB`、`#RGB`、`rgb(...)`、`rgba(...)`、`hsl(...)` 字符串，以及包含 `mode` 字段的 culori 兼容颜色对象。
- 虽然类型签名只接受 `string` 或 `EsdoraColor`，实现内部对 `null`、`undefined` 等非期望输入做了防御性处理，运行时会安全地返回 `null`。
- 对于灰度颜色，色度接近 `0`，色相可能为数值或 `none`，输出形式会随底层库的实现有所差异。

### 错误处理

- 当颜色字符串无法被解析器识别（例如 `'invalid-color'` 或空字符串）时，函数返回 `null`。
- 当传入对象虽然可以被解析为颜色，但在转换到 OKLCH 颜色空间时底层库抛出异常时，内部会捕获异常并返回 `null`，而不是向上传播错误。
- 对于结构不完整或字段类型异常的颜色对象（如缺少必要字段或 `mode` 非法），同样会返回 `null`。

### 性能考虑

- 单次调用的时间复杂度为 O(1)，适合在运行时动态生成 CSS OKLCH 颜色字符串，例如为主题或组件状态生成颜色变量。
- 每次调用都会重新解析并转换输入颜色；在需要对同一颜色多次执行转换的场景中，可以在业务层缓存结果字符串，避免重复计算。
- 底层依赖的 culori 库性能稳定，对常规 UI 渲染场景的性能影响可以忽略。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-oklch-string/index.ts)
