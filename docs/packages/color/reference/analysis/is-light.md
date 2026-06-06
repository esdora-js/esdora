---
title: isLight
description: '@esdora/color 的 isLight 函数，检查一个颜色是否是亮色。'
---

# isLight

检查一个颜色是否是「亮色」。

该函数基于 OKLCH 色彩空间的亮度通道（L）进行判断，将输入颜色转换为 OKLCH 后，若亮度值大于等于 0.5 则判定为亮色。对于无效输入，返回 `null`。

## 示例

### 基本用法

```typescript
import { isLight } from '@esdora/color'

isLight('#FFFFFF') // => true
isLight('#000000') // => false
isLight('yellow') // => true
isLight('#808080') // => true
isLight('#000080') // => false
```

### 多种输入格式

```typescript
import { isLight } from '@esdora/color'

// HSL 字符串
isLight('hsl(0, 0%, 100%)') // => true

// culori 颜色对象
isLight({ mode: 'rgb', r: 1, g: 1, b: 1 }) // => true
```

### 无效输入处理

```typescript
import { isLight } from '@esdora/color'

isLight('invalid-color') // => null
isLight('') // => null
isLight(null as any) // => null
isLight(undefined as any) // => null
isLight({ invalid: 'object' } as any) // => null
```

## 签名

```typescript
export function isLight(color: string | EsdoraColor): boolean | null
```

## 参数

| 参数  | 类型                    | 描述                         | 必需 |
| ----- | ----------------------- | ---------------------------- | ---- |
| color | `string \| EsdoraColor` | 要检查的颜色字符串或颜色对象 | 是   |

## 返回值

- **类型**: `boolean \| null`
- **说明**: 如果颜色被认为是亮色，则返回 `true`；如果是暗色，则返回 `false`；如果输入无效，则返回 `null`
- **特殊情况**:
  - 输入为无效颜色字符串（如 `'invalid-color'`）时返回 `null`
  - 输入为空字符串、`null`、`undefined` 时返回 `null`
  - 输入为无法解析的对象时返回 `null`
  - 中灰色（如 `'#808080'`）判定为亮色

## 注意事项

### 输入边界

- 支持 HEX 字符串（如 `'#FFFFFF'`）、CSS 颜色名（如 `'yellow'`）、HSL 字符串（如 `'hsl(0, 0%, 100%)'`）等多种格式
- 支持 RGB 对象（`{ r, g, b }`）和 culori 颜色对象（`{ mode: 'rgb', r, g, b }`）
- 内部通过 `isDark` 的返回值取反得到结果，因此与 `isDark` 完全互补

### 错误处理

- 不抛出异常，所有无效输入均返回 `null`
- 内部解析失败时返回 `null`，不会中断调用链

## 相关链接

- [源码](/packages/color/src/analysis/is-light/index.ts)
- [单元测试](/packages/color/src/analysis/is-light/index.test.ts)
