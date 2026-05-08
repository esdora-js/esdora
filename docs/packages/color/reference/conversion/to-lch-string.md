---
title: toLchString
description: '@esdora/color 的 toLchString 函数，将任意合法颜色转换为 LCH 颜色字符串'
---

# toLchString

将任意合法颜色转换为 LCH 颜色字符串。

## 示例

### 基本用法

```typescript
import { toLchString } from '@esdora/color'

toLchString('#FF0000') // => 'lch(54.291 106.839 40.853)'
toLchString('rgb(255, 0, 0)') // => 'lch(54.291 106.839 40.853)'
toLchString('#FFFFFF') // => 'lch(100 0 none)'
toLchString('#000000') // => 'lch(0 0 none)'
```

### 多种输入格式

```typescript
import { toLchString } from '@esdora/color'

// RGB 对象（自动归一化 0-255 范围）
toLchString({ r: 255, g: 0, b: 0 }) // => 'lch(54.291 106.839 40.853)'

// HSL 字符串
toLchString('hsl(0, 100%, 50%)') // => 'lch(54.291 106.839 40.853)'

// HSL 对象（自动归一化百分比）
toLchString({ h: 0, s: 100, l: 50 }) // => 'lch(54.291 106.839 40.853)'

// culori 颜色对象
toLchString({ mode: 'rgb', r: 1, g: 0, b: 0 }) // => 'lch(54.291 106.839 40.853)'
```

### 透明度处理

```typescript
import { toLchString } from '@esdora/color'

// 带透明度的颜色会包含 alpha 通道
toLchString('rgba(255, 0, 0, 0.5)') // => 'lch(54.291 106.839 40.853 / 0.5)'
```

### 无效输入

```typescript
import { toLchString } from '@esdora/color'

toLchString('invalid-color') // => null
toLchString('') // => null
toLchString(null) // => null
toLchString(undefined) // => null
toLchString({ invalid: 'object' }) // => null
```

## 签名

```typescript
export function toLchString(color: string | EsdoraColor): string | null
```

## 参数

| 参数  | 类型                    | 描述                                                                                    | 必需 |
| ----- | ----------------------- | --------------------------------------------------------------------------------------- | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色输入，支持十六进制字符串、RGB/HSL 字符串、RGB/HSL 对象、culori 颜色对象等 | 是   |

## 返回值

- **类型**: `string | null`
- **说明**: 转换后的 LCH 颜色字符串。格式为 `lch(L C H)` 或 `lch(L C H / alpha)`（当包含透明度时）。
- **特殊情况**:
  - 当输入为空字符串、`null`、`undefined` 或无法解析的颜色字符串时，返回 `null`
  - 当输入为无法转换的对象（如不包含有效颜色字段的对象）时，返回 `null`
  - 当颜色模式无效导致 `culori` 转换失败时，返回 `null`
  - 对于白色和黑色等中性色，色相角（H）可能为 `none`

## 注意事项

### 输入边界

- 支持十六进制字符串（如 `#FF0000`、`#F00`）
- 支持 CSS 颜色字符串（如 `rgb(...)`、`hsl(...)`、`rgba(...)`）
- 支持 RGB 对象 `{ r, g, b, a? }`，其中 `r/g/b` 范围为 0-255，会自动归一化到 0-1
- 支持 HSL 对象 `{ h, s, l, a? }`，其中 `s/l` 范围为 0-100，会自动归一化到 0-1
- 支持 culori 原生颜色对象（如 `{ mode: 'rgb', r: 1, g: 0, b: 0 }`）
- 不支持 `null`、`undefined`、空字符串和非颜色对象

### 错误处理

- 函数不抛出异常，所有错误情况均返回 `null`
- 内部使用 `try-catch` 捕获 `culori` 转换过程中的异常
- 输入验证由 `parseColor` 内部处理，无效输入直接返回 `null`

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/conversion/to-lch-string/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/conversion/to-lch-string/index.test.ts)
