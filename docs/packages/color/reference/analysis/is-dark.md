---
title: isDark
description: "isDark - Dora Pocket 中 @esdora/color 库提供的亮度分析工具函数，用于判断一个颜色是亮色还是暗色。"
---

# isDark

基于 OKLCH 颜色空间的感知亮度，判断传入颜色是“暗色”还是“亮色”，并在无法解析颜色时返回 `null`。

## 示例

### 基本用法

```typescript
import { isDark } from '@esdora/color'

// 亮色示例
isDark('#FFFFFF')
// => false

isDark('yellow')
// => false

// 暗色示例
isDark('#000000')
// => true

isDark('#000080')
// => true
```

### 多种颜色格式支持

```typescript
import { isDark } from '@esdora/color'

// HSL 字符串
isDark('hsl(0, 0%, 0%)')
// => true

// RGB 颜色对象
isDark({ r: 255, g: 255, b: 255 } as any)
// => false

// culori 颜色对象
isDark({ mode: 'rgb', r: 0, g: 0, b: 0 })
// => true
```

### 无效输入与边界情况

```typescript
import { isDark } from '@esdora/color'

// 无效颜色字符串
isDark('invalid-color')
// => null

// 空字符串
isDark('')
// => null

// 结构不正确的对象
isDark({ invalid: 'object' } as any)
// => null
```

## 签名与说明

### 类型签名

```typescript
export function isDark(color: string | EsdoraColor): boolean | null
```

### 参数说明

| 参数    | 类型                    | 描述                                                                   | 必需 |
| ------- | ----------------------- | ---------------------------------------------------------------------- | ---- |
| `color` | `string \| EsdoraColor` | 要检查的颜色。支持 Hex、RGB、HSL 等格式的字符串或 `EsdoraColor` 对象。 | 是   |

### 返回值

- **类型**: `boolean \| null`
- **说明**:
  - 返回 `true` 表示该颜色在 OKLCH 颜色空间的亮度值较低，被视为“暗色”。
  - 返回 `false` 表示该颜色亮度较高，被视为“亮色”。
  - 返回 `null` 表示输入不是有效颜色或无法完成到 OKLCH 的转换。
- **特殊情况**:
  - 当 OKLCH 结果中的亮度通道 `l` 为 `undefined` 时，会使用默认值 `1`，因此该颜色会被视为“亮色”（返回 `false`）。
  - 当亮度值恰好等于阈值 `0.5` 时，函数也会返回 `false`，视为“亮色”。

### 泛型约束（如适用）

本函数未使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 支持的输入包括：
  - 十六进制颜色字符串（如 `'#FFFFFF'`、`'#000000'`）
  - CSS 颜色字符串（如 `'yellow'`、`'hsl(0, 0%, 0%)'`）
  - 兼容 culori 的颜色对象（如 `{ mode: 'rgb', r: 0, g: 0, b: 0 }`）
- 当输入为空字符串、`null`、`undefined` 或结构不正确的对象时，均视为无效输入并返回 `null`。

### 错误处理

- 内部首先尝试解析颜色；如果解析失败，则直接返回 `null`。
- 当解析成功但转换为 OKLCH 格式时抛出错误（例如颜色对象 `mode` 字段为不支持的值）时，会捕获异常并返回 `null`。
- 函数本身不会向外抛出异常，调用方只需根据返回值为 `true` / `false` / `null` 做分支处理。

### 性能考虑

- **时间复杂度**: O(1) —— 每次调用只进行一次解析与一次转换。
- **空间复杂度**: O(1) —— 仅创建少量中间颜色对象。
- **优化建议**:
  - 对同一颜色进行多次明暗判断时，可在业务逻辑中缓存结果，避免重复解析和转换。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/analysis/is-dark/index.ts)
