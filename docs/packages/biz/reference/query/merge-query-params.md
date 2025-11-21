---
title: mergeQueryParams
description: "mergeQueryParams - Dora Pocket 中 @esdora/biz 库提供的查询参数合并工具函数，用于在保持 URL 结构的同时组合新旧查询字符串。"
---

# mergeQueryParams

在不手动解析 URL 的情况下，将新的查询参数智能合并进现有 URL，可配置是否覆盖同名参数以及是否进行 URL 编码。

## 示例

### 基本用法

```typescript
import { mergeQueryParams } from '@esdora/biz'

const url = mergeQueryParams('https://example.com?foo=bar', { baz: 'qux' })
// => 'https://example.com?foo=bar&baz=qux'
```

### 默认覆盖模式

```typescript
import { mergeQueryParams } from '@esdora/biz'

mergeQueryParams('/path?id=1', { id: 2, name: 'test' })
// => '/path?id=2&name=test'

mergeQueryParams(
  '/path?id=1&status=active',
  { id: 2, page: 1 },
  { override: true }
)
// => '/path?id=2&status=active&page=1'
```

### 保留已有参数

```typescript
import { mergeQueryParams } from '@esdora/biz'

mergeQueryParams('/path?id=1', { id: 2, name: 'test' }, { override: false })
// => '/path?id=1&name=test'
```

### 处理空参数与空查询

```typescript
import { mergeQueryParams } from '@esdora/biz'

mergeQueryParams('https://example.com', { foo: 'bar' })
// => 'https://example.com?foo=bar'

mergeQueryParams('https://example.com?foo=bar', {})
// => 'https://example.com?foo=bar'

mergeQueryParams('https://example.com', {})
// => 'https://example.com'
```

### 控制编码行为

```typescript
import { mergeQueryParams } from '@esdora/biz'

mergeQueryParams('/path', { name: 'John Doe' }, { encode: false })
// => '/path?name=John Doe'
```

## 签名与说明

### 类型签名

```typescript
function mergeQueryParams(
  url: string,
  params: QueryObject,
  options?: MergeOptions
): string
```

### 参数说明

| 参数    | 类型           | 描述                                           | 必需 |
| ------- | -------------- | ---------------------------------------------- | ---- |
| url     | `string`       | 需要合并查询参数的基础 URL，可带现有查询字符串 | 是   |
| params  | `QueryObject`  | 待合并的查询参数对象                           | 是   |
| options | `MergeOptions` | 控制覆盖策略与编码行为                         | 否   |

**MergeOptions**：

| 属性     | 类型      | 描述                            | 默认值 |
| -------- | --------- | ------------------------------- | ------ |
| override | `boolean` | 是否由新参数覆盖同名旧参数      | `true` |
| encode   | `boolean` | 生成查询字符串时是否做 URL 编码 | `true` |

### 返回值

- **类型**: `string`
- **说明**: 带有最新查询参数的完整 URL，如最终无参数则返回基础 URL
- **特殊情况**:
  - `params` 为空对象且原 URL 不带查询字符串时，直接返回基础 URL
  - `override: false` 时会保留原有同名参数值

### 泛型约束（如适用）

- 本函数不使用泛型；内部解析结果依赖 `qs.parse` 的结构。

## 注意事项与边界情况

### 输入边界

- 自动识别并保留 URL 的基础部分（`?` 之前），仅在查询部分进行合并
- 空 `params` 会保留原查询字符串，不会添加多余的 `?`
- 当 URL 原本没有查询字符串时，会在结果中自动添加 `?`（除非没有参数需要添加）

### 错误处理

- **异常类型**: 正常输入不会抛错，但极端非法的查询字符串可能让 `qs.parse` 抛出 `Error`
- **处理建议**: 如需处理外部来源的 URL，可在调用外层包裹 `try...catch` 并对输入做校验

### 性能考虑

- **时间复杂度**: O(n + m)，`n` 为现有查询字符串长度，`m` 为新参数数量
- **空间复杂度**: O(n + m)，需要创建解析结果和合并对象
- **优化建议**: 高频率对同一 URL 反复合并时，可缓存解析结果或直接维护参数对象再拼接

### 兼容性

- 依赖 `qs` 库，可运行于 Node.js ≥ 14 及现代浏览器环境
- 输出的查询格式与 `qs.stringify` 对称，可被服务器端 `qs.parse` 或 `parseSearch` 完整还原

## 相关链接

- 源码: `packages/biz/src/query/parse.ts`
- 类型定义: `packages/biz/src/query/types.ts`
- 测试: `packages/biz/test/query.test.ts`
