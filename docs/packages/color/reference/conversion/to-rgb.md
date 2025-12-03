---
title: toRgb
description: toRgb - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为 RGB 对象。
---

# toRgb

将任意合法的颜色字符串或颜色对象转换为一个标准化的 RGB 对象，方便在 UI 渲染和颜色计算中统一处理。

## 示例

### 基本用法

```typescript
import { toRgb } from '@esdora/color'

// 接受多种颜色格式
toRgb('#FF0000') // => { r: 255, g: 0, b: 0 }
toRgb('hsl(0, 100%, 50%)') // => { r: 255, g: 0, b: 0 }
toRgb({ h: 0, s: 100, l: 50, mode: 'hsl' }) // => { r: 255, g: 0, b: 0 }
toRgb('rgb(255, 0, 0)') // => { r: 255, g: 0, b: 0 }
```

### 处理透明度

```typescript
import { toRgb } from '@esdora/color'

// 当颜色包含透明度时，返回的对象会包含 a 属性
toRgb('rgba(255, 0, 0, 0.5)')
// => { r: 255, g: 0, b: 0, a: 0.5 }

// 当颜色完全不透明 (alpha = 1) 时，则不包含 'a' 属性
toRgb('rgba(255, 0, 0, 1)')
// => { r: 255, g: 0, b: 0 }

// 灰度颜色同样会被正确转换
toRgb('#808080')
// => { r: 128, g: 128, b: 128 }
```

### 处理无效输入与降级行为

```typescript
import { toRgb } from '@esdora/color'

// 无法解析的颜色会返回 null
toRgb('invalid-color') // => null
toRgb('') // => null
toRgb(null as any) // => null

// 当内部 RGB 分量为 undefined 时，会自动降级为 0
toRgb({ mode: 'rgb', r: undefined, g: undefined, b: undefined } as any)
// => { r: 0, g: 0, b: 0 }
```

## 签名与说明

```typescript
import type { Color, EsdoraRgbColor } from '@esdora/color'

export interface EsdoraRgbColor {
  r: number
  g: number
  b: number
  a?: number
}

export function toRgb(color: string | Color): EsdoraRgbColor | null
```

### 参数说明

| 参数  | 类型              | 描述                                                                                                                            | 必需 |
| ----- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---- |
| color | `string \| Color` | 任意合法的颜色字符串（如 `'#FF0000'`, `'rgb(255, 0, 0)'`, `'hsl(0, 100%, 50%)'`）或 `Color` 颜色对象（由 `@esdora/color` 透出） | 是   |

### 返回值

- **类型**: `EsdoraRgbColor | null`
- **说明**: 返回一个包含 `r`, `g`, `b`（必需）和可选 `a` 属性的 RGB 颜色对象，其中 `r`, `g`, `b` 范围为 `0-255` 的整数，`a` 范围为 `0-1` 的浮点数。
- **特殊情况**:
  - 当输入颜色无法解析或内部转换失败时，返回 `null`。
  - 当 RGB 分量为 `undefined` 时，会被视为 `0` 处理，输出 `{ r: 0, g: 0, b: 0 }`。
  - 当透明度为 `1` 或未显式提供时，返回对象中不会包含 `a` 属性。

### 泛型约束（如适用）

- 本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 支持多种输入格式：标准/短格式 HEX、`rgb()`, `rgba()`, `hsl()`, `hsla()` 字符串，以及 HSL/RGB 颜色对象。
- 当输入为无效颜色字符串、空字符串、`null` 或无法解析的对象时，返回 `null`。
- 当输入颜色包含透明度且 `alpha < 1` 时，返回对象会附带 `a` 属性；当 `alpha = 1` 或未提供时，不会包含 `a`。
- 当内部 RGB 分量为 `undefined` 时，会自动按 `0` 处理，避免出现 `NaN` 或抛出错误。

### 错误处理

- 函数内部使用颜色解析和格式化工具，如果解析失败或 RGB 转换抛出异常，会捕获错误并返回 `null`，而不是向外抛出异常。
- 建议在调用时显式判断返回值是否为 `null`，以便在 UI 层或业务逻辑中提供降级方案（例如回退到默认颜色）。

### 性能考虑

- 单次调用的时间复杂度为 O(1)，主要开销来自颜色解析与格式化操作。
- 在需要批量转换大量颜色时，建议在上层逻辑中做缓存或批量处理，避免在热路径中重复解析相同的颜色字符串。
- 对于实时渲染场景（如动画），可以预先将常用颜色转换为 `EsdoraRgbColor` 对象，减少运行时开销。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-rgb/index.ts)
