---
title: toHsl
description: '@esdora/color 的 toHsl 函数，将任意合法颜色转换为 HSL 对象'
---

# toHsl

将任意合法颜色（字符串或颜色对象）转换为 HSL 颜色对象。

## 示例

### 基本用法

```typescript
import { toHsl } from '@esdora/color'

toHsl('#FF0000') // => { h: 0, s: 100, l: 50 }
toHsl('rgb(255, 0, 0)') // => { h: 0, s: 100, l: 50 }
toHsl({ r: 255, g: 0, b: 0 }) // => { h: 0, s: 100, l: 50 }
```

### 不同颜色格式

```typescript
import { toHsl } from '@esdora/color'

toHsl('#00FF00') // => { h: 120, s: 100, l: 50 }
toHsl('#0000FF') // => { h: 240, s: 100, l: 50 }
toHsl('#FFFFFF') // => { h: 0, s: 0, l: 100 }
toHsl('#000000') // => { h: 0, s: 0, l: 0 }
toHsl('#f00') // => { h: 0, s: 100, l: 50 }
toHsl('hsl(0, 100%, 50%)') // => { h: 0, s: 100, l: 50 }
toHsl({ r: 255, g: 0, b: 0, mode: 'rgb' }) // => { h: 0, s: 100, l: 50 }
```

### 带透明度的颜色

```typescript
import { toHsl } from '@esdora/color'

toHsl('rgba(255, 0, 0, 0.5)') // => { h: 0, s: 100, l: 50, a: 0.5 }
toHsl('rgba(255, 0, 0, 1)') // => { h: 0, s: 100, l: 50 }
```

### 无效输入

```typescript
import { toHsl } from '@esdora/color'

toHsl('invalid-color') // => null
toHsl('') // => null
toHsl(null as any) // => null
```

## 签名

```typescript
function toHsl(color: string | EsdoraColor): EsdoraHslColor | null
```

## 参数

| 参数  | 类型                    | 描述             | 必需 |
| ----- | ----------------------- | ---------------- | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色值 | 是   |

`color` 支持以下格式：

- **十六进制字符串**：`'#FF0000'`、`'#f00'`、`'#FF000080'`
- **RGB / RGBA 字符串**：`'rgb(255, 0, 0)'`、`'rgba(255, 0, 0, 0.5)'`
- **HSL 字符串**：`'hsl(0, 100%, 50%)'`
- **RGB 对象**：`{ r: 255, g: 0, b: 0 }` 或 `{ r: 255, g: 0, b: 0, mode: 'rgb' }`
- **HSL 对象**：`{ h: 0, s: 100, l: 50 }` 或 `{ h: 0, s: 100, l: 50, mode: 'hsl' }`
- **其他 culori 兼容对象**：如 OKLCH 等

## 返回值

- **类型**: `EsdoraHslColor | null`
- **说明**: 包含 `h`、`s`、`l` 属性的 HSL 颜色对象。当输入颜色包含小于 1 的透明度时，返回值还会包含 `a` 属性。
- **特殊情况**:
  - 输入无效或解析失败时返回 `null`
  - 透明度为 1 时不包含 `a` 属性
  - `h`、`s`、`l` 中任一值为 `undefined` 时，使用默认值 0

`EsdoraHslColor` 接口定义：

```typescript
interface EsdoraHslColor {
  h: number // 色相，范围 0-360
  s: number // 饱和度，范围 0-100
  l: number // 亮度，范围 0-100
  a?: number // 透明度，范围 0-1（仅当小于 1 时存在）
}
```

## 注意事项

### 输入边界

- RGB 对象中的 `r`、`g`、`b` 值大于 1 时会被自动识别为 0-255 范围并归一化到 0-1
- HSL 对象中的 `s`、`l` 值大于 1 时会被自动识别为百分比并归一化到 0-1
- 灰度颜色（如 `'#808080'`）的 `h` 和 `s` 值为 0

### 错误处理

- 不抛出异常，所有错误情况均返回 `null`
- 无效颜色字符串、空字符串、`null` 等非法输入均返回 `null`
- 颜色模式无效或 `culori` 转换失败时返回 `null`

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/conversion/to-hsl/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/conversion/to-hsl/index.test.ts)
