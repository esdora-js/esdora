---
title: mergeQueryParams
description: "@esdora/biz 的 mergeQueryParams 函数，将查询参数智能合并到现有 URL"
---

# mergeQueryParams

将查询参数合并到现有 URL，支持覆盖/保留策略和编码控制。

## 示例

### 基本用法

```typescript
import { mergeQueryParams } from '@esdora/biz'

mergeQueryParams('https://example.com?foo=bar', { baz: 'qux' })
// => 'https://example.com?foo=bar&baz=qux'
```

### 覆盖现有参数

默认情况下，新参数会覆盖 URL 中已有的同名参数：

```typescript
mergeQueryParams('/path?id=1', { id: 2, name: 'test' })
// => '/path?id=2&name=test'
```

### 保留现有参数

通过设置 `override: false`，保留 URL 中已有的参数：

```typescript
mergeQueryParams('/path?id=1', { id: 2, name: 'test' }, { override: false })
// => '/path?id=1&name=test'
```

### 禁用编码

```typescript
mergeQueryParams('/path', { name: 'John Doe' }, { encode: false })
// => '/path?name=John Doe'
```

### 处理无查询参数的 URL

```typescript
mergeQueryParams('https://example.com', { foo: 'bar' })
// => 'https://example.com?foo=bar'
```

### 空参数对象

```typescript
mergeQueryParams('https://example.com?foo=bar', {})
// => 'https://example.com?foo=bar'

mergeQueryParams('https://example.com', {})
// => 'https://example.com'
```

## 签名

```typescript
function mergeQueryParams(
  url: string,
  params: QueryObject,
  options?: MergeOptions,
): string
```

## 参数

| 参数    | 类型           | 描述                               | 必需 |
| ------- | -------------- | ---------------------------------- | ---- |
| url     | `string`       | 基础 URL，可带或不带现有查询字符串 | 是   |
| params  | `QueryObject`  | 要合并的查询参数对象               | 是   |
| options | `MergeOptions` | 合并行为选项                       | 否   |

### MergeOptions

| 字段     | 类型      | 描述                                  | 默认值 |
| -------- | --------- | ------------------------------------- | ------ |
| override | `boolean` | 是否用新参数覆盖 URL 中已有的同名参数 | `true` |
| encode   | `boolean` | 是否对生成的查询字符串进行 URL 编码   | `true` |

## 返回值

- **类型**: `string`
- **说明**: 合并后的完整 URL。如果合并后没有查询参数，则返回不带 `?` 的基础 URL。
- **特殊情况**:
  - 当 `params` 为空对象且 URL 也无查询参数时，返回原始 URL（不带 `?`）
  - 当 `params` 为空对象但 URL 有查询参数时，保留原有查询参数

## 注意事项

### 输入边界

- `url` 可以是完整 URL（如 `https://example.com?foo=bar`）或仅路径（如 `/path?id=1`）
- `url` 不带查询参数时，函数会自动添加 `?`
- `params` 为空对象 `{}` 时，行为取决于 URL 是否已有查询参数
- 通过 `encode: false` 可保留原始字符（如空格），但可能导致 URL 不合法

### 错误处理

- 本函数不抛出异常
- 对于非法输入（如非字符串 url），行为取决于底层 `qs.parse` 的处理方式
- 建议调用方确保 `url` 为有效字符串

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/biz/src/qs/parse/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/biz/src/qs/parse/index.test.ts)
