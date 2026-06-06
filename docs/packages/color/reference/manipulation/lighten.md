---
title: lighten
description: "@esdora/color 的 lighten 函数，按比例将颜色变亮，获得符合视觉感知的效果。"
---

# lighten

按比例将颜色变亮，获得符合视觉感知的效果。支持使用数值比例或自定义亮度调整函数。

## 示例

### 基本用法

```typescript
import { lighten } from '@esdora/color'

lighten('#ff0000', 0.5) // => '#ff6954'
lighten('#0000ff', 0.3) // => '#1863ff'
lighten('#000000', 0.5) // => '#636363'
```

### 百分比值输入

当传入大于 1 的数值时，会自动将其视为百分比处理（如 `50` 表示 50%）。

```typescript
import { lighten } from '@esdora/color'

lighten('#00ff00', 50) // => '#42ff3b'（等效于传入 0.5）
```

### 多种颜色格式支持

支持 Hex、RGB、HSL 等多种颜色字符串格式，以及带透明度的颜色。

```typescript
import { lighten } from '@esdora/color'

lighten('rgb(255, 0, 0)', 0.3) // => '#ff4b3a'
lighten('hsl(240, 100%, 50%)', 0.3) // => '#1863ff'
lighten('rgba(255, 0, 0, 0.8)', 0.3) // => '#ff4b3acc'
lighten('#f00', 0.3) // => '#ff4b3a'
lighten('red', 0.3) // => '#ff4b3a'
```

### 使用自定义调整函数

传入函数以获得完全的控制权，函数接收当前亮度值 `l`（范围 0-1），返回新的亮度值。

```typescript
import { lighten } from '@esdora/color'

lighten('#ff0000', l => l + 0.3) // => '#ff937a'
lighten('#ff0000', () => 0.8) // => '#ff6450'
lighten('#808080', l => Math.min(1, l * 1.5)) // => '#dedede'
```

### 边界情况

```typescript
import { lighten } from '@esdora/color'

lighten('#ff0000', 0) // => '#ff0000'（无变化）
lighten('#ffffff', 0.5) // => '#ffffff'（白色无法再变亮）
lighten('#f0f0f0', 0.5) // => '#f7f7f7'（接近白色的颜色）
```

### 无效输入处理

当传入无法解析的颜色时，函数返回 `null` 而非抛出异常。

```typescript
import { lighten } from '@esdora/color'

lighten('invalid-color', 0.5) // => null
lighten('', 0.5) // => null
lighten(null as any, 0.5) // => null
lighten(undefined as any, 0.5) // => null
```

### 透明度处理

当输入颜色包含 Alpha 通道时，透明度保持不变，返回 8 位 Hex 字符串。

```typescript
import { lighten } from '@esdora/color'

lighten('rgba(255, 0, 0, 0.5)', 0.3) // => '#ff4b3a80'
lighten('rgba(255, 0, 0, 0)', 0.5) // => '#ff695400'
lighten('rgba(255, 0, 0, 1)', 0.3) // => '#ff4b3a'（透明度为 1 时返回 6 位 Hex）
```

## 签名

```typescript
function lighten(color: string | EsdoraColor, amount: number): string | null
function lighten(color: string | EsdoraColor, adjuster: LightnessAdjuster): string | null
```

## 参数

| 参数       | 类型                    | 描述                                                                                            | 必需                       |
| ---------- | ----------------------- | ----------------------------------------------------------------------------------------------- | -------------------------- |
| `color`    | `string \| EsdoraColor` | 要操作的颜色，支持 Hex、RGB、HSL 等字符串格式，或 EsdoraColor 对象                              | 是                         |
| `amount`   | `number`                | 变亮比例。`0` 表示不变，`1` 表示完全变亮。大于 1 的值会被当作百分比处理（如 `50` 等效于 `0.5`） | 是（与 `adjuster` 二选一） |
| `adjuster` | `LightnessAdjuster`     | 自定义亮度调整函数，接收当前亮度 `l`（0-1），返回新的亮度值                                     | 是（与 `amount` 二选一）   |

### LightnessAdjuster

```typescript
type LightnessAdjuster = (currentLightness: number) => number
```

## 返回值

- **类型**: `string | null`
- **说明**: 返回一个十六进制颜色字符串。如果输入颜色包含 Alpha 通道（透明度不为 1），则返回 8 位小写的 Hex 字符串（如 `#ff4b3acc`）；否则返回 6 位 Hex 字符串（如 `#ff6954`）。
- **特殊情况**:
  - 当输入颜色无法解析时，返回 `null`
  - 当 `amount` 为 `0` 时，返回原色的 Hex 表示
  - 当输入已经是白色（`'#ffffff'`）时，任何 `amount` 都返回 `'#ffffff'`
  - 自定义 `adjuster` 返回负值时，亮度会被限制为 `0`；返回值超过 `1` 时会被限制为 `1`

## 注意事项

### 输入边界

- `amount` 为 `0` 时颜色保持不变
- `amount` 大于 `1` 时会被自动除以 `100` 进行百分比归一化
- `amount` 为负数时，亮度会被减小（相当于变暗），但建议使用 `darken` 函数实现变暗效果
- 自定义 `adjuster` 函数返回的值会被内部 `clamp` 到 `[0, 1]` 范围

### 错误处理

- 不会抛出异常。所有无效输入（非法颜色字符串、`null`、`undefined`、空字符串）均返回 `null`
- 内部依赖 `parseColor` 和 `oklch` 转换，任何解析或转换失败都会安全地返回 `null`

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/manipulation/lighten/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/manipulation/lighten/index.test.ts)
