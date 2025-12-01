---
title: lighten
description: "lighten - Dora Pocket 中 @esdora/color 提供的颜色调整工具函数，用于按比例将颜色变亮或通过自定义函数提升亮度。"
---

# lighten

按比例将颜色变亮，或使用自定义函数精确控制亮度提升，适合创建 hover、高亮等视觉强调效果。

## 示例

### 基本用法

```typescript
import { lighten } from '@esdora/color'

// 将颜色变亮 50%
lighten('#ff0000', 0.5) // => '#ff6954'

// 使用 0-100 的百分比数值
lighten('#00ff00', 50) // => '#42ff3b'

// 当 amount = 0 时，返回原始颜色
lighten('#ff0000', 0) // => '#ff0000'
```

### 使用函数进行高级调整

```typescript
import { lighten } from '@esdora/color'

// 使用自定义函数，将当前亮度值 (l) 增加 0.3
lighten('#ff0000', l => l + 0.3) // => '#ff937a'

// 将亮度设置为固定值
lighten('#ff0000', () => 0.8) // => '#ff6450'

// 在复杂场景中根据当前亮度进行非线性调整
lighten('#808080', l => Math.min(1, l * 1.5)) // => '#dedede'
```

### 处理不同格式与透明度

```typescript
import { lighten } from '@esdora/color'

// 支持多种颜色字符串格式
lighten('rgb(255, 0, 0)', 0.3) // => '#ff4b3a'
lighten('hsl(240, 100%, 50%)', 0.3) // => '#1863ff'
lighten('#f00', 0.3) // => '#ff4b3a'
lighten('red', 0.3) // => '#ff4b3a'

// 处理带透明度的颜色，输出包含 Alpha 通道的 8 位 Hex
lighten('rgba(255, 0, 0, 0.8)', 0.3) // => '#ff4b3acc'
lighten('rgba(255, 0, 0, 0.5)', 0.3) // => '#ff4b3a80'
```

## 签名与说明

### 类型签名

```typescript
import type { EsdoraColor, LightnessAdjuster } from '@esdora/color'

/** 按比例将颜色变亮，获得符合视觉感知的效果。 */
export function lighten(color: string | EsdoraColor, amount: number): string | null

/** 使用自定义函数来调整颜色亮度，以实现变亮效果。 */
export function lighten(color: string | EsdoraColor, adjuster: LightnessAdjuster): string | null
```

### 参数说明

| 参数       | 类型                                          | 描述                                                                                             | 必需 |
| ---------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---- |
| `color`    | `string \| EsdoraColor`                       | 要操作的颜色，可以是 HEX/RGB/HSL/颜色名称等字符串，或符合 Culori 规范的 `EsdoraColor` 对象。     | 是   |
| `amount`   | `number`                                      | 变亮比例，`0-1` 表示直接比例（如 `0.2` 为变亮 20%），大于 `1` 时按百分比解释（如 `20` 为 20%）。 | 否   |
| `adjuster` | `LightnessAdjuster` (`(l: number) => number`) | 自定义亮度调整函数，接收当前亮度 `l ∈ [0,1]`，返回新的亮度值，内部会自动裁剪到 `[0,1]`。         | 否   |

> `amount` 与 `adjuster` 二选一：当第二个参数是函数时按 `adjuster` 解释，否则按 `amount` 解释。

### 返回值

- **类型**: `string | null`
- **说明**:
  - 当输入为合法颜色且转换成功时，返回变亮后的十六进制颜色字符串。
  - 当输入颜色包含透明度且最终透明度不为 1 时，返回 8 位十六进制字符串（`#rrggbbaa`）；否则返回 6 位十六进制字符串（`#rrggbb`）。
- **特殊情况**:
  - 当输入颜色无法解析、颜色空间转换失败或内部解析遇到异常时，返回 `null`。
  - 对已经非常接近白色的颜色，变亮效果会逐渐减弱，最终趋近于白色。

### 泛型约束（如适用）

本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 当 `amount = 0` 时，函数返回原始颜色（例如 `lighten('#ff0000', 0)` 返回 `'#ff0000'`）。
- 当 `amount` 为 `0-1` 的小数时，表示直接的亮度提升比例；当 `amount > 1` 时被视作百分比（如 `50` 被当作 `0.5` 处理），方便与设计稿中的“百分比”记法对齐。
- 对黑色（如 `'#000000'`）应用 `lighten` 会得到较亮的灰色（测试中 `lighten('#000000', 0.5)` 返回 `'#636363'`）。
- 对白色（如 `'#ffffff'`）或非常接近白色的颜色应用 `lighten`，结果会保持白色或接近白色（如 `lighten('#ffffff', 0.5)` 返回 `'#ffffff'`）。
- 支持多种输入格式：短/长 HEX、`rgb(...)`、`hsl(...)`、`rgba(...)`、颜色名称（如 `'red'`）等，只要能被内部解析器识别。

### 错误处理

- 当 `color` 为无效颜色字符串、空字符串、`null` 或 `undefined` 时，函数返回 `null` 而不是抛出异常。
- 当使用自定义 `adjuster` 时，如果返回值小于 0 或大于 1，内部会通过 `clamp` 自动裁剪到 `[0,1]` 区间：
  - 返回负值（如 `-0.1`）会被限制为 `0`，测试中对应输出为 `'#100000'`。
  - 返回大于 `1` 的值（如 `1.5`）会被限制为 `1`，测试中对灰色 `'#808080'` 的输入结果为纯白色 `'#ffffff'`。
- `lighten` 内部依赖的 `adjustLightness` 在颜色空间转换阶段使用 `try/catch` 捕获底层库异常，转换失败时会返回 `null`。
- 调用方通常只需做空值检查即可，无需额外包裹 `try/catch`。

### 性能考虑

- **时间复杂度**: O(1) —— 每次调用只对单个颜色进行解析、转换和亮度调整。
- **空间复杂度**: O(1) —— 仅创建固定数量的中间颜色对象。
- **优化建议**:
  - 适合用于生成按钮 hover、高亮文本、卡片阴影等一整套“变亮态”颜色，可在主题构建阶段预先计算。
  - 若在大量循环或动画帧中频繁调用，建议对常用输入做结果缓存，避免重复解析和转换。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/manipulation/lighten/index.ts)
