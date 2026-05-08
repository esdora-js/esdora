---
title: parse
description: '@esdora/biz 的 parse 函数，将查询字符串解析为对象，支持嵌套对象与数组格式'
---

# parse

将查询字符串解析为对象。该函数重新导出自 `qs` 库，支持嵌套对象、数组以及多种解析选项。

## 示例

### 基本用法

```typescript
import { parse } from '@esdora/biz/qs'

parse('foo=bar&baz=qux') // => { foo: 'bar', baz: 'qux' }
```

### 空字符串

```typescript
import { parse } from '@esdora/biz/qs'

parse('') // => {}
```

### 嵌套对象

```typescript
import { parse } from '@esdora/biz/qs'

parse('user[name]=John&user[age]=30')
// => { user: { name: 'John', age: '30' } }
```

### 特殊字符解码

```typescript
import { parse } from '@esdora/biz/qs'

parse('name=John%20Doe&email=test%40example.com')
// => { name: 'John Doe', email: 'test@example.com' }
```

### 使用解析选项

```typescript
import { parse } from '@esdora/biz/qs'

// 自定义 decoder 将数字字符串转为 number
parse('id=123&name=test', {
  decoder: (str) => {
    const num = Number(str)
    return Number.isNaN(num) ? str : num
  },
})
// => { id: 123, name: 'test' }
```

## 签名

```typescript
export function parse(
  str: string,
  options?: ParseOptions,
): { [key: string]: unknown }
```

## 参数

| 参数      | 类型           | 描述               | 必需 |
| --------- | -------------- | ------------------ | ---- |
| `str`     | `string`       | 要解析的查询字符串 | 是   |
| `options` | `ParseOptions` | `qs` 的解析选项    | 否   |

### ParseOptions

`ParseOptions` 继承自 `qs.IParseOptions`，常用字段如下：

| 字段                       | 类型                             | 描述                                                         | 默认值       |
| -------------------------- | -------------------------------- | ------------------------------------------------------------ | ------------ |
| `allowDots`                | `boolean`                        | 是否允许点号表示嵌套对象，如 `a.b=c`                         | `false`      |
| `allowPrototypes`          | `boolean`                        | 是否允许覆盖对象原型属性                                     | `false`      |
| `arrayLimit`               | `number`                         | 数组索引上限，超过则转为对象                                 | `20`         |
| `charset`                  | `string`                         | 字符编码，如 `'utf-8'`                                       | `'utf-8'`    |
| `charsetSentinel`          | `boolean`                        | 是否检测 UTF-8 编码哨兵                                      | `false`      |
| `comma`                    | `boolean`                        | 是否将逗号分隔的值解析为数组                                 | `false`      |
| `decoder`                  | `function`                       | 自定义解码函数 `(str, defaultDecoder, charset, type) => any` | 内置 decoder |
| `depth`                    | `number`                         | 嵌套对象解析深度限制                                         | `5`          |
| `duplicates`               | `'combine' \| 'first' \| 'last'` | 重复键的处理策略                                             | `'combine'`  |
| `ignoreQueryPrefix`        | `boolean`                        | 是否忽略前导 `?`                                             | `false`      |
| `interpretNumericEntities` | `boolean`                        | 是否将 `&#xHHHH;` 解释为 Unicode                             | `false`      |
| `parameterLimit`           | `number`                         | 最大参数数量限制                                             | `1000`       |
| `parseArrays`              | `boolean`                        | 是否解析数组格式                                             | `true`       |
| `plainObjects`             | `boolean`                        | 是否使用 `Object.create(null)` 创建结果                      | `false`      |
| `strictNullHandling`       | `boolean`                        | 是否严格处理 `null` 值                                       | `false`      |

## 返回值

- **类型**: `{ [key: string]: unknown }`
- **说明**: 解析后的查询对象，键为字符串，值可以是字符串、数组或嵌套对象
- **特殊情况**:
  - 传入空字符串 `''` 时返回空对象 `{}`
  - 当 `parseArrays: true` 时，`a[0]=1&a[1]=2` 解析为 `{ a: ['1', '2'] }`
  - 当 `allowDots: true` 时，`a.b=c` 解析为 `{ a: { b: 'c' } }`
  - 重复键默认合并为数组，`a=1&a=2` 解析为 `{ a: ['1', '2'] }`

## 注意事项

### 输入边界

- 空字符串返回空对象 `{}`
- 仅包含 `?` 的字符串（如 `'?'`）若未设置 `ignoreQueryPrefix: true`，会将 `?` 作为键名解析
- 嵌套对象深度超过 `depth` 限制时，深层键名将作为普通字符串键保留
- 数组索引超过 `arrayLimit` 时，该键值对将转为对象而非数组

### 错误处理

- 本函数不抛出异常，对任意字符串输入均返回对象
- 非法 URL 编码序列会被保留原样或按 `decoder` 的行为处理
- 若传入非字符串类型，可能因 `qs` 内部行为导致意外结果，建议始终传入字符串

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/biz/src/qs/parse/index.ts)
- [单元测试](https://github.com/esdora-js/esdora/blob/main/packages/biz/src/qs/parse/index.test.ts)
