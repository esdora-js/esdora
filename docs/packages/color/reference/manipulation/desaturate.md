---
title: desaturate
description: "desaturate - Dora Pocket 中 @esdora/color 提供的颜色调整工具函数，用于按比例将颜色去饱和化并生成更灰度化的效果。"
---

# desaturate

按比例降低颜色的饱和度，或使用自定义函数精确控制去饱和效果，用于创建更加柔和、灰度化或禁用状态的颜色。

## 示例

### 基本用法

```typescript
import { desaturate } from '@esdora/color'

// 将颜色的饱和度降低 20%
desaturate('#3498db', 0.2) // => '#4595ca'

// 也可以使用 0-100 的百分比数值
desaturate('#3498db', 20) // => '#4595ca'

// 完全去饱和（灰度化）
desaturate('#ff0000', 1) // => '#808080'
```

### 使用函数进行高级调整

```typescript
import { desaturate } from '@esdora/color'

// 使用自定义函数，将当前饱和度值 (s) 减去 0.3
desaturate('#ff0000', s => s - 0.3) // => '#d92626'

// 将饱和度设置为一个固定的值
desaturate('#ff0000', () => 0.5) // => '#bf4040'

// 使用更复杂的函数：在保证不小于 0 的前提下乘以 0.7
desaturate('#00ff00', s => Math.max(0, s * 0.7)) // => '#26d926'
```

### 处理不同格式与透明度

```typescript
import { desaturate } from '@esdora/color'

// 支持 RGB 字符串
desaturate('rgb(255, 0, 0)', 0.3) // => '#d92626'

// 支持 HSL 字符串
desaturate('hsl(120, 100%, 50%)', 0.3) // => '#26d926'

// 处理带透明度的颜色，输出包含 Alpha 通道的 8 位 Hex
desaturate('rgba(255, 0, 0, 0.8)', 0.3) // => '#d92626cc'
```

## 签名与说明

### 类型签名

```typescript
import type { EsdoraColor, SaturationAdjuster } from '@esdora/color'

/** 按比例将颜色去饱和化，获得符合视觉感知的效果。 */
export function desaturate(color: string | EsdoraColor, amount: number): string | null

/** 使用自定义函数来调整颜色饱和度，以实现去饱和化效果。 */
export function desaturate(color: string | EsdoraColor, adjuster: SaturationAdjuster): string | null
```

### 参数说明

| 参数       | 类型                                           | 描述                                                                                                 | 必需 |
| ---------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---- |
| `color`    | `string \| EsdoraColor`                        | 要操作的颜色，可以是 HEX/RGB/HSL/颜色名称等字符串，或符合 Culori 规范的 `EsdoraColor` 对象。         | 是   |
| `amount`   | `number`                                       | 去饱和化比例，`0-1` 表示直接比例（如 `0.2` 为降低 20%），大于 `1` 时按百分比解释（如 `20` 为 20%）。 | 否   |
| `adjuster` | `SaturationAdjuster` (`(s: number) => number`) | 自定义饱和度调整函数，接收当前饱和度 `s ∈ [0,1]`，返回新的饱和度值，内部会自动裁剪到 `[0,1]`。       | 否   |

> `amount` 与 `adjuster` 二选一：当第二个参数是函数时按 `adjuster` 解释，否则按 `amount` 解释。

### 返回值

- **类型**: `string | null`
- **说明**:
  - 当输入为合法颜色且转换成功时，返回去饱和化后的十六进制颜色字符串。
  - 当输入颜色包含透明度且最终透明度不为 1 时，返回 8 位十六进制字符串（`#rrggbbaa`）；否则返回 6 位十六进制字符串（`#rrggbb`）。
- **特殊情况**:
  - 当输入颜色无法解析、颜色空间转换失败或内部解析遇到异常时，返回 `null`。
  - 对本身已经是灰度的颜色（如 `'#808080'`、`'#ffffff'`、`'#000000'`），去饱和化后结果与原色相同。

### 泛型约束（如适用）

本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 当 `amount = 0` 时，函数返回原始颜色（例如 `desaturate('#ff0000', 0)` 返回 `'#ff0000'`）。
- 当 `amount = 1` 或等价的百分比 `100` 时，颜色会被完全去饱和化并趋向纯灰（例如 `desaturate('#ff0000', 1)` 返回 `'#808080'`）。
- 当 `amount > 1` 时被视作百分比值（如 `50` 被当作 `0.5` 处理），与设计稿中的百分比写法兼容。
- 对已经是灰度的颜色（如 `'#808080'`）进行去饱和化，结果保持不变（测试中 `desaturate('#808080', 0.5)` 仍返回 `'#808080'`）。
- 支持多种输入格式：短/长 HEX、`rgb(...)`、`hsl(...)`、带透明度的 `rgba(...)`、颜色名称（如 `'red'`）等。

### 错误处理

- 当 `color` 为无效颜色字符串、空字符串、`null` 或 `undefined` 时，函数返回 `null` 而不是抛出异常。
- 当使用自定义 `adjuster` 时，如果返回值小于 0 或大于 1，内部会通过 `clamp` 自动裁剪到 `[0,1]` 区间：
  - 返回负值（如 `-0.1`）会被限制为 `0`，等价于完全去饱和。
  - 返回大于 `1` 的值（如 `1.5`）会被限制为 `1`，等价于使用最大饱和度。
- `desaturate` 内部依赖的 `adjustSaturation` 在颜色空间转换阶段使用 `try/catch` 捕获底层库异常，转换失败时会返回 `null`。
- 调用方通常只需做空值检查即可，无需额外包裹 `try/catch`。

### 性能考虑

- **时间复杂度**: O(1) —— 每次调用只对单个颜色进行解析、转换和饱和度调整。
- **空间复杂度**: O(1) —— 仅创建固定数量的中间颜色对象。
- **优化建议**:
  - 适合用于批量生成禁用态颜色、灰度主题或视觉弱化效果，可以在主题构建阶段预先计算。
  - 若在大量循环中频繁调用，建议对常用输入做结果缓存，避免重复解析和转换。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/manipulation/desaturate/index.ts)
