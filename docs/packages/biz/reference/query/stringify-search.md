---
title: stringifySearch
description: "stringifySearch - Dora Pocket 中 @esdora/biz 库提供的查询字符串生成工具函数，用于以 `qs.stringify` 风格将对象转换为 URL 查询字符串。"
---

# stringifySearch

为常见场景预配置的 `qs.stringify` 包装器，保持 `qs` 的强大能力，同时默认采用最常用的编码策略，快速把对象转换为查询字符串。

## 示例

### 基本用法

```typescript
import { stringifySearch } from '@esdora/biz'

const query = stringifySearch({ foo: 'bar', baz: 'qux' })
// => 'foo=bar&baz=qux'
```

### 处理数值

```typescript
import { stringifySearch } from '@esdora/biz'

stringifySearch({ id: 123, count: 456 })
// => 'id=123&count=456'
```

### 默认数组格式（indices）

```typescript
import { stringifySearch } from '@esdora/biz'

stringifySearch({ ids: [1, 2, 3] })
// => 'ids%5B0%5D=1&ids%5B1%5D=2&ids%5B2%5D=3'
```

### brackets 数组格式

```typescript
import { stringifySearch } from '@esdora/biz'

stringifySearch({ ids: [1, 2, 3] }, { arrayFormat: 'brackets' })
// => 'ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3'
```

### 禁用 URL 编码

```typescript
import { stringifySearch } from '@esdora/biz'

stringifySearch({ name: 'John Doe' }, { encode: false })
// => 'name=John Doe'
```

### 处理空对象

```typescript
import { stringifySearch } from '@esdora/biz'

stringifySearch({})
// => ''
```

## 签名与说明

### 类型签名

```typescript
function stringifySearch(
  params: QueryObject,
  options?: StringifyOptions
): string
```

### 参数说明

| 参数    | 类型               | 描述                                                | 必需 |
| ------- | ------------------ | --------------------------------------------------- | ---- |
| params  | `QueryObject`      | 要转换为查询字符串的对象，支持嵌套对象与数组        | 是   |
| options | `StringifyOptions` | 传递给 `qs.stringify` 的配置（如 `arrayFormat` 等） | 否   |

### 返回值

- **类型**: `string`
- **说明**: 不含前导 `?` 的查询字符串，遵循 `qs` 默认编码
- **特殊情况**: 传入空对象时返回空字符串 `''`

### 泛型约束（如适用）

- `stringifySearch` 不暴露泛型参数；其输入由 `QueryObject` 约束为 `Record<string, any>`。

## 注意事项与边界情况

### 输入边界

- 空对象会返回空字符串，可直接拼接到 URL
- 数组默认采用 `indices` 格式（`arr[0]`）；如需 `arr[]` 等格式请设置 `arrayFormat`
- `encode: false` 时不会转义空格或特殊字符，需确保服务器端可以按原样解析
- 嵌套对象序列化格式与 `qs` 保持一致，后端需具备匹配解析策略

### 错误处理

- **异常类型**: 正常输入不会抛错；若对象包含循环引用，`qs.stringify` 可能抛出 `Error`
- **处理建议**: 避免序列化包含 DOM 节点或循环引用的对象，必要时在调用前进行数据清理

### 性能考虑

- **时间复杂度**: O(n)，`n` 为需要序列化的键值对数量
- **空间复杂度**: O(n)，返回字符串长度与输入规模成正比
- **优化建议**: 高频序列化相同数据时可做缓存；大对象可先筛选必要字段以减少字符串长度

### 兼容性

- 依赖 `qs` 库，要求 Node.js ≥ 14 或任意支持 ES2015 的环境
- 输出与 `qs.parse` 完全对称，确保与 `parseSearch`、`qs.parse` 互操作

## 相关链接

- 源码: `packages/biz/src/query/stringify.ts`
- 类型定义: `packages/biz/src/query/types.ts`
- 测试: `packages/biz/test/query.test.ts`
