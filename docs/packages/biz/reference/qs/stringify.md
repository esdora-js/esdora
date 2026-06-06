---
title: stringify / stringifySearch
description: "@esdora/biz 的 qs 字符串化函数，将对象转换为 URL 查询字符串"
---

# stringify / stringifySearch

将普通对象序列化为 URL 查询字符串。提供两个导出：

- `stringify` —— 直接重新导出 `qs.stringify`，行为与 [qs](https://github.com/ljharb/qs) 库完全一致。
- `stringifySearch` —— 基于 `qs.stringify` 的便捷包装，预置了常用默认值，简化常规场景下的查询字符串生成。

## 示例

### 基本用法

```typescript
import { stringifySearch } from '@esdora/biz'

stringifySearch({ foo: 'bar', baz: 'qux' })
// => 'foo=bar&baz=qux'
```

### 处理空对象

```typescript
import { stringifySearch } from '@esdora/biz'

stringifySearch({})
// => ''
```

### 处理数值

```typescript
import { stringifySearch } from '@esdora/biz'

stringifySearch({ id: 123, count: 456 })
// => 'id=123&count=456'
```

### 数组默认格式

```typescript
import { stringifySearch } from '@esdora/biz'

stringifySearch({ ids: [1, 2, 3] })
// => 'ids%5B0%5D=1&ids%5B1%5D=2&ids%5B2%5D=3'
```

### 使用 arrayFormat 选项

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

### 直接使用 qs.stringify

```typescript
import { stringify } from '@esdora/biz'

stringify({ foo: 'bar', baz: 'qux' })
// => 'foo=bar&baz=qux'

stringify({})
// => ''
```

## 签名

```typescript
// stringifySearch —— 便捷包装
export function stringifySearch(
  params: QueryObject,
  options?: StringifyOptions,
): string

// stringify —— 直接重新导出 qs.stringify
export { stringify } from 'qs'
```

## 参数

### stringifySearch

| 参数      | 类型               | 描述                                                | 必需 |
| --------- | ------------------ | --------------------------------------------------- | ---- |
| `params`  | `QueryObject`      | 要转换为查询字符串的键值对对象                      | 是   |
| `options` | `StringifyOptions` | `qs` 库的字符串化选项，用于控制数组格式、编码行为等 | 否   |

### StringifyOptions

`StringifyOptions` 继承自 `qs.IStringifyOptions`，常用字段如下：

| 字段                 | 类型                                             | 描述                             | 默认值      |
| -------------------- | ------------------------------------------------ | -------------------------------- | ----------- |
| `arrayFormat`        | `'brackets' \| 'indices' \| 'repeat' \| 'comma'` | 数组序列化格式                   | `'indices'` |
| `encode`             | `boolean`                                        | 是否对键和值进行 URL 编码        | `true`      |
| `delimiter`          | `string`                                         | 键值对之间的分隔符               | `'&'`       |
| `allowDots`          | `boolean`                                        | 是否使用点号表示嵌套对象         | `false`     |
| `strictNullHandling` | `boolean`                                        | 是否将 `null` 值序列化为空字符串 | `false`     |

## 返回值

- **类型**: `string`
- **说明**: 序列化后的查询字符串，不含前导 `?`。
- **特殊情况**:
  - 当 `params` 为空对象 `{}` 时，返回空字符串 `''`。
  - 当传入 `null` 或 `undefined` 值时，默认会被省略；可通过 `strictNullHandling` 等选项改变行为。

## 注意事项

### 输入边界

- `params` 为空对象 `{}` 时返回空字符串，不会抛出异常。
- 嵌套对象默认使用方括号表示法（如 `a[b]=c`），可通过 `allowDots` 改为点号表示法。
- 数组默认使用索引格式（`ids[0]=1`），可通过 `arrayFormat` 切换为括号格式、重复键或逗号分隔。

### 错误处理

- 本函数不主动抛出异常，底层由 `qs` 库处理序列化逻辑。
- 若传入非对象类型（如 `null`、`undefined`），`qs` 可能返回空字符串或产生非预期结果，建议调用前确保 `params` 为有效对象。

## 相关链接

- [源码](https://github.com/DreamyTZK/esdora/blob/main/packages/biz/src/qs/stringify/index.ts)
- [单元测试](https://github.com/DreamyTZK/esdora/blob/main/packages/biz/src/qs/stringify/index.test.ts)
