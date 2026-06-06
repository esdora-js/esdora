---
title: toOklch
description: '@esdora/color 的 toOklch 函数，将任意合法颜色转换为 OKLCH 颜色对象'
---

# toOklch

将任意合法颜色（字符串或对象）转换为 OKLCH 颜色对象。

## 示例

### 基本用法

```typescript
import { toOklch } from '@esdora/color'

toOklch('#FF0000') // => { l: 0.628, c: 0.258, h: 29.234 }
toOklch('rgb(255, 0, 0)') // => { l: 0.628, c: 0.258, h: 29.234 }
toOklch('hsl(0, 100%, 50%)') // => { l: 0.628, c: 0.258, h: 29.234 }
```

### 不同颜色格式

```typescript
import { toOklch } from '@esdora/color'

toOklch('#00FF00') // => { l: 0.866, c: 0.295, h: 142.495 }
toOklch('#0000FF') // => { l: 0.452, c: 0.313, h: 264.052 }
toOklch('#FFFFFF') // => { l: 1, c: 0, h: 0 }
toOklch('#000000') // => { l: 0, c: 0, h: 0 }
```

### 带透明度的颜色

```typescript
import { toOklch } from '@esdora/color'

toOklch('rgba(255, 0, 0, 0.5)') // => { l: 0.628, c: 0.258, h: 29.234, a: 0.5 }
```

### 颜色对象输入

```typescript
import { toOklch } from '@esdora/color'

toOklch({ r: 255, g: 0, b: 0 }) // => { l: 0.628, c: 0.258, h: 29.234 }
```

### 无效输入

```typescript
import { toOklch } from '@esdora/color'

toOklch('invalid-color') // => null
toOklch('') // => null
toOklch(null as any) // => null
```

## 签名

```typescript
function toOklch(color: string | EsdoraColor): EsdoraOklchColor | null
```

## 参数

| 参数  | 类型                    | 描述                                                                                        | 必需 |
| ----- | ----------------------- | ------------------------------------------------------------------------------------------- | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色表示，支持 HEX、RGB、HSL、OKLCH 等字符串格式，以及 RGB / HSL / OKLCH 颜色对象 | 是   |

## 返回值

- **类型**: `EsdoraOklchColor \| null`
- **说明**: 包含 `l`（亮度）、`c`（色度）、`h`（色相）属性的 OKLCH 颜色对象。当输入颜色带有透明度且 `alpha < 1` 时，返回值还会包含 `a` 属性。
- **特殊情况**:
  - 输入无效或解析失败时返回 `null`
  - 当 `alpha === 1` 时，返回值不包含 `a` 属性
  - 当 `l`、`c`、`h` 转换结果为 `undefined` 时，默认使用 `0`

## 注意事项

### 输入边界

- 支持 HEX 字符串（如 `#FF0000`、`#f00`）
- 支持 CSS 颜色字符串（如 `rgb(...)`、`hsl(...)`、`rgba(...)`）
- 支持 RGB 对象（如 `{ r: 255, g: 0, b: 0 }`），`r/g/b` 范围为 0-255
- 支持 HSL 对象（如 `{ h: 180, s: 100, l: 50 }`），`s/l` 可为百分比
- 支持标准 culori 颜色对象（带 `mode` 字段）
- 输入 `null`、`undefined`、空字符串或无法解析的字符串时，函数返回 `null`

### 错误处理

- 函数不会抛出异常，所有错误情况均通过返回 `null` 表达
- 当 `parseColor` 解析失败或 `culori.oklch` 转换失败时，均返回 `null`

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/conversion/to-oklch/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/conversion/to-oklch/index.test.ts)
