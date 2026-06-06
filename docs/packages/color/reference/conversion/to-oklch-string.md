---
title: toOklchString
description: "@esdora/color 的 toOklchString 函数，将任意合法颜色转换为 OKLCH 颜色字符串。"
---

# toOklchString

将任意合法颜色转换为 OKLCH 颜色字符串。

## 示例

### 基本用法

```typescript
import { toOklchString } from '@esdora/color'

toOklchString('#FF0000') // => 'oklch(0.628 0.258 29.234)'
toOklchString('rgb(255, 0, 0)') // => 'oklch(0.628 0.258 29.234)'
```

### 多种输入格式

```typescript
import { toOklchString } from '@esdora/color'

// 十六进制
toOklchString('#00FF00') // => 'oklch(0.866 0.295 142.54)'

// RGB 对象
toOklchString({ r: 255, g: 0, b: 0 }) // => 'oklch(0.628 0.258 29.234)'

// HSL 字符串
toOklchString('hsl(0, 100%, 50%)') // => 'oklch(0.628 0.258 29.234)'

// culori 颜色对象
toOklchString({ mode: 'rgb', r: 1, g: 0, b: 0 }) // => 'oklch(0.628 0.258 29.234)'
```

### 透明度处理

```typescript
import { toOklchString } from '@esdora/color'

toOklchString('rgba(255, 0, 0, 0.5)') // => 'oklch(0.628 0.258 29.234 / 0.5)'
```

### 无效输入

```typescript
import { toOklchString } from '@esdora/color'

toOklchString('invalid-color') // => null
toOklchString('') // => null
toOklchString(null as any) // => null
toOklchString(undefined as any) // => null
toOklchString({ invalid: 'object' } as any) // => null
```

## 签名

```typescript
function toOklchString(color: string | EsdoraColor): string | null
```

## 参数

| 参数  | 类型                    | 描述                                                                       | 必需 |
| ----- | ----------------------- | -------------------------------------------------------------------------- | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色值，支持十六进制、RGB、HSL、CSS 颜色字符串及 culori 颜色对象 | 是   |

## 返回值

- **类型**: `string | null`
- **说明**: 返回 OKLCH 格式的 CSS 颜色字符串。若输入包含透明度（如 `rgba`），返回值会包含 `/ alpha` 分量。
- **特殊情况**:
  - 输入无法解析为合法颜色时，返回 `null`
  - 输入为空字符串、`null`、`undefined` 或格式不兼容的对象时，返回 `null`
  - 颜色模式转换失败时（如传入无效 mode），返回 `null`

## 注意事项

### 输入边界

- 接受所有标准 CSS 颜色格式：十六进制（`#RRGGBB`、`#RGB`）、RGB/RGBA、HSL/HSLA、命名颜色等
- 接受 culori 风格的颜色对象（如 `{ mode: 'rgb', r: 1, g: 0, b: 0 }`）
- 接受 Esdora 颜色对象（`{ r, g, b }`、`{ h, s, l }` 等）
- 对于无彩色（如白色、黑色），色相分量可能为 `none`

### 错误处理

- 本函数**不抛出异常**。所有错误情况（无效输入、转换失败）均通过返回 `null` 表达
- 内部使用 `try/catch` 捕获 culori 转换异常，确保调用方无需处理运行时错误

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/conversion/to-oklch-string/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/conversion/to-oklch-string/index.test.ts)
