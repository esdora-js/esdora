---
title: clamp
description: clamp - 来自 Dora Pocket 的数学“道具”，用于将一个数字限制在指定的最小和最大值之间。
---

# clamp

<!-- 1. 简介：一句话核心功能描述 -->

将一个数字限制在指定的最小和最大值之间（包含边界）。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

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

### 使用默认值

如果不提供 `min` 和 `max` 参数，函数将默认使用 `[0, 1]` 的范围，这在处理百分比或动画进度时非常方便。

```typescript
// 在默认范围 [0, 1] 内
clamp(0.5)
// => 0.5

// 超过默认范围 [0, 1]
clamp(1.5)
// => 1

clamp(-0.5)
// => 0
```

### 健壮的参数顺序

即使 `min` 和 `max` 的顺序被意外颠倒，函数也能智能地处理，确保结果的正确性。

```typescript
// 正常顺序: clamp(5, 0, 10)
clamp(5, 0, 10)
// => 5

// 颠倒顺序: clamp(5, 10, 0)，函数内部会将其视为 (5, 0, 10)
clamp(5, 10, 0)
// => 5
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 将一个数字限制在指定的最小和最大值之间（包含边界）。
 *
 * @remarks
 * 这个函数确保一个数值不会超出指定的范围。如果数值小于最小值，则返回最小值；
 * 如果数值大于最大值，则返回最大值；否则，返回数值本身。
 * 这是一个在处理动画、UI 控件（如音量条）和任何需要数值范围约束的场景中都非常有用的工具。
 *
 * @param number - 需要被限制范围的数字。
 * @param min - 范围的下限（最小值）。
 * @param max - 范围的上限（最大值）。
 * @default
 * @default
 * @returns 返回在 [min, max] 范围内的数字。
 */
export function clamp(number: number, min?: number, max?: number): number
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于参数顺序**: 即便 `min` 参数大于 `max` 参数，函数内部也会自动纠正范围，确保逻辑的健壮性。例如 `clamp(5, 10, 0)` 等同于 `clamp(5, 0, 10)`。
- **关于默认值**: 如果只提供 `number` 参数，范围默认为 `[0, 1]`。如果只提供 `number` 和 `min`，则 `max` 默认为 `1`。
- **关于无穷大 (`Infinity`)**: `Infinity` 会被限制为范围的最大值，`-Infinity` 则会被限制为范围的最小值。
- **关于 `NaN`**: 如果 `number`、`min` 或 `max` 中任何一个是 `NaN`，函数的返回值也将是 `NaN`。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/kit/src/number/clamp/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/kit/src/number/clamp/index.ts) (链接由最终部署时填写)
