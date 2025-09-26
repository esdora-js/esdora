---
title: analyzeTimeRange
description: analyzeTimeRange - 来自 Dora Pocket 的日期“道具”，用于分析一个时间点相对于一个时间区间的状态。
---

# analyzeTimeRange

<!-- 1. 简介：一句话核心功能描述 -->

分析一个给定的时间点，判断其是否在一个时间区间之前、之内或之后，并计算出相应的毫秒差值。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
const startTime = '2024-10-10T10:00:00Z'
const endTime = '2024-10-20T10:00:00Z'

// 目标时间在区间内
analyzeTimeRange('2024-10-15T12:00:00Z', startTime, endTime)
// => { status: 'inRange', distance: 0 }

// 目标时间在区间之前
analyzeTimeRange('2024-10-09T10:00:00Z', startTime, endTime)
// => { status: 'before', distance: 86400000 } // 距离开始时间 24 小时

// 目标时间在区间之后
analyzeTimeRange('2024-10-21T10:00:00Z', startTime, endTime)
// => { status: 'after', distance: 86400000 } // 距离结束时间 24 小时
```

### 支持多种输入格式

```typescript
const startTimeAsDate = new Date('2025-03-01T00:00:00Z')
const endTimeAsTimestamp = new Date('2025-03-10T23:59:59Z').getTime()
const targetTimeStr = '2025-02-28T23:59:59Z'

analyzeTimeRange(targetTimeStr, startTimeAsDate, endTimeAsTimestamp)
// => { status: 'before', distance: 1 }
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 分析一个时间点相对于一个时间区间的状态。
 *
 * @param time 要分析的目标时间点。
 * @param startTime 区间开始时间。
 * @param endTime 区间结束时间。
 * @returns 返回一个包含分析结果的对象：
 *          - `status`: `'before'`、`'inRange'` 或 `'after'`。
 *          - `distance`:
 *            - 当 status 为 `before` 时，表示目标时间与区间开始时间的毫秒差。
 *            - 当 status 为 `after` 时，表示目标时间与区间结束时间的毫秒差。
 *            - 当 status 为`inRange` 时，恒为 `0`。
 *          如果任何输入日期无效，或开始时间晚于结束时间，则返回 `null`。
 */
export function analyzeTimeRange(
  time: string | number | Date,
  startTime: string | number | Date,
  endTime: string | number | Date
): { status: 'before' | 'inRange' | 'after', distance: number } | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于无效输入**: 如果任何一个输入参数（`time`, `startTime`, `endTime`）是无法被解析的无效日期（如 `"not-a-date"`），或者开始时间晚于结束时间，函数将返回 `null`。
- **关于区间边界**: 时间区间是**闭区间**，包含开始和结束时间点。如果目标时间恰好等于 `startTime` 或 `endTime`，`status` 会被判定为 `inRange`。
- **关于`distance`**: `distance` 的值始终为正数或零，单位是毫秒。它表示目标时间点到最近的区间边界的距离。
- **关于输入格式**: 函数接受多种日期格式作为输入，包括 ISO 字符串、Date 对象和毫秒级时间戳，并能正确处理它们的混合使用。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/date/src/convenience/analyze-time-range/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/date/src/convenience/analyze-time-range/index.ts)
