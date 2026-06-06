---
title: adjustChroma
description: "@esdora/color 的 adjustChroma 函数，以感知均匀的方式调整任意有效颜色的色度（饱和度）。"
---

# adjustChroma

以感知均匀的方式，调整任意有效颜色的色度（饱和度）。

此函数会先将任何输入颜色智能地转换为 OKLCH 色彩空间，然后再对色度 (C) 通道进行操作，以确保调整效果最符合人类视觉感知。

## 示例

### 基本用法

```typescript
import { adjustChroma } from '@esdora/color'

// 将色度设置为指定数值
adjustChroma('#FF0000', 0.2) // => { mode: 'oklch', l: ..., c: 0.2, h: ... }

// 使用函数基于当前色度进行调整
adjustChroma('#FF0000', c => c * 0.5) // => { mode: 'oklch', l: ..., c: ..., h: ... }
```

### 数值调整

```typescript
import { adjustChroma } from '@esdora/color'

// 设置为 0（完全去饱和）
adjustChroma('#FF0000', 0) // => { mode: 'oklch', c: 0, ... }

// 设置为最大值 0.4
adjustChroma('#FF0000', 0.4) // => { mode: 'oklch', c: 0.4, ... }

// 超出范围的值会被限制在 [0, 0.4] 区间内
adjustChroma('#FF0000', -0.1) // => { mode: 'oklch', c: 0, ... }
adjustChroma('#FF0000', 0.5) // => { mode: 'oklch', c: 0.4, ... }
```

### 函数调整

```typescript
import { adjustChroma } from '@esdora/color'

// 将当前色度减半
adjustChroma('#FF0000', c => c * 0.5)

// 函数返回超出范围的值时也会被限制
adjustChroma('#FF0000', () => -0.1) // => { mode: 'oklch', c: 0, ... }
adjustChroma('#FF0000', () => 0.5) // => { mode: 'oklch', c: 0.4, ... }
```

### 多种输入格式

```typescript
import { adjustChroma } from '@esdora/color'

// RGB 对象
adjustChroma({ r: 255, g: 0, b: 0 }, 0.1) // => { mode: 'oklch', c: 0.1, ... }

// HSL 字符串
adjustChroma('hsl(0, 100%, 50%)', 0.15) // => { mode: 'oklch', c: 0.15, ... }

// culori 颜色对象
adjustChroma({ mode: 'rgb', r: 1, g: 0, b: 0 }, 0.25) // => { mode: 'oklch', c: 0.25, ... }
```

### 无效输入处理

```typescript
import { adjustChroma } from '@esdora/color'

// 无效颜色字符串返回 null
adjustChroma('invalid-color', 0.1) // => null

// 空字符串返回 null
adjustChroma('', 0.1) // => null

// null / undefined 返回 null
adjustChroma(null, 0.1) // => null
adjustChroma(undefined, 0.1) // => null

// 无法转换的对象返回 null
adjustChroma({ invalid: 'object' }, 0.1) // => null
```

## 签名

```typescript
export type ChromaAdjuster = (currentChroma: number) => number

export function adjustChroma(
  color: string | EsdoraColor,
  adjuster: number | ChromaAdjuster
): EsdoraColor | null
```

## 参数

| 参数       | 类型                       | 描述                     | 必需 |
| ---------- | -------------------------- | ------------------------ | ---- |
| `color`    | `string \| EsdoraColor`    | 基础颜色字符串或颜色对象 | 是   |
| `adjuster` | `number \| ChromaAdjuster` | 色度调整值或调整函数     | 是   |

### ChromaAdjuster

| 参数            | 类型     | 描述                                                 |
| --------------- | -------- | ---------------------------------------------------- |
| `currentChroma` | `number` | 当前颜色的色度值（OKLCH 色彩空间），若未定义则为 `0` |

## 返回值

- **类型**: `EsdoraColor \| null`
- **说明**: 返回一个新的 OKLCH 颜色对象，其 `c`（色度）通道已被调整。返回的颜色对象始终处于 OKLCH 色彩空间。
- **特殊情况**:
  - 若输入颜色无效或无法解析，返回 `null`
  - 若颜色转换失败（如传入包含无效色彩空间的对象），返回 `null`
  - 若输入为 `null`、`undefined`、空字符串或无法识别的对象，返回 `null`
  - 当当前色度值为 `undefined` 时，函数调整器会收到 `0` 作为默认值

## 运行逻辑

```mermaid
flowchart TD
    A[输入 color + adjuster] --> B{parseColor 成功?}
    B -->|否| C[返回 null]
    B -->|是| D[转换为 OKLCH 色彩空间]
    D --> E{转换成功?}
    E -->|否| C
    E -->|是| F{adjuster 类型?}
    F -->|number| G[直接使用该数值]
    F -->|function| H[调用函数，传入当前色度值]
    H --> I{当前色度 undefined?}
    I -->|是| J[使用 0 作为默认值]
    I -->|否| K[使用当前色度值]
    G --> L[通过 clamp 限制在 [0, 0.4]]
    J --> L
    K --> L
    L --> M[返回调整后的 OKLCH 颜色对象]
```

函数首先将输入颜色解析为内部颜色对象，然后转换为 OKLCH 色彩空间。根据 `adjuster` 的类型，直接设置新色度值或通过回调函数计算新色度值。最终结果通过 `clamp` 限制在有效范围 `[0, 0.4]` 内。

## 注意事项

### 输入边界

- 色度值的有效范围为 `[0, 0.4]`，超出此范围的数值会被自动截断
- 输入颜色支持多种格式：CSS 字符串（hex、rgb、hsl 等）、RGB 对象、culori 颜色对象
- 灰色（如 `#808080`）的色度值可能为 `0` 或 `undefined`，使用函数调整器时会以 `0` 传入

### 错误处理

- 本函数**不抛出异常**，所有错误情况均通过返回 `null` 表达
- 返回 `null` 的场景包括：无效颜色字符串、空字符串、`null`/`undefined` 输入、无法解析的对象、色彩空间转换失败

### 性能考虑

- **时间复杂度**: O(1) — 单次颜色解析、转换和数值计算
- **空间复杂度**: O(1) — 仅创建一个新的颜色对象

### 兼容性

- **环境要求**: 现代浏览器和 Node.js（依赖 `@esdora/kit` 的 `clamp` 工具函数）

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/composition/adjust-chroma/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/composition/adjust-chroma/index.test.ts)
