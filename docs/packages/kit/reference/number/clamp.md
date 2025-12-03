---
title: clamp
description: "clamp - Dora Pocket 中 @esdora/kit 库提供的数值范围工具函数，用于将数字限制在指定的最小值和最大值之间。"
---

# clamp

将一个数字限制在指定的最小值和最大值之间（包含边界），在 UI 控件、动画进度、百分比计算等场景中提供简单可靠的范围约束。

## 示例

### 基本用法：限制数字在给定区间

```typescript
import { clamp } from '@esdora/kit'

// 数字在范围内，返回自身
clamp(5, 0, 10)
// => 5

// 数字小于最小值，返回最小值
clamp(-5, 0, 10)
// => 0

// 数字大于最大值，返回最大值
clamp(15, 0, 10)
// => 10
```

### 使用默认范围 [0, 1]

```typescript
import { clamp } from '@esdora/kit'

// 在默认范围 [0, 1] 内
clamp(0.5)
// => 0.5

// 超过默认范围 [0, 1]，会被限制在边界
clamp(1.5)
// => 1

clamp(-0.5)
// => 0
```

### 健壮处理参数顺序与特殊数值

```typescript
import { clamp } from '@esdora/kit'

// 即使 min 和 max 写反，也能得到正确结果
clamp(5, 10, 0)
// => 5

// 处理无穷大
clamp(Infinity, 0, 10)
// => 10
clamp(-Infinity, 0, 10)
// => 0

// 处理极小和极大值
clamp(Number.EPSILON, 0, 1)
// => Number.EPSILON
clamp(Number.MAX_VALUE, 0, 1)
// => 1
```

## 签名与说明

### 类型签名

```typescript
export function clamp(number: number, min: number = 0, max: number = 1): number
```

### 参数说明

| 参数   | 类型     | 描述                             | 必需 |
| ------ | -------- | -------------------------------- | ---- |
| number | `number` | 需要被限制范围的原始数值         | 是   |
| min    | `number` | 范围下限（最小值），默认值为 `0` | 否   |
| max    | `number` | 范围上限（最大值），默认值为 `1` | 否   |

### 返回值

- **类型**: `number`
- **说明**:
  - 当 `number` 在 `[min, max]` 区间内时，直接返回该值
  - 当 `number` 小于 `min` 时，返回 `min`
  - 当 `number` 大于 `max` 时，返回 `max`
- **特殊情况**:
  - 当 `min > max` 时，函数会自动交换两者，使其等价于 `clamp(number, Math.min(min, max), Math.max(min, max))`
  - 当任一参数为 `NaN` 时，返回值为 `NaN`

### 泛型约束（如适用）

本函数未使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 支持所有合法的 JavaScript 数值，包括整数、小数、负数以及 `Infinity`、`-Infinity`。
- 当只传入一个参数时，等价于在默认范围 `[0, 1]` 上进行限制：
  - `clamp(x)` 等价于 `clamp(x, 0, 1)`
- 当只传入两个参数时，第三个参数 `max` 使用默认值 `1`：
  - `clamp(x, min)` 等价于 `clamp(x, min, 1)`
- 当 `min === max` 时，返回值恒为该固定边界。

### 错误处理

- 函数内部不主动抛出异常，对各种数值情况都进行直接计算。
- 对于 `NaN`：
  - 如果 `number`、`min` 或 `max` 中任意一个为 `NaN`，最终结果也为 `NaN`。
- 对于无穷大：
  - 当 `number` 为 `Infinity` 或 `-Infinity` 时，会被限制到对应边界值。

### 性能考虑

- **时间复杂度**: O(1)，仅进行常数次比较和 `Math.min`/`Math.max` 运算。
- **空间复杂度**: O(1)，只创建少量局部变量，不分配额外数据结构。
- **优化建议**:
  - 适合在高频调用场景中使用，如动画帧更新、滚动计算、音量/进度条更新等。
  - 相比手写多重分支判断，`clamp` 在可读性更好的同时，不会带来明显的性能损失。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/number/clamp/index.ts)
