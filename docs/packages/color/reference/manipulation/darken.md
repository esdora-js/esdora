---
title: darken
description: "darken - Dora Pocket 中 @esdora/color 提供的颜色调整工具函数，用于按比例将颜色变暗或通过自定义函数控制亮度降低。"
---

# darken

按比例将颜色变暗，或使用自定义函数精确控制亮度降低，获得更符合视觉感知的深色变体。

## 示例

### 基本用法

```typescript
import { darken } from '@esdora/color'

// 将颜色变暗 20%
darken('#3498db', 0.2) // => '#2980b9'

// 也可以使用 0-100 的百分比数值
darken('#3498db', 20) // => '#2980b9'

// 当 amount = 0 时，返回原始颜色
darken('#ff0000', 0) // => '#ff0000'
```

### 使用函数进行高级调整

```typescript
import { darken } from '@esdora/color'

// 使用自定义函数，将当前亮度值 (l) 减去 0.1
darken('#3498db', l => l - 0.1) // => '#2471a3'

// 也可以将亮度设置为一个固定的值
darken('#3498db', l => 0.3) // => '#1b4f72'
```

### 处理带透明度的颜色

```typescript
import { darken } from '@esdora/color'

// 如果输入颜色包含透明度，输出将是 8 位的十六进制格式
darken('rgba(255, 0, 0, 0.8)', 0.3) // => '#c00000cc'
```

## 签名与说明

### 类型签名

```typescript
import type { EsdoraColor, LightnessAdjuster } from '@esdora/color'

/** 按比例将颜色变暗，获得符合视觉感知的效果。 */
export function darken(color: string | EsdoraColor, amount: number): string | null

/** 使用自定义函数来调整颜色亮度，以实现变暗效果。 */
export function darken(color: string | EsdoraColor, adjuster: LightnessAdjuster): string | null
```

### 参数说明

| 参数       | 类型                                          | 描述                                                                                             | 必需 |
| ---------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---- |
| `color`    | `string \| EsdoraColor`                       | 要操作的颜色，可以是 HEX/RGB/HSL 等字符串，或符合 Culori 规范的 `EsdoraColor` 对象。             | 是   |
| `amount`   | `number`                                      | 变暗比例，`0-1` 表示直接比例（如 `0.2` 为变暗 20%），大于 `1` 时按百分比解释（如 `20` 为 20%）。 | 否   |
| `adjuster` | `LightnessAdjuster` (`(l: number) => number`) | 自定义亮度调整函数，接收当前亮度 `l ∈ [0,1]`，返回新的亮度值，内部会自动裁剪到 `[0,1]`。         | 否   |

> `amount` 与 `adjuster` 二选一：当第二个参数是函数时按 `adjuster` 解释，否则按 `amount` 解释。

### 返回值

- **类型**: `string | null`
- **说明**:
  - 当输入为合法颜色且转换成功时，返回变暗后的十六进制颜色字符串。
  - 对带透明度的输入，返回 8 位十六进制字符串（`#rrggbbaa`）；否则返回 6 位十六进制字符串（`#rrggbb`）。
- **特殊情况**:
  - 当输入颜色无法解析、颜色空间转换失败或内部解析遇到异常时，返回 `null`。
  - 变暗操作不会改变输入颜色的色相，只对亮度通道进行缩放。

### 泛型约束（如适用）

本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 当 `amount = 0` 时，函数返回原始颜色（例如 `darken('#ff0000', 0)` 返回 `'#ff0000'`）。
- 当 `amount = 1` 时，白色会被完全压暗为黑色（例如 `darken('#ffffff', 1)` 返回 `'#000000'`）。
- 当 `amount > 1` 时会被视作百分比值（如 `50` 被当作 `0.5` 处理），适合与设计稿中的“百分比”记法对齐。
- 对已经是黑色的颜色（如 `'#000000'`）进行变暗，不会再进一步改变颜色，始终保持为黑色。
- 支持多种输入格式：HEX（短/长）、`rgb(...)`、`hsl(...)`、`rgba(...)` 等，只要能被内部解析器识别。

### 错误处理

- 当 `color` 为无效颜色字符串、空字符串、`null` 或 `undefined` 时，内部解析会失败，函数返回 `null` 而不是抛出异常。
- `darken` 内部依赖的 `adjustLightness` 在颜色空间转换阶段使用 `try/catch` 捕获底层库异常，转换失败时会返回 `null`。
- 调用方只需根据返回值是否为 `null` 来判断成功与否，无需额外包裹 `try/catch`。

### 性能考虑

- **时间复杂度**: O(1) —— 每次调用只对单个颜色进行解析、转换和亮度调整。
- **空间复杂度**: O(1) —— 创建的中间颜色对象数量固定。
- **优化建议**:
  - 适合用作 UI 状态色处理（如 hover、active、阴影色），可在渲染前预先计算，避免在动画帧中频繁调用。
  - 如果需要对大量颜色批量变暗，建议在业务层对结果做缓存（例如以基础颜色 + amount 作为 key）。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/manipulation/darken/index.ts)
