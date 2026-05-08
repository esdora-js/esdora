---
title: adjustLightness
description: "@esdora/color 的 adjustLightness 函数，以感知均匀的方式调整任意有效颜色的亮度。"
---

# adjustLightness

以感知均匀的方式，调整任意有效颜色的亮度。

此函数会先将任何输入颜色智能地转换为 OKLCH 色彩空间，然后再对亮度（L）通道进行操作，以确保调整效果最符合人类视觉感知。

## 示例

### 基本用法

```typescript
import { adjustLightness } from '@esdora/color'

// 使用数值直接设置亮度
adjustLightness('#ff0000', 0.5)
// => { mode: 'oklch', l: 0.5, c: ..., h: ... }

// 使用函数基于当前亮度进行调整
adjustLightness('#ff0000', l => l * 0.5)
// => { mode: 'oklch', l: ..., c: ..., h: ... }
```

### 数值调整器

```typescript
import { adjustLightness } from '@esdora/color'

// 直接设置为指定亮度
adjustLightness('#ff0000', 0.3)
// => { mode: 'oklch', l: 0.3, ... }

// 超出范围的值会被限制在 [0, 1] 内
adjustLightness('#ff0000', 1.5) // => { mode: 'oklch', l: 1, ... }
adjustLightness('#ff0000', -0.5) // => { mode: 'oklch', l: 0, ... }
```

### 函数调整器

```typescript
import { adjustLightness } from '@esdora/color'

// 基于当前亮度进行计算
adjustLightness('#ff0000', l => l * 0.5)
// => { mode: 'oklch', l: ..., ... }

// 返回 0 或 1 时直接设置为对应亮度
adjustLightness('#ff0000', () => 0) // => { mode: 'oklch', l: 0, ... }
adjustLightness('#ff0000', () => 1) // => { mode: 'oklch', l: 1, ... }

// 函数返回超出范围的值时会被限制
adjustLightness('#ff0000', () => -0.5) // => { mode: 'oklch', l: 0, ... }
adjustLightness('#ff0000', () => 1.5) // => { mode: 'oklch', l: 1, ... }
```

### 多种输入格式

```typescript
import { adjustLightness } from '@esdora/color'

// RGB 对象
adjustLightness({ r: 255, g: 0, b: 0 }, 0.3)
// => { mode: 'oklch', l: 0.3, ... }

// HSL 字符串
adjustLightness('hsl(0, 100%, 50%)', 0.7)
// => { mode: 'oklch', l: 0.7, ... }

// culori 颜色对象
adjustLightness({ mode: 'rgb', r: 1, g: 0, b: 0 }, 0.2)
// => { mode: 'oklch', l: 0.2, ... }
```

### 无效输入处理

```typescript
import { adjustLightness } from '@esdora/color'

// 无效颜色字符串返回 null
adjustLightness('invalid-color', 0.5) // => null

// 空字符串返回 null
adjustLightness('', 0.5) // => null

// null / undefined 返回 null
adjustLightness(null as any, 0.5) // => null
adjustLightness(undefined as any, 0.5) // => null

// 无法转换的对象返回 null
adjustLightness({ invalid: 'object' } as any, 0.5) // => null
```

## 签名

```typescript
export type LightnessAdjuster = (currentLightness: number) => number

export function adjustLightness(
  color: string | EsdoraColor,
  adjuster: number | LightnessAdjuster
): EsdoraColor | null
```

## 参数

| 参数       | 类型                          | 描述                     | 必需 |
| ---------- | ----------------------------- | ------------------------ | ---- |
| `color`    | `string \| EsdoraColor`       | 基础颜色字符串或颜色对象 | 是   |
| `adjuster` | `number \| LightnessAdjuster` | 亮度调整值或调整函数     | 是   |

### LightnessAdjuster

| 参数               | 类型     | 描述                            |
| ------------------ | -------- | ------------------------------- |
| `currentLightness` | `number` | 当前颜色的亮度值（范围 [0, 1]） |

## 返回值

- **类型**: `EsdoraColor \| null`
- **说明**: 返回一个新的调整亮度后的 OKLCH 颜色对象。如果输入无效或转换失败，则返回 `null`。
- **特殊情况**:
  - 输入无效颜色字符串、空字符串、`null`、`undefined` 或无法解析的对象时，返回 `null`
  - 颜色模式无效导致转换失败时，返回 `null`
  - 调整后的亮度值会被限制在 `[0, 1]` 范围内

## 注意事项

### 输入边界

- `color` 支持多种格式：CSS 颜色字符串（如 `#ff0000`、`hsl(0, 100%, 50%)`）、RGB 对象、`culori` 颜色对象等
- `adjuster` 为数值时，直接设置为该亮度值，超出 `[0, 1]` 范围会被限制
- `adjuster` 为函数时，接收当前亮度值作为参数，返回值同样会被限制在 `[0, 1]` 范围内

### 错误处理

- 函数不会抛出异常，所有错误情况均通过返回 `null` 表达
- 内部使用 `try/catch` 捕获颜色转换过程中的异常，确保不会因无效输入而中断执行

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/composition/adjust-lightness/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/composition/adjust-lightness/index.test.ts)
