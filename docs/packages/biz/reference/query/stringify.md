---
title: stringify
description: "stringify - Dora Pocket 中 @esdora/biz 库重新导出的查询字符串生成函数，用于直接将对象转换为 `qs` 风格的查询字符串。"
---

# stringify

重新导出 `qs.stringify` 以便直接使用其完整能力，适合需要完全控制编码选项或已经熟悉 `qs` 行为的场景。

## 示例

### 基本用法

```typescript
import { stringify } from '@esdora/biz'

const query = stringify({ foo: 'bar', baz: 'qux' })
// => 'foo=bar&baz=qux'
```

### 边界情况：空对象

```typescript
import { stringify } from '@esdora/biz'

stringify({})
// => ''
```

### 数组与编码控制（与 stringifySearch 测试一致）

```typescript
import { stringify } from '@esdora/biz'

stringify({ ids: [1, 2, 3] }, { arrayFormat: 'brackets' })
// => 'ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3'

stringify({ name: 'John Doe' }, { encode: false })
// => 'name=John Doe'
```

## 签名与说明

### 类型签名

```typescript
function stringify(
  obj: QueryObject,
  options?: StringifyOptions
): string
```

> 说明：源码中通过 `export { stringify } from 'qs'` 直接重导，因此签名与 `qs.stringify` 相同；此处使用 `QueryObject` 便于结合 TypeScript 推断。

### 参数说明

| 参数    | 类型               | 描述                                                | 必需 |
| ------- | ------------------ | --------------------------------------------------- | ---- |
| obj     | `QueryObject`      | 待转换的对象，可包含嵌套对象与数组                 | 是   |
| options | `StringifyOptions` | `qs.stringify` 支持的全部选项，如 `arrayFormat` 等 | 否   |

### 返回值

- **类型**: `string`
- **说明**: 不含前导 `?` 的查询字符串
- **特殊情况**: 空对象返回空字符串；`encode: false` 时保持原始字符

### 泛型约束（如适用）

- 该函数不暴露泛型，但 `QueryObject` 允许你通过类型别名定义更具体的结构（如 `Record<'id' | 'name', string>`）。

## 注意事项与边界情况

### 输入边界

- 空对象直接返回 `''`，可安全拼接到 URL
- 数组与嵌套对象遵循 `qs` 的序列化规则；如需更简单的 `repeat` 格式可通过 `options` 控制
- 值为 `undefined` 的键会被自动忽略，`null` 会被转换成字符串 `"null"`

### 错误处理

- **异常类型**: 当对象包含循环引用或不可序列化值时，`qs.stringify` 可能抛出 `Error`
- **处理建议**: 序列化前移除循环引用或 DOM 节点；必要时使用 `try...catch`

### 性能考虑

- **时间复杂度**: O(n)，`n` 为需要遍历的键值对数量
- **空间复杂度**: O(n)，输出字符串长度与输入规模成正比
- **优化建议**: 对频繁更新的查询对象使用缓存或 diff，避免重复全量序列化

### 兼容性

- 适用于 Node.js ≥ 14 与现代浏览器环境
- 输出格式与 `parse`、`parseSearch`、`qs.parse` 完全对称，可在前后端之间往返

## 相关链接

- 源码: `packages/biz/src/query/stringify.ts`
- 类型定义: `packages/biz/src/query/types.ts`
- 测试: `packages/biz/test/query.test.ts`
