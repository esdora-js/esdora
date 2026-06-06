---
title: setAlpha
description: "@esdora/color 的 setAlpha 函数，设置颜色的透明度（alpha 通道）并返回十六进制颜色字符串"
---

# setAlpha

设置颜色的透明度（alpha 通道）到指定值，不改变色相、饱和度、亮度等其他属性，返回十六进制格式的颜色字符串。

## 示例

### 基本用法

```typescript
import { setAlpha } from '@esdora/color'

setAlpha('#ff0000', 0.5) // => '#ff000080'
setAlpha('rgb(255, 0, 0)', 0.8) // => '#ff0000cc'
setAlpha('hsl(0, 100%, 50%)', 0.6) // => '#ff000099'
setAlpha('red', 0.3) // => '#ff00004d'
```

### 更新已有透明度的颜色

```typescript
import { setAlpha } from '@esdora/color'

setAlpha('rgba(255, 0, 0, 0.3)', 0.9) // => '#ff0000e6'
setAlpha('hsla(0, 100%, 50%, 0.2)', 0.7) // => '#ff0000b3'
setAlpha('#ff000080', 0.2) // => '#ff000033'
```

### 完全不透明与完全透明

```typescript
import { setAlpha } from '@esdora/color'

setAlpha('#ff0000', 0) // => '#ff000000'（完全透明）
setAlpha('#ff0000', 1) // => '#ff0000'   （完全不透明，省略 alpha 通道）
```

### 边界值自动限制

```typescript
import { setAlpha } from '@esdora/color'

setAlpha('#ff0000', 1.5) // => '#ff0000'  （超出上限，限制为 1）
setAlpha('#ff0000', -0.5) // => '#ff000000'（超出下限，限制为 0）
```

### 实际使用场景

```typescript
import { setAlpha } from '@esdora/color'

// 创建悬停效果
const button = '#3498db'
setAlpha(button, 0.8) // => '#3498dbcc'

// 创建遮罩层
setAlpha('#000000', 0.5) // => '#00000080'

// 调整现有透明颜色
const semiTransparent = 'rgba(52, 152, 219, 0.3)'
setAlpha(semiTransparent, 0.8) // => '#3498dbcc'
```

## 签名

```typescript
function setAlpha(color: string | EsdoraColor, alpha: number): string | null
```

## 参数

| 参数    | 类型                    | 描述                                                                          | 必需 |
| ------- | ----------------------- | ----------------------------------------------------------------------------- | ---- |
| `color` | `string \| EsdoraColor` | 基础颜色，支持 hex、rgb、hsl、rgba、hsla 等格式，也支持颜色名称（如 `'red'`） | 是   |
| `alpha` | `number`                | 新的透明度值，取值范围 0–1（0 为完全透明，1 为完全不透明）                    | 是   |

## 返回值

- **类型**: `string \| null`
- **说明**: 设置透明度后的十六进制颜色字符串。当 `alpha` 为 1 时返回标准 6 位 hex（如 `'#ff0000'`）；当 `alpha` 小于 1 时返回 8 位 hex（如 `'#ff000080'`）。
- **特殊情况**: 若输入的 `color` 无法解析为有效颜色，则返回 `null`。

## 注意事项

### 输入边界

- `alpha` 值会被自动限制在 `[0, 1]` 范围内，超出部分不会抛错，而是被截断到边界值。
- 输入颜色支持多种格式：hex（6 位或 8 位）、rgb/rgba、hsl/hsla、CSS 颜色关键字。
- 不同格式的相同颜色在设置相同 `alpha` 后，返回的 hex 结果一致。

### 错误处理

- 当 `color` 为无效颜色字符串、空字符串、`null` 或 `undefined` 时，函数返回 `null`，不会抛出异常。

## 相关链接

- [源码](https://github.com/kkfive/esdora/tree/main/packages/color/src/manipulation/set-alpha/index.ts)
- [单元测试](https://github.com/kkfive/esdora/tree/main/packages/color/src/manipulation/set-alpha/index.test.ts)
