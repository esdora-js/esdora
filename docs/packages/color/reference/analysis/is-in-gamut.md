---
title: isInGamut
description: isInGamut - 来自 Dora Pocket 的颜色“道具”，用于检查一个颜色是否在指定的色域（如 sRGB 或 Display P3）范围内。
---

# isInGamut

检查一个颜色是否在指定的色域（如 sRGB 或 Display P3）范围内，并返回该颜色是否可以在目标色域中被准确表示。

## 示例

### 基本用法

```typescript
import { isInGamut } from '@esdora/color'

// 默认检查 sRGB 色域
isInGamut('#FF0000') // => true

// 显式指定 RGB 色域
isInGamut('#00FF00', 'rgb') // => true
```

### 检查 P3 色域

```typescript
import { isInGamut } from '@esdora/color'

// 标准 sRGB 红色在 P3 色域内
isInGamut('#FF0000', 'p3') // => true

// 标准 sRGB 蓝色在 P3 色域外
isInGamut('#0000FF', 'p3') // => false
```

### 支持多种颜色格式与无效输入

```typescript
import { isInGamut } from '@esdora/color'

// 直接传入 RGB 对象
isInGamut({ r: 255, g: 0, b: 0 } as any) // => true

// 传入 HSL 字符串
isInGamut('hsl(0, 100%, 50%)') // => true

// 传入 culori 颜色对象
isInGamut({ mode: 'rgb', r: 1, g: 0, b: 0 }) // => true

// 无效输入返回 null，而不是抛出异常
isInGamut('invalid-color') // => null
```

## 签名与说明

### 类型签名

```typescript
/**
 * 检查一个颜色是否在指定的色域范围内。
 *
 * @param color 要检查的颜色字符串（如 'red', '#FF0000', 'rgb(255,0,0)'）或颜色对象
 * @param gamut 目标色域，支持 'rgb' 和 'p3'，默认为 'rgb'
 * @returns 如果颜色在指定色域内，则返回 `true`；如果超出色域，则返回 `false`；如果输入无效，则返回 `null`
 */
export function isInGamut(color: string | EsdoraColor, gamut: 'rgb' | 'p3' = 'rgb'): boolean | null
```

### 参数说明

| 参数  | 类型                    | 描述                                                                               | 必需 |
| ----- | ----------------------- | ---------------------------------------------------------------------------------- | ---- |
| color | `string \| EsdoraColor` | 要检查的颜色，可以是 CSS 颜色字符串（HEX、RGB、HSL 等）或 `EsdoraColor` 颜色对象。 | 是   |
| gamut | `'rgb' \| 'p3'`         | 目标色域标识：`'rgb'` 表示 sRGB，`'p3'` 表示 Display P3，默认为 `'rgb'`。          | 否   |

### 返回值

- **类型**: `boolean \| null`
- **说明**: 当颜色能在目标色域内准确表示时返回 `true`，超出色域范围时返回 `false`。
- **特殊情况**: 当输入颜色无法被解析或色域检查发生内部错误时，返回 `null`，用于显式表示检查失败。

### 泛型约束（如适用）

- 本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 当 `color` 是合法的 CSS 颜色字符串（HEX、RGB、HSL 等）或 `EsdoraColor` 对象时，才会参与色域计算。
- 当 `color` 参数为无效的颜色字符串（如 `'invalid-color'`、空字符串）、`null`、`undefined` 或无法解析的任意对象时，函数会返回 `null`。
- 当 `gamut` 传入 `'rgb'` 或 `'p3'` 之外的值时，底层 `culori` 调用可能抛出异常，但本函数会进行捕获并返回 `null`。

### 错误处理

- 函数内部使用 `try/catch` 包裹对 `culori.inGamut` 的调用，确保不会向外抛出异常。
- 对于格式正确但色彩模式无效的颜色对象（例如拥有未知 `mode` 字段的对象），函数会返回 `null`，而不是抛出运行时错误。

### 性能考虑

- **时间复杂度**: O(1) - 每次调用只进行一次颜色解析和一次色域检查。
- **空间复杂度**: O(1) - 只创建少量临时对象用于解析和检查。
- **优化建议**: 可以安全地在高频渲染或交互逻辑中调用；如需批量检查大量颜色，建议在业务层缓存解析好的颜色对象以减少重复解析开销。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/analysis/is-in-gamut/index.ts)
