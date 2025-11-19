---
title: parse
description: "parse - Dora Pocket 中 @esdora/biz 库重新导出的基础查询解析函数，用于直接将查询字符串转换为对象。"
---

# parse

直接暴露 `qs.parse` 的全部能力，适合已经持有查询字符串时的解析场景，提供最原始、最灵活的解析体验。

## 示例

### 基本用法

```typescript
import { parse } from '@esdora/biz'

const query = parse('foo=bar&baz=qux')
// => { foo: 'bar', baz: 'qux' }
```

### 处理空字符串

```typescript
import { parse } from '@esdora/biz'

parse('')
// => {}
```

### 嵌套对象（与 parseSearch 测试一致）

```typescript
import { parse } from '@esdora/biz'

parse('user[name]=John&user[age]=30')
// => { user: { name: 'John', age: '30' } }
```

> 示例沿用 `parseSearch` 的“解析嵌套对象”测试数据，因为两者都依赖 `qs.parse`。

## 签名与说明

### 类型签名

```typescript
function parse<T extends QueryObject = QueryObject>(
  str: string,
  options?: ParseOptions
): ParsedQuery<T>
```

> 说明：在源码中通过 `export { parse } from 'qs'` 直接重导，所以其行为与 `qs.parse` 完全一致；此处的 `ParsedQuery<T>` 旨在说明你可以在调用处通过类型断言获得更精准的返回类型。

### 参数说明

| 参数    | 类型           | 描述                                              | 必需 |
| ------- | -------------- | ------------------------------------------------- | ---- |
| str     | `string`       | 已经提取好的查询字符串（不需要前导 `?`）         | 是   |
| options | `ParseOptions` | `qs.parse` 支持的全部选项，如 `decoder`、`allowDots` 等 | 否   |

### 返回值

- **类型**: `ParsedQuery<T>`
- **说明**: 与 `T` 对齐的查询对象，默认即 `Record<string, any>`
- **特殊情况**:
  - 传入空字符串 `''` 将返回空对象
  - 不合法的键值对由 `qs` 负责解析与错误提示

### 泛型约束

- **`T extends QueryObject`**: 允许为解析结果指定更精确的类型结构，默认值为 `QueryObject`。

## 注意事项与边界情况

### 输入边界

- `str` 可包含嵌套语法（如 `a[b]=1`），`qs` 会保留层级结构
- 若 `str` 含 URL 编码字符，将在解析过程中自动解码
- 建议传入纯查询字符串；如包含 `?` 可先移除以避免多余字符

### 错误处理

- **异常类型**: 仅在极端非法字符串或超大输入导致 `qs` 解析失败时会抛出 `Error`
- **处理建议**: 对来源不可信的数据进行校验或包裹 `try...catch`；常规使用无需特殊处理

### 性能考虑

- **时间复杂度**: O(n)，`n` 为字符串长度
- **空间复杂度**: O(n)，输出对象大小与输入规模成正比
- **优化建议**: 高频解析时可缓存结果；若只需部分参数，可考虑更轻量的解析策略

### 兼容性

- 可运行在 Node.js ≥ 14 及任意现代浏览器（经打包）环境
- 解析格式与 `stringifySearch`、`qs.stringify` 相互对称，便于前后端协同

## 相关链接

- 源码: `packages/biz/src/query/parse.ts`
- 类型定义: `packages/biz/src/query/types.ts`
- 测试: `packages/biz/test/query.test.ts`
