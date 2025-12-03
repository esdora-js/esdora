---
title: analyzeTimeRange
description: "analyzeTimeRange - Dora Pocket 中 @esdora/date 库提供的日期便利工具函数，用于分析时间点相对于时间区间的位置与差值。"
---

# analyzeTimeRange

分析一个给定的时间点，判断其在某个时间区间之前、之内还是之后，并给出与最近边界的毫秒差值。

## 示例

### 基本用法

```typescript
import { analyzeTimeRange } from '@esdora/date'

const startTime = '2024-10-10T10:00:00.000Z'
const endTime = '2024-10-20T10:00:00.000Z'

// 目标时间在区间内（闭区间）
analyzeTimeRange('2024-10-10T10:00:00.000Z', startTime, endTime)
// => { status: 'inRange', distance: 0 }

// 目标时间在区间之前
analyzeTimeRange('2024-10-09T10:00:00.000Z', startTime, endTime)
// => { status: 'before', distance: 86_400_000 } // 距离开始时间 24 小时

// 目标时间在区间之后
analyzeTimeRange('2024-10-21T10:00:00.000Z', startTime, endTime)
// => { status: 'after', distance: 86_400_000 } // 距离结束时间 24 小时
```

### 支持多种输入格式（字符串 / 时间戳 / Date 对象）

```typescript
import { analyzeTimeRange } from '@esdora/date'

const startTimeAsDate = new Date('2025-03-01T00:00:00.000Z')
const endTimeAsTimestamp = new Date('2025-03-10T23:59:59.999Z').getTime()

// 目标时间是没有时区标记的日期时间字符串
const targetTimeStr = '2025-02-28 23:59:59'

analyzeTimeRange(targetTimeStr, startTimeAsDate, endTimeAsTimestamp)
// => { status: 'before', distance: /* 正的毫秒差值，单位为毫秒 */ }
```

### 动态当前时间区间检测

```typescript
import { analyzeTimeRange } from '@esdora/date'

const now = Date.now()
const start = now - 10_000 // 10 秒前
const end = now + 10_000 // 10 秒后

analyzeTimeRange(now, start, end)
// => { status: 'inRange', distance: 0 }
```

## 签名与说明

### 类型签名

```typescript
export function analyzeTimeRange(
  time: string | number | Date,
  startTime: string | number | Date,
  endTime: string | number | Date,
): { status: 'before' | 'inRange' | 'after', distance: number } | null
```

### 参数说明

| 参数        | 类型                       | 描述                                                    | 必需 |
| ----------- | -------------------------- | ------------------------------------------------------- | ---- |
| `time`      | `string \| number \| Date` | 要分析的目标时间点，支持日期字符串、时间戳、`Date` 对象 | 是   |
| `startTime` | `string \| number \| Date` | 区间开始时间，支持与 `time` 相同的多种输入格式          | 是   |
| `endTime`   | `string \| number \| Date` | 区间结束时间，支持与 `time` 相同的多种输入格式          | 是   |

### 返回值

- **类型**: `{ status: 'before' \| 'inRange' \| 'after'; distance: number } \| null`
- **说明**:
  - 当输入合法且区间有效时，返回一个对象：
    - `status`: 表示目标时间与时间区间的相对位置：
      - `'before'`: 在区间开始时间之前
      - `'inRange'`: 在区间内部或刚好位于边界（闭区间）
      - `'after'`: 在区间结束时间之后
    - `distance`: 与最近的区间边界之间的毫秒差值，始终为非负数。
  - 当任一输入时间无效，或 `startTime > endTime` 时，返回 `null` 表示无法进行有效分析。

### 泛型约束（如适用）

本函数未使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 时间区间是**闭区间**，包含 `startTime` 和 `endTime` 本身；当目标时间恰好等于开始或结束时间时，`status` 为 `'inRange'`，`distance` 为 `0`。
- 函数会使用 `date-fns` 将字符串、时间戳和 `Date` 对象统一转换为 `Date` 实例；像 `'2025-02-07'`、`'2025-02-15 12:00:00'` 等常见格式都能被正确解析。
- `distance` 始终是目标时间与最近边界之间的**绝对差值**（毫秒），不会出现负数。

### 错误处理

- 当任一输入时间无法被解析为有效日期（例如 `'not-a-date'`、`new Date('invalid')`、`NaN` 等）时，函数返回 `null`，而不是抛出异常。
- 当 `startTime` 晚于 `endTime` 时，认为时间区间本身无效，函数同样返回 `null`。
- 对于无法解析的输入，调用方应在使用结果前检查返回值是否为 `null`，并在业务逻辑中进行相应分支处理。

### 性能考虑

- **时间复杂度**: O(1) —— 每次调用只进行常数次的日期解析与比较操作。
- **空间复杂度**: O(1) —— 仅创建少量 `Date` 实例和中间变量。
- **优化建议**: 在同一个高频计算场景中，如果多个调用共享同一时间区间（相同的 `startTime` 与 `endTime`），可以在业务层预先规范化这些时间（例如统一转换为 `Date` 或时间戳），减少重复解析开销。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/date/src/convenience/analyze-time-range/index.ts)
