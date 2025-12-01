---
title: toRgbString
description: toRgbString - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为 RGB(A) 字符串。
---

# toRgbString

将任意合法的颜色字符串或颜色对象转换为 `rgb()` 或 `rgba()` 格式的 CSS 颜色字符串。

## 示例

### 基本用法

```typescript
import { toRgbString } from '@esdora/color'

// 函数可以接受多种颜色格式
toRgbString('#FF0000') // => 'rgb(255, 0, 0)'
toRgbString('hsl(0, 100%, 50%)') // => 'rgb(255, 0, 0)'
toRgbString({ h: 0, s: 100, l: 50, mode: 'hsl' }) // => 'rgb(255, 0, 0)'
toRgbString('rgb(255, 0, 0)') // => 'rgb(255, 0, 0)'
```

### 处理透明度

```typescript
import { toRgbString } from '@esdora/color'

// 当颜色包含透明度时，会自动使用 rgba() 格式
toRgbString('hsla(0, 100%, 50%, 0.5)')
// => 'rgba(255, 0, 0, 0.5)'

// 当颜色完全不透明 (alpha = 1) 时，会简化为 rgb() 格式
toRgbString('rgba(255, 0, 0, 1)')
// => 'rgb(255, 0, 0)'

// 灰度颜色会保留正确的亮度信息
toRgbString('#808080')
// => 'rgb(128, 128, 128)'
```

### 接受颜色对象输入

```typescript
import { toRgbString } from '@esdora/color'

toRgbString({ h: 0, s: 100, l: 50 } as any)
// => 'rgb(255, 0, 0)'

toRgbString({ r: 255, g: 0, b: 0, mode: 'rgb' })
// => 'rgb(255, 0, 0)'
```

### 处理无效输入

```typescript
import { toRgbString } from '@esdora/color'

toRgbString('invalid-color') // => null
toRgbString('') // => null
toRgbString(null as any) // => null
```

## 签名与说明

### 类型签名

```typescript
import type { Color } from '@esdora/color'

export function toRgbString(color: string | Color): string | null
```

### 参数说明

| 参数  | 类型              | 描述                                                                                                                            | 必需 |
| ----- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---- |
| color | `string \| Color` | 任意合法的颜色字符串（如 `'#FF0000'`, `'rgb(255, 0, 0)'`, `'hsl(0, 100%, 50%)'`）或 `Color` 颜色对象（由 `@esdora/color` 透出） | 是   |

### 返回值

- **类型**: `string | null`
- **说明**: 返回一个符合 CSS 标准的 `rgb(r, g, b)` 或 `rgba(r, g, b, a)` 颜色字符串。
- **特殊情况**:
  - 当输入颜色包含透明度且 `alpha < 1` 时，返回 `rgba()` 格式的字符串。
  - 当透明度为 `1` 或未提供时，返回 `rgb()` 格式的字符串。
  - 当输入无效、无法解析或内部 RGB 转换失败时，返回 `null`。

### 泛型约束（如适用）

- 本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 支持解析标准/短格式 HEX、HSL/HSLA 字符串、RGB/RGBA 字符串以及 HSL/RGB 颜色对象。
- 当输入为无效颜色字符串、空字符串或 `null` 时，返回 `null`。
- 对于可能包含 `undefined` 分量的颜色对象（如 `r`, `g`, `b` 或 `h`, `s`, `l` 未定义），内部会进行合理的默认值处理，输出稳定的 RGB 结果。

### 错误处理

- 内部使用颜色解析与转换工具，当解析或转换失败时不会抛出异常，而是返回 `null`。
- 建议调用方在使用结果前判断是否为 `null`，在 UI 或业务逻辑层面提供默认颜色或错误提示。

### 性能考虑

- 单次调用的时间复杂度为 O(1)，适合在一般渲染逻辑中直接使用。
- 对于需要频繁进行颜色格式转换的场景（例如大量列表渲染），可考虑在上层对常用颜色进行缓存，避免重复解析相同的输入。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-rgb-string/index.ts)
