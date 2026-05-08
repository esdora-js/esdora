---
title: isDark
description: '@esdora/color 的 isDark 函数，检查一个颜色是否为暗色'
---

# isDark

检查一个颜色是否是"暗色"。

该函数基于 OKLCH 色彩空间的亮度（L）通道进行判断，当亮度值低于 `0.5` 时判定为暗色。支持多种颜色输入格式，包括 HEX 字符串、CSS 颜色名、HSL 字符串以及颜色对象。

## 示例

### 基本用法

```typescript
import { isDark } from '@esdora/color'

isDark('#FFFFFF') // => false
isDark('#000000') // => true
isDark('yellow') // => false
```

### 多种输入格式

```typescript
import { isDark } from '@esdora/color'

// RGB 对象
isDark({ r: 255, g: 255, b: 255 }) // => false

// HSL 字符串
isDark('hsl(0, 0%, 0%)') // => true

// culori 颜色对象
isDark({ mode: 'rgb', r: 0, g: 0, b: 0 }) // => true
```

### 无效输入

```typescript
import { isDark } from '@esdora/color'

isDark('invalid-color') // => null
isDark('') // => null
isDark(null as any) // => null
isDark(undefined as any) // => null
```

## 签名

```typescript
function isDark(color: string | EsdoraColor): boolean | null
```

## 参数

| 参数  | 类型                    | 描述                         | 必需 |
| ----- | ----------------------- | ---------------------------- | ---- |
| color | `string \| EsdoraColor` | 要检查的颜色字符串或颜色对象 | 是   |

`EsdoraColor` 支持以下形式：

- HEX 字符串（如 `'#FFFFFF'`、`'#000'`）
- CSS 颜色名（如 `'red'`、`'yellow'`）
- HSL 字符串（如 `'hsl(0, 0%, 0%)'`）
- RGB 对象（如 `{ r: 255, g: 255, b: 255 }`）
- culori 颜色对象（如 `{ mode: 'rgb', r: 0, g: 0, b: 0 }`）
- OKLCH 颜色对象（如 `{ mode: 'oklch', l: 0.5, c: 0, h: 0 }`）

## 返回值

- **类型**: `boolean | null`
- **说明**: 如果颜色被认为是暗色，返回 `true`；如果是亮色，返回 `false`
- **特殊情况**:
  - 输入无效或无法解析时，返回 `null`
  - OKLCH 亮度值（`l`）为 `undefined` 时，使用默认值 `1` 判断为亮色
  - 亮度值恰好等于阈值 `0.5` 时，判断为亮色（`false`）

## 注意事项

### 输入边界

- 空字符串、`null`、`undefined` 均返回 `null`
- 无法识别的颜色字符串返回 `null`
- 结构不合法的颜色对象可能返回 `null`
- 亮度阈值固定为 `0.5`，不提供自定义阈值参数

### 错误处理

- 函数不会抛出异常
- 解析失败或颜色转换失败时静默返回 `null`
- 内部使用 `try/catch` 捕获 `oklch` 转换异常

## 相关链接

- [源码](https://github.com/DreamyTZK/esdora/blob/main/packages/color/src/analysis/is-dark/index.ts)
- [单元测试](https://github.com/DreamyTZK/esdora/blob/main/packages/color/src/analysis/is-dark/index.test.ts)
