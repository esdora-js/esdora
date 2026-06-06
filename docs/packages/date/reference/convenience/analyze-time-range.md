---
title: analyzeTimeRange
description: "@esdora/date 的 analyzeTimeRange 函数，分析目标时间相对于给定时间区间的位置关系并返回状态与距离。"
---

# analyzeTimeRange

分析目标时间相对于给定时间区间的位置关系，返回状态（`before` / `inRange` / `after`）与距离（毫秒）。

## 示例

### 基本用法

```typescript
import { analyzeTimeRange } from '@esdora/date'

// 目标时间在区间之前
analyzeTimeRange(
  '2024-10-09T10:00:00.000Z',
  '2024-10-10T10:00:00.000Z',
  '2024-10-20T10:00:00.000Z',
) // => { status: 'before', distance: 86400000 }

// 目标时间在区间之内
analyzeTimeRange(
  '2024-10-15T10:00:00.000Z',
  '2024-10-10T10:00:00.000Z',
  '2024-10-20T10:00:00.000Z',
) // => { status: 'inRange', distance: 0 }

// 目标时间在区间之后
analyzeTimeRange(
  '2024-10-21T10:00:00.000Z',
  '2024-10-10T10:00:00.000Z',
  '2024-10-20T10:00:00.000Z',
) // => { status: 'after', distance: 86400000 }
```

### 临界点判断

当目标时间恰好等于区间边界时，视为在区间内。

```typescript
import { analyzeTimeRange } from '@esdora/date'

// 目标时间等于开始时间
analyzeTimeRange(
  '2024-10-10T10:00:00.000Z',
  '2024-10-10T10:00:00.000Z',
  '2024-10-20T10:00:00.000Z',
) // => { status: 'inRange', distance: 0 }

// 目标时间等于结束时间
analyzeTimeRange(
  '2024-10-20T10:00:00.000Z',
  '2024-10-10T10:00:00.000Z',
  '2024-10-20T10:00:00.000Z',
) // => { status: 'inRange', distance: 0 }
```

### 混合输入格式

函数支持字符串、Date 对象和时间戳的任意组合。

```typescript
import { analyzeTimeRange } from '@esdora/date'

// 字符串 + Date 对象 + 时间戳混合
analyzeTimeRange(
  '2024-10-25T10:00:00.000Z',
  new Date('2024-10-10T10:00:00.000Z'),
  new Date('2024-10-20T10:00:00.000Z').getTime(),
) // => { status: 'after', distance: 432000000 }
```

## 签名

```typescript
function analyzeTimeRange(
  time: DateInput,
  startTime: DateInput,
  endTime: DateInput,
): TimeRangeAnalysis | null

type DateInput = string | number | Date

interface TimeRangeAnalysis {
  status: 'before' | 'inRange' | 'after'
  distance: number
}
```

## 参数

| 参数        | 类型                       | 描述               | 必需 |
| ----------- | -------------------------- | ------------------ | ---- |
| `time`      | `string \| number \| Date` | 要分析的目标时间点 | 是   |
| `startTime` | `string \| number \| Date` | 区间开始时间       | 是   |
| `endTime`   | `string \| number \| Date` | 区间结束时间       | 是   |

## 返回值

- **类型**: `TimeRangeAnalysis \| null`
- **说明**: 返回一个对象，包含目标时间相对于区间的状态（`before`、`inRange`、`after`）以及距离（毫秒）。当输入无效时返回 `null`。
- **特殊情况**:
  - 目标时间等于 `startTime` 或 `endTime` 时，返回 `{ status: 'inRange', distance: 0 }`
  - 任一输入为无效日期、或 `startTime > endTime` 时，返回 `null`
  - `distance` 始终为非负数

## 运行逻辑

```mermaid
flowchart TD
    A[输入 time, startTime, endTime] --> B[使用 toDate 转换为 Date 对象]
    B --> C{任一日期无效?}
    C -->|是| D[返回 null]
    C -->|否| E{startDate > endDate?}
    E -->|是| D
    E -->|否| F{time 在 [start, end] 区间内?}
    F -->|是| G[返回 {status: 'inRange', distance: 0}]
    F -->|否| H{time < startDate?}
    H -->|是| I[计算 startDate - time 的毫秒差<br/>返回 {status: 'before', distance: diff}]
    H -->|否| J[计算 time - endDate 的毫秒差<br/>返回 {status: 'after', distance: diff}]
```

函数首先将三个输入统一转换为 `Date` 对象，然后依次验证有效性、区间逻辑，最后通过比较判断目标时间的位置并计算距离。

## 注意事项

### 输入边界

- `time`、`startTime`、`endTime` 支持字符串、数字（毫秒时间戳）和 `Date` 对象的任意组合
- 字符串格式兼容 ISO 8601、`YYYY-MM-DD`、`YYYY-MM-DD HH:mm:ss` 等常见格式（由 `date-fns` 解析）
- `startTime` 必须小于或等于 `endTime`，否则返回 `null`
- 当目标时间恰好落在边界（等于 `startTime` 或 `endTime`）时，视为在区间内

### 错误处理

- 函数不会抛出异常；所有无效输入均通过返回 `null` 表达
- 以下情况会返回 `null`：
  - 任一参数为无效日期字符串（如 `'not-a-date'`）
  - 任一参数为 `Invalid Date` 对象
  - `startTime` 晚于 `endTime`

### 性能考虑

- **时间复杂度**: O(1) — 仅涉及常量次数的日期转换和比较
- **空间复杂度**: O(1) — 只创建固定数量的中间 Date 对象和结果对象

### 兼容性

- **环境要求**: 依赖 `date-fns` 的 `toDate`、`isValid`、`isWithinInterval`、`differenceInMilliseconds`，适用于所有支持 ES2015+ 的运行时

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/date/src/convenience/analyze-time-range/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/date/src/convenience/analyze-time-range/index.test.ts)
