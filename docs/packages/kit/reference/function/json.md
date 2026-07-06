---
title: _JSON
description: "@esdora/kit 的_JSON 对象，提供安全版本的 JSON 解析和序列化方法"
---

# \_JSON

提供安全版本的 JSON 解析和序列化方法，基于 [`safe`](./safe.md) 包装原生 `JSON.parse` 与 `JSON.stringify`。解析或序列化失败时返回 `undefined`，而非抛出异常。

## 示例

### 安全解析 JSON

```typescript
import { _JSON } from '@esdora/kit'

_JSON.parse('{"name":"John","age":30}') // => { name: 'John', age: 30 }
_JSON.parse('{"name":"John","age":}') // => undefined（解析错误被捕获，不抛异常）
```

### 安全序列化

```typescript
import { _JSON } from '@esdora/kit'

_JSON.stringify({ name: 'John', age: 30 }) // => '{"name":"John","age":30}'

// 含循环引用的对象，原生 JSON.stringify 会抛错，_JSON.stringify 返回 undefined
const circular: any = { name: 'John' }
circular.self = circular
_JSON.stringify(circular) // => undefined
```

## 签名

```typescript
const _JSON: {
  parse: (text: string, reviver?: (key: string, value: any) => any) => any
  stringify: (value: any, replacer?: (key: string, value: any) => any, space?: string | number) => string | undefined
}
```

## 方法

### parse

安全解析 JSON 字符串。参数与原生 `JSON.parse` 一致，解析失败时返回 `undefined`。

| 参数      | 类型                               | 描述                 | 必需 |
| --------- | ---------------------------------- | -------------------- | ---- |
| `text`    | `string`                           | 要解析的 JSON 字符串 | 是   |
| `reviver` | `(key: string, value: any) => any` | 转换函数             | 否   |

- **返回值**: 解析成功返回对应的值；解析失败返回 `undefined`

### stringify

安全地将 JavaScript 值序列化为 JSON 字符串。参数与原生 `JSON.stringify` 一致，序列化失败（如循环引用）时返回 `undefined`。

| 参数       | 类型                               | 描述             | 必需 |
| ---------- | ---------------------------------- | ---------------- | ---- |
| `value`    | `any`                              | 要序列化的值     | 是   |
| `replacer` | `(key: string, value: any) => any` | 转换函数         | 否   |
| `space`    | `string \| number`                 | 缩进文本或空格数 | 否   |

- **返回值**: 序列化成功返回 JSON 字符串；失败（如循环引用）返回 `undefined`

## 注意事项

### 与原生 JSON 的区别

- `_JSON.parse` / `_JSON.stringify` 的签名与原生 `JSON.parse` / `JSON.stringify` 完全一致
- 唯一区别：出错时不抛异常，而是返回 `undefined`
- 适用场景：处理不可信输入（如用户输入、网络响应）时，避免异常中断流程

### 错误静默性

- 由于底层使用 [`safe`](./safe.md) 包装，错误会被静默捕获
- 若需要感知错误，可使用 [`createSafe`](./create-safe.md) 自行构造带错误处理器的版本

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/function/safe/json.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/function/safe/json.test.ts)
- [safe](./safe.md) — 基础安全包装函数
