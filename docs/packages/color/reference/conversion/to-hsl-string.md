---
title: toHslString
description: '@esdora/color 的 toHslString 函数，将任意合法颜色转换为 HSL 颜色字符串'
---

# toHslString

将任意合法颜色（十六进制字符串、RGB 字符串、颜色对象等）转换为 HSL 颜色字符串。

## 示例

### 基本用法

```typescript
import { toHslString } from '@esdora/color'

toHslString('#FF0000') // => 'hsl(0, 100%, 50%)'
toHslString('rgb(255, 0, 0)') // => 'hsl(0, 100%, 50%)'
toHslString({ r: 255, g: 0, b: 0, mode: 'rgb' }) // => 'hsl(0, 100%, 50%)'
```

### 不同颜色格式

```typescript
import { toHslString } from '@esdora/color'

// 短格式十六进制
toHslString('#f00') // => 'hsl(0, 100%, 50%)'

// RGB 对象
toHslString({ h: 0, s: 100, l: 50, mode: 'hsl' }) // => 'hsl(0, 100%, 50%)'

// 不同颜色
toHslString('#00FF00') // => 'hsl(120, 100%, 50%)'
toHslString('#0000FF') // => 'hsl(240, 100%, 50%)'
toHslString('#FFFFFF') // => 'hsl(0, 0%, 100%)'
toHslString('#000000') // => 'hsl(0, 0%, 0%)'
```

### 带透明度的颜色

```typescript
import { toHslString } from '@esdora/color'

// 半透明颜色返回 hsla 格式
toHslString('rgba(255, 0, 0, 0.5)') // => 'hsla(0, 100%, 50%, 0.5)'

// alpha = 1 时不包含 alpha 通道
toHslString('rgba(255, 0, 0, 1)') // => 'hsl(0, 100%, 50%)'
```

### 灰度颜色

```typescript
import { toHslString } from '@esdora/color'

// 灰度颜色的色相为 0
toHslString('#808080') // => 'hsl(0, 0%, 50.2%)'
```

## 签名

```typescript
function toHslString(color: string | EsdoraColor): string | null
```

## 参数

| 参数  | 类型                    | 描述                                                               | 必需 |
| ----- | ----------------------- | ------------------------------------------------------------------ | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色表示，包括十六进制字符串、RGB/HSL 字符串、颜色对象等 | 是   |

## 返回值

- **类型**: `string | null`
- **说明**: 转换后的 HSL 颜色字符串。对于不带透明度的颜色返回 `hsl(h, s%, l%)` 格式；对于带透明度的颜色返回 `hsla(h, s%, l%, a)` 格式。
- **特殊情况**:
  - 输入无效颜色时返回 `null`
  - 输入空字符串时返回 `null`
  - 输入 `null` 或 `undefined` 时返回 `null`
  - 颜色对象包含无效的 `mode` 时返回 `null`
  - `alpha = 1` 时输出不包含 alpha 通道（`hsl` 而非 `hsla`）
  - 灰度颜色的色相固定为 `0`

## 注意事项

### 输入边界

- 支持的颜色格式包括：十六进制字符串（`#FF0000`、`#f00`）、RGB 字符串（`rgb(255, 0, 0)`）、RGBA 字符串（`rgba(255, 0, 0, 0.5)`）、HSL 对象、RGB 对象等
- 灰度颜色（如 `#808080`）的色相值固定为 `0`，饱和度为 `0%`
- 颜色对象需要包含 `mode` 字段（如 `mode: 'rgb'` 或 `mode: 'hsl'`）

### 错误处理

- 函数不会抛出异常，所有错误情况均返回 `null`
- 内部使用 `try-catch` 捕获 `culori` 转换失败的情况
- 如果 `parseColor` 无法解析输入，返回 `null`
- 如果 `hsl` 转换失败（如无效的 `mode`），返回 `null`

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/conversion/to-hsl-string/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/conversion/to-hsl-string/index.test.ts)
