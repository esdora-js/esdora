---
title: isLight
description: isLight - 来自 Dora Pocket 的颜色“道具”，用于检查一个颜色是否是“亮色”。
---

# isLight

检查一个颜色是否是“亮色”，并以布尔值返回结果；当输入无法解析为颜色时，返回 `null`。

## 示例

### 基本用法

```typescript
import { isLight } from '@esdora/color'

// 判断亮色
isLight('#FFFFFF') // => true
isLight('yellow') // => true

// 判断暗色
isLight('#000000') // => false
isLight('#000080') // => false

// 中灰色被视为“非暗色”，因此属于亮色
isLight('#808080') // => true
```

### 支持多种颜色格式

```typescript
import { isLight } from '@esdora/color'

// 使用 HSL 字符串
isLight('hsl(0, 0%, 100%)') // => true

// 使用 RGB 对象
isLight({ r: 0, g: 0, b: 0 } as any) // => false

// 使用 culori 颜色对象
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

## 签名与说明

### 类型签名

````typescript
/**
 * 检查一个颜色是否是“亮色”。
 *
 * @param color 要检查的颜色字符串或颜色对象
 * @returns 如果颜色被认为是亮色，则返回 `true`；如果是暗色，则返回 `false`；如果输入无效，则返回 `null`
 *
 * @example
 * ```typescript
 * isLight('#FFFFFF'); // => true
 * isLight('#000000'); // => false
 * isLight('yellow');  // => true
 * isLight('invalid'); // => null
 * ```
 */
export function isLight(color: string | EsdoraColor): boolean | null
````

### 参数说明

| 参数  | 类型                    | 描述                                                           | 必需 |
| ----- | ----------------------- | -------------------------------------------------------------- | ---- |
| color | `string \| EsdoraColor` | 要检查的颜色，可以是 CSS 颜色字符串或 `EsdoraColor` 颜色对象。 | 是   |

### 返回值

- **类型**: `boolean \| null`
- **说明**: 当颜色被视为“亮色”（即不是暗色）时返回 `true`，当颜色为“暗色”时返回 `false`。
- **特殊情况**: 当输入无法解析为有效颜色时，返回 `null`，用于标识“无法判断亮度”的情况。

### 泛型约束（如适用）

- 本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 接受多种颜色输入格式，包括 HEX 字符串、RGB/HSL 字符串以及 `EsdoraColor`/culori 颜色对象。
- 当 `color` 为无效颜色字符串（如 `'invalid-color'`、空字符串）、`null`、`undefined` 或无法解析的对象时，函数会返回 `null`。

### 错误处理

- 函数不会主动抛出异常，而是依赖内部的 `isDark` 与颜色解析逻辑，在不能解析输入时返回 `null`。
- 当内部 `isDark` 返回 `null`（表示输入无法解析为颜色）时，本函数也会原样返回 `null`，确保调用方可统一处理“无效输入”。

### 性能考虑

- **时间复杂度**: O(1) - 每次调用只进行一次颜色解析与一次亮度判断。
- **空间复杂度**: O(1) - 不会创建与输入规模相关的额外数据结构。
- **优化建议**: 可以安全地在渲染流程或交互逻辑中高频调用；若已在上层缓存了颜色解析结果，可考虑直接使用更底层的颜色处理工具以避免重复解析。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/analysis/is-light/index.ts)
