---
title: DATE_FORMAT
description: '@esdora/date 的 DATE_FORMAT 常量，提供常用的日期格式字符串，兼容 date-fns format 函数。'
---

# DATE_FORMAT

提供常用的日期格式字符串，格式遵循 [date-fns](https://date-fns.org/v4.1.0/docs/format) 的约定。

## 示例

### 基本用法

```typescript
import { DATE_FORMAT, format } from '@esdora/date'

const now = new Date('2024-01-15 09:30:45')

format(now, DATE_FORMAT.HH_MM_SS) // => '09:30:45'
format(now, DATE_FORMAT.YYYY_MM_DD) // => '2024-01-15'
format(now, DATE_FORMAT.YYYY_MM_DD_HH_MM) // => '2024-01-15 09:30'
format(now, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS) // => '2024-01-15 09:30:45'
```

### 与表单组件配合使用

```typescript
import { DATE_FORMAT, format } from '@esdora/date'

function getCurrentDateString(): string {
  return format(new Date(), DATE_FORMAT.YYYY_MM_DD)
}

getCurrentDateString() // => '2026-05-08'（当前日期）
```

### 时间戳展示

```typescript
import { DATE_FORMAT, format } from '@esdora/date'

const logTime = new Date('2024-12-25 14:20:00')

format(logTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS) // => '2024-12-25 14:20:00'
```

## 签名

```typescript
export const DATE_FORMAT: {
  readonly HH_MM_SS: 'HH:mm:ss'
  readonly YYYY_MM_DD: 'yyyy-MM-dd'
  readonly YYYY_MM_DD_HH_MM: 'yyyy-MM-dd HH:mm'
  readonly YYYY_MM_DD_HH_MM_SS: 'yyyy-MM-dd HH:mm:ss'
}
```

## 参数

DATE_FORMAT 是一个常量对象，无需传入参数。其字段如下：

| 字段                  | 类型                    | 描述                                  | 必需 |
| --------------------- | ----------------------- | ------------------------------------- | ---- |
| `HH_MM_SS`            | `'HH:mm:ss'`            | 24 小时制时间格式（时:分:秒）         | —    |
| `YYYY_MM_DD`          | `'yyyy-MM-dd'`          | 日期格式（年-月-日）                  | —    |
| `YYYY_MM_DD_HH_MM`    | `'yyyy-MM-dd HH:mm'`    | 日期时间格式（年-月-日 时:分）        | —    |
| `YYYY_MM_DD_HH_MM_SS` | `'yyyy-MM-dd HH:mm:ss'` | 完整日期时间格式（年-月-日 时:分:秒） | —    |

## 返回值

- **类型**: `Record<string, string>`
- **说明**: 一个冻结的常量对象，包含 4 个常用日期格式字符串，可直接用于 `date-fns` 的 `format` 函数。
- **特殊情况**: 所有字段均为 `readonly`，不可重新赋值。

## 注意事项

### 输入边界

- DATE_FORMAT 为常量对象，不存在运行时输入边界问题。
- 格式字符串遵循 [Unicode 日期格式模式](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table)，与 `date-fns` 的 `format` 函数完全兼容。
- `HH` 表示 24 小时制，`hh` 表示 12 小时制；常量中统一使用 24 小时制。
- `MM` 表示月份，`mm` 表示分钟；注意区分大小写。

### 错误处理

- 常量对象本身不会抛出异常。
- 若将格式字符串传入不兼容的格式化函数，可能得到非预期结果。
- 建议始终与 `@esdora/date`（即 date-fns）的 `format` 函数配合使用。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/date/src/constant/index.ts)
- [date-fns format 文档](https://date-fns.org/v4.1.0/docs/format)
