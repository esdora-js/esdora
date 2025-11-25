---
title: parseSearch
description: "parseSearch - Dora Pocket 中 @esdora/biz 库提供的查询字符串解析工具函数，用于从 URL 中提取查询部分并返回类型安全的对象。"
---

# parseSearch

从完整 URL 或路径中自动提取 `?` 之后的查询字符串，并使用 `qs.parse` 解析为类型安全的对象，省去手动切割字符串的步骤。

## 示例

### 基本用法

```typescript
import { parseSearch } from '@esdora/biz'

const result = parseSearch('https://example.com?foo=bar&baz=qux')
// => { foo: 'bar', baz: 'qux' }
```

### 处理无查询参数的 URL

```typescript
import { parseSearch } from '@esdora/biz'

parseSearch('https://example.com')
// => {}

parseSearch('https://example.com?')
// => {}
```

### 解码特殊字符

```typescript
import { parseSearch } from '@esdora/biz'

parseSearch('/path?name=John%20Doe&email=test%40example.com')
// => { name: 'John Doe', email: 'test@example.com' }
```

### 解析嵌套对象

```typescript
import { parseSearch } from '@esdora/biz'

parseSearch('/path?user[name]=John&user[age]=30')
// => { user: { name: 'John', age: '30' } }
```

## 签名与说明

### 类型签名

```typescript
function parseSearch<T = QueryObject>(
  url: string,
  options?: ParseOptions
): ParsedQuery<T>
```

### 参数说明

| 参数    | 类型           | 描述                                              | 必需 |
| ------- | -------------- | ------------------------------------------------- | ---- |
| url     | `string`       | 完整 URL 或带查询字符串的路径                     | 是   |
| options | `ParseOptions` | 传递给 `qs.parse` 的选项（如 decoder、delimiter） | 否   |

### 返回值

- **类型**: `ParsedQuery<T>`
- **说明**: 与泛型 `T` 匹配的查询参数对象，默认等同于 `Record<string, any>`
- **特殊情况**:
  - URL 中没有 `?` 时返回空对象 `{}`
  - URL 只包含 `?` 而无参数时仍返回 `{}`

### 泛型约束

- **`T extends QueryObject`**: 指定解析结果的类型结构，默认使用 `QueryObject`。当你预先定义查询参数类型时，可提供 `T` 以获得完整的类型提示。

## 注意事项与边界情况

### 输入边界

- 自动忽略 URL 片段 `#hash` 之后的内容，只解析查询部分
- 没有查询字符串或仅包含 `?` 的 URL 会返回空对象，不会抛错
- 支持对 `%20`、`%40` 等编码字符进行自动解码，结果始终为可读文本
- 依赖 `qs` 的嵌套语法约定（如 `user[name]`）解析层级结构

### 错误处理

- **异常类型**: 常规输入不会抛出异常；只有在传入极端非法字符串且 `qs` 自身无法解析时才可能抛出 `Error`
- **处理建议**: 建议在处理来源不可信的 URL 时使用 `try...catch`，其余场景可直接调用

### 性能考虑

- **时间复杂度**: O(n)，`n` 为查询字符串长度
- **空间复杂度**: O(n)，需要创建新的对象表示解析结果
- **优化建议**: 高频解析相同 URL 时可自行缓存结果，以减少重复解析的成本

### 兼容性

- 运行环境需支持 ES2015+（Node.js ≥ 14 或现代浏览器环境）
- 输出结构遵循 `qs` 的解析约定，与后端若同样使用 `qs` 可实现完全对称

## 相关链接

- 源码: `packages/biz/src/query/parse.ts`
- 类型定义: `packages/biz/src/query/types.ts`
- 测试: `packages/biz/test/query.test.ts`
