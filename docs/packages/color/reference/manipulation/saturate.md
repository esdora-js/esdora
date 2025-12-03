---
title: saturate
description: "saturate - Dora Pocket 中 @esdora/color 提供的颜色调整工具函数，用于按比例增加颜色饱和度或通过自定义函数控制饱和化效果。"
---

# saturate

按比例增加颜色的饱和度，或使用自定义函数精确控制饱和化效果，适合增强主题色、从灰度生成彩色等场景。

## 示例

### 基本用法

```typescript
import { saturate } from '@esdora/color'

// 将颜色的饱和度增加 50%
saturate('#bf4040', 0.5) // => '#df2020'

// 使用 0-100 的百分比数值
saturate('#bf4040', 50) // => '#df2020'

// 当 amount = 0 时，返回原始颜色
saturate('#bf4040', 0) // => '#bf4040'
```

### 为灰度颜色添加色彩

```typescript
import { saturate } from '@esdora/color'

// 对灰色进行饱和化会为其添加色彩（通常是红色调）
saturate('#808080', 0.3) // => '#a65a5a'
saturate('#808080', 0.5) // => '#c04141'

// 从灰度创建更鲜艳的颜色
const grayColor = '#808080'
const colorful = saturate(grayColor, 0.8) // => '#e61a1a'
```

### 使用函数进行高级调整与透明度处理

```typescript
import { saturate } from '@esdora/color'

// 使用自定义函数，将当前饱和度值 (s) 增加 0.3
saturate('#bf4040', s => s + 0.3) // => '#e51a1a'

// 将饱和度设置为固定值
saturate('#bf4040', () => 1.0) // => '#ff0000'

// 处理带透明度的颜色，输出包含 Alpha 通道的 8 位 Hex
saturate('rgba(191, 64, 64, 0.8)', 0.3) // => '#d22d2dcc'
saturate('rgba(191, 64, 64, 0.5)', 0.3) // => '#d22d2d80'
```

## 签名与说明

### 类型签名

```typescript
import type { EsdoraColor, SaturationAdjuster } from '@esdora/color'

/** 按比例将颜色饱和化，获得符合视觉感知的效果。 */
export function saturate(color: string | EsdoraColor, amount: number): string | null

/** 使用自定义函数来调整颜色饱和度，以实现饱和化效果。 */
export function saturate(color: string | EsdoraColor, adjuster: SaturationAdjuster): string | null
```

### 参数说明

| 参数       | 类型                                           | 描述                                                                                               | 必需 |
| ---------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---- |
| `color`    | `string \| EsdoraColor`                        | 要操作的颜色，可以是 HEX/RGB/HSL/颜色名称等字符串，或符合 Culori 规范的 `EsdoraColor` 对象。       | 是   |
| `amount`   | `number`                                       | 饱和化比例，`0-1` 表示直接比例（如 `0.2` 为增加 20%），大于 `1` 时按百分比解释（如 `20` 为 20%）。 | 否   |
| `adjuster` | `SaturationAdjuster` (`(s: number) => number`) | 自定义饱和度调整函数，接收当前饱和度 `s ∈ [0,1]`，返回新的饱和度值，内部会自动裁剪到 `[0,1]`。     | 否   |

> `amount` 与 `adjuster` 二选一：当第二个参数是函数时按 `adjuster` 解释，否则按 `amount` 解释。

### 返回值

- **类型**: `string | null`
- **说明**:
  - 当输入为合法颜色且转换成功时，返回饱和化后的十六进制颜色字符串。
  - 当输入颜色包含透明度且最终透明度不为 1 时，返回 8 位十六进制字符串（`#rrggbbaa`）；否则返回 6 位十六进制字符串（`#rrggbb`）。
- **特殊情况**:
  - 当输入颜色无法解析、颜色空间转换失败或内部解析遇到异常时，返回 `null`。
  - 对已经是完全饱和的颜色（如 `'#ff0000'`）应用 `saturate`，结果保持不变。
  - 对本身没有色相的颜色（如纯白 `'#ffffff'`、纯黑 `'#000000'`），饱和化操作不会改变颜色。

### 泛型约束（如适用）

本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 当 `amount = 0` 时，函数返回原始颜色（例如 `saturate('#bf4040', 0)` 返回 `'#bf4040'`）。
- 当 `amount = 1` 或等价的百分比 `100` 时，颜色会被完全饱和化（例如 `saturate('#bf4040', 1)` 返回 `'#ff0000'`）。
- 当 `amount > 1` 时被视作百分比值（如 `50` 被当作 `0.5` 处理），与设计稿中的百分比写法兼容。
- 对已经饱和的颜色（如 `'#ff0000'`）进行饱和化，结果保持不变。
- 对灰度颜色（如 `'#808080'`）进行饱和化，会向有色方向偏移并增加鲜艳度（测试中 `saturate('#808080', 0.3)` 返回 `'#a65a5a'`，`saturate('#808080', 0.8)` 返回 `'#e61a1a'`）。
- 支持多种输入格式：短/长 HEX、`rgb(...)`、`hsl(...)`、带透明度的 `rgba(...)`、颜色名称（如 `'red'`）等。

### 错误处理

- 当 `color` 为无效颜色字符串、空字符串、`null` 或 `undefined` 时，函数返回 `null` 而不是抛出异常。
- 当使用自定义 `adjuster` 时，如果返回值小于 0 或大于 1，内部会通过 `clamp` 自动裁剪到 `[0,1]` 区间：
  - 返回负值（如 `-0.1`）会被限制为 `0`，测试中 `saturate('#ff0000', () => -0.1)` 的结果为中性灰 `'#808080'`。
  - 返回大于 `1` 的值（如 `1.5`）会被限制为 `1`，测试中对灰色 `'#808080'` 的输入结果为高度饱和的红色 `'#ff0101'`。
- `saturate` 内部依赖的 `adjustSaturation` 在颜色空间转换阶段使用 `try/catch` 捕获底层库异常，转换失败时会返回 `null`。
- 调用方通常只需做空值检查即可，无需额外包裹 `try/catch`。

### 性能考虑

- **时间复杂度**: O(1) —— 每次调用只对单个颜色进行解析、转换和饱和度调整。
- **空间复杂度**: O(1) —— 仅创建固定数量的中间颜色对象。
- **优化建议**:
  - 适合用于生成一套从“柔和”到“鲜艳”的主题色、状态色（如 success/warning/error）的不同饱和度版本。
  - 若在大量循环或动画中频繁调用，建议按业务需求缓存常用输入的结果。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/manipulation/saturate/index.ts)
