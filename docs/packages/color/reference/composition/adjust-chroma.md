---
title: adjustChroma
description: adjustChroma - 来自 Dora Pocket 的颜色“道具”，用于以感知均匀的方式调整颜色的色度（饱和度）。
---

# adjustChroma

以感知均匀的 OKLCH 色彩空间为基础，精确调整颜色的色度（饱和度），并自动将结果限制在安全的显示范围内。

## 示例

### 设置绝对色度值

```typescript
import { adjustChroma } from '@esdora/color'

// 将红色的色度直接设置为 0.1（更鲜艳的红）
const vividRed = adjustChroma('#FF0000', 0.1)
// => { mode: 'oklch', l: 0.6279..., c: 0.1, h: 29.23... }

// 将色度设置为 0，颜色趋向灰度
const grayishRed = adjustChroma('#FF0000', 0)
// => { mode: 'oklch', l: 0.6279..., c: 0, h: 29.23... }
```

### 使用函数进行相对调整

```typescript
import { adjustChroma } from '@esdora/color'

// 将当前色度减半
const halfChromaRed = adjustChroma('#FF0000', currentChroma => currentChroma * 0.5)
// => { mode: 'oklch', l: 0.6279..., c: 0.1114..., h: 29.23... }

// 在当前色度基础上增加 0.05，并自动限制在 [0, 0.4] 范围内
const bumpedChromaRed = adjustChroma('#FF0000', currentChroma => currentChroma + 0.05)
// => { mode: 'oklch', l: 0.6279..., c: 0.2728..., h: 29.23... }
```

### 多种输入格式与无效输入处理

```typescript
import { adjustChroma } from '@esdora/color'

// 传入 RGB 对象
adjustChroma({ r: 255, g: 0, b: 0 } as any, 0.1)
// => { mode: 'oklch', l: 0.6279..., c: 0.1..., h: 29.23... }

// 传入 HSL 字符串
adjustChroma('hsl(0, 100%, 50%)', 0.15)
// => { mode: 'oklch', l: 0.6279..., c: 0.15..., h: 29.23... }

// 无效输入时返回 null，而不是抛出异常
adjustChroma('invalid-color', 0.1) // => null
adjustChroma('', 0.1) // => null
```

## 签名与说明

### 类型签名

````typescript
export type ChromaAdjuster = (currentChroma: number) => number

/**
 * 以感知均匀的方式，调整任意有效颜色的色度（饱和度）。
 *
 * 此函数会先将任何输入颜色智能地转换为 OKLCH 色彩空间，
 * 然后再对色度 (C) 通道进行操作，以确保调整效果最符合人类视觉感知。
 *
 * @param color 基础颜色字符串或颜色对象
 * @param adjuster 一个数字或一个函数来修改色度
 * @returns 一个新的、调整色度后的颜色对象，如果输入无效则返回 null
 *
 * @example
 * ```typescript
 * adjustChroma('#FF0000', 0.2);           // 设置色度为 0.2
 * adjustChroma('#FF0000', c => c * 0.5);  // 将色度减半
 * adjustChroma('invalid', 0.1);           // => null
 * ```
 *
 * @internal
 */
export function adjustChroma(color: string | EsdoraColor, adjuster: number | ChromaAdjuster): EsdoraColor | null
````

### 参数说明

| 参数     | 类型                       | 描述                                                                                          | 必需 |
| -------- | -------------------------- | --------------------------------------------------------------------------------------------- | ---- |
| color    | `string \| EsdoraColor`    | 要调整的基础颜色，可以是 CSS 颜色字符串（HEX、RGB、HSL 等）或 `EsdoraColor`/culori 颜色对象。 | 是   |
| adjuster | `number \| ChromaAdjuster` | 色度调整器：数值表示目标色度值，函数则基于当前色度计算新的色度值。                            | 是   |

### 返回值

- **类型**: `EsdoraColor \| null`
- **说明**: 返回一个 OKLCH 格式的颜色对象（`{ mode: 'oklch', l, c, h, ... }`），其中 `c` 通道为调整后的色度值。
- **特殊情况**: 当输入颜色无法被解析，或在转换到 OKLCH 色彩空间时发生错误时，返回 `null`。

### 泛型约束（如适用）

- 本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 接受多种颜色输入格式，包括 HEX 字符串、RGB/HSL 字符串以及 `EsdoraColor`/culori 颜色对象。
- 当 `color` 为无效颜色字符串、空字符串、`null`、`undefined` 或无法解析的对象时，函数会返回 `null`。
- 当传入的颜色对象具有未知的 `mode` 或非法的通道值时，转换为 OKLCH 可能失败，此时函数会返回 `null`。
- 对于本身没有明显色度的颜色（例如灰色 `#808080`），其当前色度会被视为 `0`，并在此基础上进行调整。

### 错误处理

- 对颜色解析和 OKLCH 转换过程中可能抛出的异常使用 `try/catch` 进行捕获，不会把异常直接向上传递。
- 当转换失败或输入不可用时，统一返回 `null`，方便调用方以空值语义处理异常情况。

### 性能考虑

- **时间复杂度**: O(1) - 每次调用只进行一次颜色解析、一次 OKLCH 转换与一次色度计算。
- **空间复杂度**: O(1) - 仅产生必要的中间颜色对象，没有与输入规模相关的额外内存开销。
- **优化建议**: 适合在调色面板、主题生成器等高频场景中使用；若需要对同一批颜色进行多次调整，建议在业务层缓存解析后的 OKLCH 结果。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/composition/adjust-chroma/index.ts)
