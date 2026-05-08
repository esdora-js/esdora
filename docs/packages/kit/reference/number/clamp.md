---
title: clamp
description: "@esdora/kit 的 clamp 函数，将一个数字限制在指定的最小和最大值之间（包含边界）。"
---

# clamp

将一个数字限制在指定的最小和最大值之间（包含边界）。

如果数值小于最小值，则返回最小值；如果数值大于最大值，则返回最大值；否则返回数值本身。

## 示例

### 基本用法

```typescript
import { clamp } from '@esdora/kit'

// 在范围内，返回原值
clamp(5, 0, 10) // => 5

// 低于最小值，返回最小值
clamp(-5, 0, 10) // => 0

// 高于最大值，返回最大值
clamp(15, 0, 10) // => 10
```

### 使用默认范围

```typescript
import { clamp } from '@esdora/kit'

// 默认范围 [0, 1]
clamp(0.5) // => 0.5
clamp(1.5) // => 1
clamp(-0.5) // => 0

// 只提供 min，max 默认为 1
clamp(0.5, 0.2) // => 0.5
clamp(1.5, 0.2) // => 1
```

### 边界与健壮性

```typescript
import { clamp } from '@esdora/kit'

// min 和 max 写反也能正确处理
clamp(5, 10, 0) // => 5

// min === max 时返回该值
clamp(5, 3, 3) // => 3

// 负数范围
clamp(-3, -10, -1) // => -3
clamp(0, -10, -1) // => -1
```

### 特殊数值

```typescript
import { clamp } from '@esdora/kit'

// NaN 传播
clamp(Number.NaN, 0, 10) // => NaN

// Infinity
clamp(Infinity, 0, 10) // => 10
clamp(-Infinity, 0, 10) // => 0

// 极大值
clamp(Number.MAX_VALUE, 0, 1) // => 1
```

### 实际场景

```typescript
import { clamp } from '@esdora/kit'

// 百分比限制
clamp(1.2, 0, 1) // => 1

// 音量控制
clamp(150, 0, 100) // => 100

// RGB 颜色值
clamp(300, 0, 255) // => 255
```

## 签名

```typescript
function clamp(number: number, min?: number, max?: number): number
```

## 参数

| 参数   | 类型     | 描述                             | 必需 |
| ------ | -------- | -------------------------------- | ---- |
| number | `number` | 需要被限制范围的数字             | 是   |
| min    | `number` | 范围的下限（最小值），默认为 `0` | 否   |
| max    | `number` | 范围的上限（最大值），默认为 `1` | 否   |

## 返回值

- **类型**: `number`
- **说明**: 返回在 `[min, max]` 范围内的数字。如果输入在范围内，返回原值；否则返回距离最近的边界值。
- **特殊情况**:
  - 当 `min` 和 `max` 写反时，函数会自动纠正顺序，结果不受影响
  - 当 `min === max` 时，无论输入什么值都返回该边界值
  - 当任一参数为 `NaN` 时，返回 `NaN`
  - 当 `number` 为 `Infinity` 或 `-Infinity` 时，按正常逻辑限制在边界内

## 注意事项

### 输入边界

- `min` 和 `max` 的默认值为 `0` 和 `1`，适用于百分比、进度等场景
- 支持负数范围，如 `clamp(-3, -10, -1)`
- 支持小数范围和极小范围
- 即使 `min > max`，函数也能健壮地处理，不会抛异常

### 错误处理

- 本函数**不抛出异常**
- 所有异常输入（如 `NaN`）通过 `Math.min` / `Math.max` 自然传播为 `NaN`
- 不会进行参数类型检查，传入非数字类型会依赖 JavaScript 的隐式类型转换行为

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/number/clamp/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/number/clamp/index.test.ts)
