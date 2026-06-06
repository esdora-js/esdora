---
title: parseSearch
description: '@esdora/biz 的 parseSearch 函数，从 URL 中提取并解析查询字符串为对象'
---

# parseSearch

从 URL 中提取查询字符串部分并解析为对象。支持嵌套对象、数组和 URL 编码字符的自动解码。

## 示例

### 基本用法

```typescript
import { parseSearch } from '@esdora/biz'

parseSearch('https://example.com?foo=bar&baz=qux')
// => { foo: 'bar', baz: 'qux' }
```

### 解析嵌套对象

```typescript
parseSearch('/path?user[name]=John&user[age]=30')
// => { user: { name: 'John', age: '30' } }
```

### 处理 URL 编码字符

```typescript
parseSearch('/path?name=John%20Doe&email=test%40example.com')
// => { name: 'John Doe', email: 'test@example.com' }
```

### 无查询参数的 URL

```typescript
parseSearch('https://example.com')
// => {}

parseSearch('https://example.com?')
// => {}
```

## 签名

```typescript
function parseSearch<T = QueryObject>(
  url: string,
  options?: ParseOptions,
): ParsedQuery<T>
```

## 参数

| 参数    | 类型           | 描述                          | 必需 |
| ------- | -------------- | ----------------------------- | ---- |
| url     | `string`       | 完整 URL 或带查询字符串的路径 | 是   |
| options | `ParseOptions` | qs 解析选项，用于控制解析行为 | 否   |

## 返回值

- **类型**: `ParsedQuery<T>`
- **说明**: 解析后的查询对象，键为查询参数名，值为解析后的参数值
- **特殊情况**:
  - 当 URL 不含 `?` 时，返回空对象 `{}`
  - 当 `?` 后无内容时，返回空对象 `{}`
  - 嵌套对象使用 `qs` 库的标准嵌套语法（如 `user[name]`）

## 注意事项

### 输入边界

- URL 可以是完整 URL（`https://example.com?foo=bar`）或仅路径（`/path?foo=bar`）
- 查询字符串中多个同名参数会被解析为数组
- URL 编码字符（如 `%20`、`%40`）会被自动解码
- 空字符串或不含 `?` 的字符串均返回空对象

### 错误处理

- 函数不抛出异常，所有输入均返回一个对象（可能为空）
- 无效或畸形的查询字符串由底层 `qs` 库处理，通常返回尽力解析的结果
