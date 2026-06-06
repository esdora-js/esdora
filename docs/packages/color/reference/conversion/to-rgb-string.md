---
title: toRgbString
description: '@esdora/color 的 toRgbString 函数，将任意合法颜色转换为 RGB 颜色字符串'
---

# toRgbString

将任意合法颜色（十六进制字符串、HSL 字符串、颜色对象等）转换为 RGB 颜色字符串。

## 示例

### 基本用法

```typescript
import { toRgbString } from '@esdora/color'

toRgbString('#FF0000') // => 'rgb(255, 0, 0)'
toRgbString('hsl(0, 100%, 50%)') // => 'rgb(255, 0, 0)'
toRgbString({ h: 0, s: 100, l: 50, mode: 'hsl' }) // => 'rgb(255, 0, 0)'
```

### 不同格式输入

```typescript
import { toRgbString } from '@esdora/color'

toRgbString('#00FF00') // => 'rgb(0, 255, 0)'
toRgbString('#0000FF') // => 'rgb(0, 0, 255)'
toRgbString('#FFFFFF') // => 'rgb(255, 255, 255)'
toRgbString('#000000') // => 'rgb(0, 0, 0)'
toRgbString('#f00') // => 'rgb(255, 0, 0)'
toRgbString('#808080') // => 'rgb(128, 128, 128)'
```

### 带透明度的颜色

```typescript
import { toRgbString } from '@esdora/color'

toRgbString('hsla(0, 100%, 50%, 0.5)') // => 'rgba(255, 0, 0, 0.5)'
toRgbString('rgba(255, 0, 0, 1)') // => 'rgb(255, 0, 0)'
```

### 无效输入

```typescript
import { toRgbString } from '@esdora/color'

toRgbString('invalid-color') // => null
toRgbString('') // => null
toRgbString(null as any) // => null
```

## 签名

```typescript
function toRgbString(color: string | EsdoraColor): string | null
```

## 参数

| 参数  | 类型                    | 描述                                                                             | 必需 |
| ----- | ----------------------- | -------------------------------------------------------------------------------- | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色表示，支持十六进制字符串、CSS 颜色字符串、RGB / HSL / OKLCH 对象等 | 是   |

## 返回值

- **类型**: `string | null`
- **说明**: 转换后的 RGB 颜色字符串。若输入包含透明度（且 alpha 不为 1），则返回 `rgba(...)` 格式；否则返回 `rgb(...)` 格式。
- **特殊情况**:
  - 输入为空字符串、无效颜色字符串或解析失败时，返回 `null`
  - 输入为 `null` / `undefined` 时，返回 `null`
  - 透明度为 1 时，不保留 alpha 通道，返回 `rgb(...)` 而非 `rgba(..., 1)`
  - 颜色对象缺少 `mode` 字段时，内部会尝试推断模式，推断失败则返回 `null`

## 注意事项

### 输入边界

- 支持的颜色格式包括：十六进制（`#RRGGBB`、`#RGB`）、CSS 颜色字符串（`rgb(...)`、`hsl(...)` 等）、以及带 `mode` 字段的颜色对象
- 颜色对象中的 `mode` 字段用于指示颜色空间（如 `'rgb'`、`'hsl'`、`'oklch'`），缺失时可能导致解析失败
- `EsdoraColor` 为 `culori` 内部颜色对象的类型别名，包含多种颜色空间表示

### 错误处理

- 函数内部通过 `try...catch` 捕获 `culori` 转换异常，不会向外抛出错误
- 所有无效输入均返回 `null`，而非抛出异常

## 相关链接

- [源码](https://github.com/kkfive/esdora/tree/main/packages/color/src/conversion/to-rgb-string/index.ts)
- [单元测试](https://github.com/kkfive/esdora/tree/main/packages/color/src/conversion/to-rgb-string/index.test.ts)
