---
title: isInGamut
description: '@esdora/color 的 isInGamut 函数，检查一个颜色是否在指定的色域范围内。'
---

# isInGamut

检查一个颜色是否在指定的色域范围内。支持 RGB 和 P3 两种色域，默认检查 RGB 色域。

## 示例

### 基本用法

```typescript
import { isInGamut } from '@esdora/color'

isInGamut('#FF0000') // => true
isInGamut('#00FF00', 'rgb') // => true
isInGamut('#0000FF', 'p3') // => false (标准 sRGB 蓝色不在 P3 色域内)
```

### 多种输入格式

```typescript
import { isInGamut } from '@esdora/color'

// 支持 Hex 字符串
isInGamut('#FF0000') // => true

// 支持 HSL 字符串
isInGamut('hsl(0, 100%, 50%)') // => true

// 支持 culori 颜色对象
isInGamut({ mode: 'rgb', r: 1, g: 0, b: 0 }) // => true

// 支持 RGB 对象
isInGamut({ r: 255, g: 0, b: 0 } as any) // => true
```

### 无效输入处理

```typescript
import { isInGamut } from '@esdora/color'

isInGamut('invalid-color') // => null
isInGamut('') // => null
isInGamut(null as any) // => null
isInGamut(undefined as any) // => null
```

## 签名

```typescript
function isInGamut(
  color: string | EsdoraColor,
  gamut: 'rgb' | 'p3' = 'rgb'
): boolean | null
```

## 参数

| 参数  | 类型                    | 描述                                             | 必需 |
| ----- | ----------------------- | ------------------------------------------------ | ---- |
| color | `string \| EsdoraColor` | 要检查的颜色字符串或颜色对象                     | 是   |
| gamut | `'rgb' \| 'p3'`         | 目标色域，支持 `'rgb'` 和 `'p3'`，默认为 `'rgb'` | 否   |

## 返回值

- **类型**: `boolean \| null`
- **说明**: 如果颜色在指定色域内，返回 `true`；如果超出色域，返回 `false`
- **特殊情况**: 如果输入无效或色域转换失败，返回 `null`

## 注意事项

### 输入边界

- 支持 Hex 字符串（如 `'#FF0000'`）、HSL 字符串（如 `'hsl(0, 100%, 50%)'`）、RGB 对象（如 `{ r: 255, g: 0, b: 0 }`）以及 culori 颜色对象（如 `{ mode: 'rgb', r: 1, g: 0, b: 0 }`）
- 传入空字符串、`null`、`undefined` 或无法解析的颜色字符串时，返回 `null`
- 传入无法转换的颜色对象（如包含无效 `mode` 的对象）时，返回 `null`
- 标准 sRGB 蓝色（`'#0000FF'`）不在 P3 色域内，这是符合预期的色域差异

### 错误处理

- 函数不会抛出异常
- 所有解析失败或色域转换失败的情况均通过返回 `null` 表达

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/analysis/is-in-gamut/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/analysis/is-in-gamut/index.test.ts)
