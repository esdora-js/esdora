---
title: saturate
description: '@esdora/color 的 saturate 函数，按比例将颜色饱和化，获得符合视觉感知的效果。'
---

# saturate

按比例将颜色饱和化，获得符合视觉感知的效果。

## 示例

### 基本用法

```typescript
import { saturate } from '@esdora/color'

saturate('#bf4040', 0.5) // => '#df2020'
saturate('#808080', 0.3) // => '#a65a5a'
```

### 使用百分比值

当 `amount` 大于 1 时，函数会自动将其视为百分比值（除以 100）：

```typescript
import { saturate } from '@esdora/color'

saturate('#bf4040', 50) // => '#df2020' (等同于 0.5)
```

### 完全饱和与无变化

```typescript
import { saturate } from '@esdora/color'

saturate('#bf4040', 0) // => '#bf4040' (无变化)
saturate('#bf4040', 1) // => '#ff0000' (完全饱和)
saturate('#ff0000', 0.5) // => '#ff0000' (已饱和的颜色保持不变)
```

### 处理特殊颜色

```typescript
import { saturate } from '@esdora/color'

saturate('#ffffff', 0.5) // => '#ffffff' (白色保持不变)
saturate('#000000', 0.5) // => '#000000' (黑色保持不变)
saturate('#808080', 0.5) // => '#c04141' (灰色可被饱和化)
```

### 支持多种颜色格式

```typescript
import { saturate } from '@esdora/color'

saturate('rgb(191, 64, 64)', 0.3) // => '#d22d2d'
saturate('hsl(0, 50%, 50%)', 0.3) // => '#d22d2d'
saturate('rgba(191, 64, 64, 0.8)', 0.3) // => '#d22d2dcc' (返回 8 位 Hex)
saturate('#f00', 0.3) // => '#ff0000' (3 位 Hex 自动补全)
saturate('red', 0.3) // => '#ff0000' (颜色名称)
```

### 使用自定义调整函数

```typescript
import { saturate } from '@esdora/color'

// 将饱和度值固定增加 0.3
saturate('#bf4040', s => s + 0.3) // => '#e51a1a'

// 将饱和度设置为固定值
saturate('#bf4040', () => 1.0) // => '#ff0000'

// 增加饱和度但不超过 1
saturate('#808080', s => Math.min(1, s + 0.5)) // => '#c04141'
```

### 渐进式饱和效果

```typescript
import { saturate } from '@esdora/color'

const baseColor = '#bf4040'

saturate(baseColor, 0.25) // => '#cf3030'
saturate(baseColor, 0.5) // => '#df2020'
saturate(baseColor, 0.75) // => '#ef1010'
```

## 签名

```typescript
// 按比例饱和化
export function saturate(color: string | EsdoraColor, amount: number): string | null

// 使用自定义调整函数
export function saturate(color: string | EsdoraColor, adjuster: SaturationAdjuster): string | null
```

## 参数

| 参数       | 类型                    | 描述                                                                     | 必需                       |
| ---------- | ----------------------- | ------------------------------------------------------------------------ | -------------------------- |
| `color`    | `string \| EsdoraColor` | 要操作的颜色，支持字符串（Hex、RGB、HSL、颜色名称等）或 EsdoraColor 对象 | 是                         |
| `amount`   | `number`                | 饱和化比例（0 到 1）。大于 1 时自动视为百分比值（如 50 表示 50%）        | 是（与 `adjuster` 二选一） |
| `adjuster` | `SaturationAdjuster`    | 自定义饱和度调整函数，接收当前饱和度 `s`（0-1），返回新的饱和度值        | 是（与 `amount` 二选一）   |

### SaturationAdjuster

```typescript
type SaturationAdjuster = (s: number) => number
```

- 接收当前颜色的饱和度值 `s`（范围 0-1）
- 返回新的饱和度值（函数内部会对返回值进行 0-1 的裁剪）

## 返回值

- **类型**: `string | null`
- **说明**: 返回十六进制颜色字符串。如果输入颜色包含 Alpha 通道（透明度不为 1），返回 8 位小写 Hex 字符串（如 `#d22d2dcc`）；否则返回 6 位小写 Hex 字符串。
- **特殊情况**:
  - 输入为无效颜色时返回 `null`
  - 白色（`#ffffff`）和黑色（`#000000`）饱和化后保持不变
  - 已完全饱和的颜色（如 `#ff0000`）饱和化后保持不变

## 注意事项

### 输入边界

- `amount` 为 0 时颜色无变化
- `amount` 为 1 时颜色完全饱和
- `amount` 大于 1 时自动按百分比处理（如 50 等价于 0.5）
- 使用自定义 `adjuster` 时，返回值会被裁剪到 `[0, 1]` 范围内
- 负的 `adjuster` 返回值会被裁剪为 0，超过 1 的值会被裁剪为 1

### 错误处理

- 无效颜色字符串（如 `'invalid-color'`）、空字符串、`null` 或 `undefined` 输入时返回 `null`
- 函数不会抛出异常，所有错误通过返回 `null` 表达

### 性能考虑

- **时间复杂度**: O(1) — 单次颜色转换和饱和度调整
- **空间复杂度**: O(1) — 不涉及额外数据结构分配

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/manipulation/saturate/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/manipulation/saturate/index.test.ts)
