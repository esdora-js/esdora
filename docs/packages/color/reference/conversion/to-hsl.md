---
title: toHsl
description: toHsl - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为 HSL 对象。
---

# toHsl

将任意合法的颜色字符串或颜色对象转换为一个简化的 HSL 对象。

## 示例

### 基本用法

```typescript
import { toHsl } from '@esdora/color'

toHsl('#FF0000') // => { h: 0, s: 100, l: 50 }
toHsl('rgb(0, 255, 0)') // => { h: 120, s: 100, l: 50 }

// 对于灰度颜色，色相 (h) 和饱和度 (s) 均为 0
toHsl('#808080') // => { h: 0, s: 0, l: 50 }
```

### 处理透明度

```typescript
import { toHsl } from '@esdora/color'

// 当颜色包含透明度时，返回的对象会包含 a 属性
toHsl('rgba(255, 0, 0, 0.5)') // => { h: 0, s: 100, l: 50, a: 0.5 }

// 当颜色完全不透明 (alpha = 1) 时，则不包含 a 属性
toHsl('rgba(255, 0, 0, 1)') // => { h: 0, s: 100, l: 50 }
```

### 边界和错误场景

```typescript
import { toHsl } from '@esdora/color'

toHsl('invalid-color') // => null
toHsl('') // => null
```

## 签名与说明

### 类型签名

```typescript
export function toHsl(color: string | EsdoraColor): EsdoraHslColor | null
```

### 参数说明

| 参数  | 类型                    | 描述                                                                                 | 必需 |
| ----- | ----------------------- | ------------------------------------------------------------------------------------ | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色表示，可以是 HEX/RGB/HSL 等 CSS 颜色字符串，或 Culori 支持的颜色对象。 | 是   |

### 返回值

- **类型**: `EsdoraHslColor | null`
- **说明**: 当解析成功时，返回包含 `h`、`s`、`l`（以及可选的 `a`）属性的 HSL 颜色对象，数值范围为 `h: 0-360`，`s/l: 0-100`。
- **特殊情况**: 当颜色无法解析、转换失败或输入不合法（如无效字符串、`null`、`undefined` 等）时，返回 `null`。

### 泛型约束（如适用）

本函数不使用泛型参数。

## 注意事项与边界情况

### 输入边界

- 支持 HEX 短格式（如 `#f00`）和长格式（如 `#FF0000`）、RGB/HSL 字符串以及对应的颜色对象。
- 对于灰度颜色（如 `#808080`、`#000000`、`#FFFFFF`），色相 `h` 固定为 `0`，饱和度 `s` 为 `0`，亮度 `l` 取对应的灰度值。
- 如果内部转换得到的 HSL 对象中某些分量为 `undefined`，会按 `0` 处理，以保证返回的对象始终具有完整的数值。

### 错误处理

- **异常类型**: 函数内部对 HSL 转换过程使用 `try/catch` 包裹，当底层转换器抛出错误（例如传入带有非法 `mode` 的颜色对象）时，统一返回 `null`。
- **处理建议**: 调用方应先判断返回值是否为 `null`，再使用其中的 `h`、`s`、`l`、`a` 属性。无需在业务层额外包裹 `try/catch`。

### 性能考虑

- **时间复杂度**: O(1) —— 每次调用仅对单个颜色值进行解析与坐标转换。
- **空间复杂度**: O(1) —— 只创建一个中间的 HSL 对象，不会随着调用次数累积额外内存。
- **优化建议**: 适合在颜色分析、调色板生成等场景中高频调用；若在大规模循环中使用，可将解析前的颜色字符串做去重或缓存，以减少重复解析。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-hsl/index.ts)
