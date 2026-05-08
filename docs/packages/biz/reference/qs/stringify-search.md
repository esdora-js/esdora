---
title: stringifySearch
description: '@esdora/biz 的 stringifySearch 函数，将对象转换为 URL 查询字符串'
---

# stringifySearch

将对象转换为 URL 查询字符串（query string），不含前导 `?`。

该函数是 `qs.stringify` 的便捷包装器，使用 `qs` 库的默认行为，支持通过选项自定义数组格式、编码等行为。

## 示例

### 基本用法

```typescript
import { stringifySearch } from '@esdora/biz'

stringifySearch({ foo: 'bar', baz: 'qux' })
// => 'foo=bar&baz=qux'

stringifySearch({ id: 123, count: 456 })
// => 'id=123&count=456'
```

### 空对象

```typescript
stringifySearch({})
// => ''
```

### 数组值

```typescript
stringifySearch({ ids: [1, 2, 3] })
// => 'ids%5B0%5D=1&ids%5B1%5D=2&ids%5B2%5D=3'
```

### 自定义数组格式

```typescript
stringifySearch({ ids: [1, 2, 3] }, { arrayFormat: 'brackets' })
// => 'ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3'
```

### 禁用编码

```typescript
stringifySearch({ name: 'John Doe' }, { encode: false })
// => 'name=John Doe'
```

## 签名

```typescript
function stringifySearch(
  params: QueryObject,
  options?: StringifyOptions,
): string
```

## 参数

| 参数      | 类型               | 描述                     | 必需 |
| --------- | ------------------ | ------------------------ | ---- |
| `params`  | `QueryObject`      | 要转换为查询字符串的对象 | 是   |
| `options` | `StringifyOptions` | `qs` 的字符串化选项      | 否   |

### StringifyOptions

`StringifyOptions` 继承自 `qs.IStringifyOptions`，常用选项如下：

| 字段                 | 类型                                             | 描述                             | 默认值      |
| -------------------- | ------------------------------------------------ | -------------------------------- | ----------- |
| `arrayFormat`        | `'brackets' \| 'indices' \| 'repeat' \| 'comma'` | 数组序列化格式                   | `'indices'` |
| `encode`             | `boolean`                                        | 是否对值进行 URL 编码            | `true`      |
| `delimiter`          | `string`                                         | 键值对之间的分隔符               | `'&'`       |
| `strictNullHandling` | `boolean`                                        | 是否将 `null` 值序列化为空字符串 | `false`     |

完整选项请参考 [qs 文档](https://github.com/ljharb/qs)。

## 返回值

- **类型**: `string`
- **说明**: 生成的查询字符串，不含前导 `?`
- **特殊情况**:
  - 传入空对象 `{}` 时返回空字符串 `''`
  - 传入空值或 `null` 时行为由 `qs` 库决定，默认会忽略 `undefined` 值

## 注意事项

### 输入边界

- 空对象 `{}` 返回空字符串，不会抛出异常
- `undefined` 值默认会被 `qs` 忽略，不会出现在结果中
- `null` 值默认会被序列化为空字符串（可通过 `strictNullHandling` 调整）
- 嵌套对象会被 `qs` 自动展开为带方括号的键名，如 `a[b]=c`

### 错误处理

- 该函数本身不抛出异常，所有输入均委托给 `qs.stringify` 处理
- 非对象类型的 `params` 行为由底层 `qs` 库决定

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/biz/src/qs/stringify/index.ts)
- [单元测试](https://github.com/esdora-js/esdora/blob/main/packages/biz/src/qs/stringify/index.test.ts)
