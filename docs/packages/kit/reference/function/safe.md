---
title: safe
description: "safe - Dora Pocket 中 @esdora/kit 库提供的安全执行工具函数，用于为任意函数和 JSON 操作添加统一的错误捕获与降级处理。"
---

# safe

为任意同步或异步函数提供安全包装，自动捕获执行过程中的异常，并通过可选的错误处理器进行统一处理；同时提供基于 `safe` 封装的 `_JSON` 工具，用于安全地调用 `JSON.parse` 与 `JSON.stringify`。

本文档同时涵盖以下导出：

- `safe`：通用函数安全包装器
- `createSafe`：预配置错误处理器的高阶安全包装器工厂
- `_JSON`：基于 `safe` 封装的安全 JSON 操作集合

## 示例

### 基本用法：包装同步函数

```typescript
import { safe } from '@esdora/kit'

// 原始可能抛出错误的函数
function add(a: number, b: number) {
  if (a < 0 || b < 0) {
    throw new Error('Negative numbers are not allowed')
  }
  return a + b
}

// 统一错误日志
function logError(err: any) {
  console.error('[safe error]', err)
}

const safeAdd = safe(add, logError)

safeAdd(1, 2) // => 3
safeAdd(-1, 2) // => undefined
// 出错时不会抛出异常，而是返回 undefined，并调用 logError
```

### 高级场景：包装异步函数与回调

```typescript
import { safe } from '@esdora/kit'

// 异步函数：内部抛出错误时，将以 rejected Promise 的形式表现
async function fetchSum(a: number, b: number) {
  if (a < 0 || b < 0) {
    throw new Error('Negative numbers are not allowed')
  }
  return a + b
}

// 高阶函数：接收一个回调函数
const runWithCallback = (value: number, cb: (v: number) => number) => cb(value)

const errors: any[] = []
function errorHandler(err: any) {
  errors.push(err)
}

// safe 会同时包装目标函数本身以及作为参数传入的函数
const safeFetchSum = safe(fetchSum, errorHandler)
const safeRunner = safe(runWithCallback, errorHandler)

// 异步函数：返回的仍是 Promise，但不会以 reject 结束
const result1 = await safeFetchSum(1, 2)
result1 // => 3

const result2 = await safeFetchSum(-1, 2)
result2 // => undefined
errors[0] instanceof Error // => true

// 回调函数会被自动安全包装
const value = safeRunner(5, (x: number) => {
  if (x < 0) {
    throw new Error('Negative numbers are not allowed')
  }
  return x * 2
})
value // => 10
```

### 使用 createSafe 复用默认错误处理逻辑

```typescript
import { createSafe } from '@esdora/kit'

// 定义一个默认错误处理器
function defaultHandler(err: any) {
  console.error('[default]', err)
}

// 通过 createSafe 创建带默认错误处理器的包装器
const useSafe = createSafe(defaultHandler)

function fn(a: number, b: number) {
  if (a < 0 || b < 0) {
    throw new Error('Negative numbers are not allowed')
  }
  return a + b
}

// 使用默认错误处理器
const safeFn1 = useSafe(fn)
safeFn1(1, 2) // => 3
safeFn1(-1, 2) // => undefined

// 为单次调用提供更细粒度的 errorHandler
function customHandler(err: any, handler: (e: any) => void) {
  console.warn('[custom]', err)
  handler(err) // 可以显式委托给默认处理器
}

const safeFn2 = useSafe(fn, customHandler)
safeFn2(-1, 2) // => undefined
```

### 使用 \_JSON 安全处理 JSON.parse / JSON.stringify

```typescript
import { _JSON } from '@esdora/kit'

const textOk = '{"name": "John", "age": 30}'
const textBad = '{"name": "John", "age": }'

_JSON.parse(textOk) // => { name: 'John', age: 30 }
_JSON.parse(textBad) // => undefined

const objOk = { name: 'John', age: 30 }
const objCircular: any = { name: 'John' }
objCircular.self = objCircular

_JSON.stringify(objOk) // => '{"name":"John","age":30}'
_JSON.stringify(objCircular) // => undefined
```

## 签名与说明

### safe

#### 类型签名

```typescript
export function safe<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (err: any, handler?: (err: any) => void) => void,
): (...args: Parameters<T>) => ReturnType<T> | undefined
```

#### 参数说明

| 参数           | 类型                                               | 描述                                                                                        | 必需 |
| -------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---- |
| `fn`           | `T extends (...args: any[]) => any`                | 需要被安全包装的目标函数，可以是同步函数、异步函数或返回函数的高阶函数                      | 是   |
| `errorHandler` | `(err: any, handler?: (err: any) => void) => void` | 可选的错误处理函数；当目标函数或其递归包装的回调函数抛出异常、或返回的 Promise 被拒绝时调用 | 否   |

#### 返回值

- **类型**: `(...args: Parameters<T>) => ReturnType<T> | undefined`
- **说明**:
  - 返回一个新函数，其参数列表与原始函数 `fn` 完全一致
  - 在正常情况下返回值与原始函数一致
  - 当执行过程中抛出错误或 Promise 被拒绝时，返回 `undefined`，且（如有）调用 `errorHandler`
- **特殊情况**:
  - 如果传入的 `fn` 不是函数，将退化为一个始终返回 `undefined` 的函数，并在控制台输出警告
  - 当原始函数本身就合法返回 `undefined` 时，需要结合 `errorHandler` 执行情况来区分是否发生了错误

#### 泛型约束

- **`T`**：任意函数类型，`safe` 会保留其参数与返回值类型（仅在错误时扩展为 `undefined`）。

---

### createSafe

#### 类型签名

```typescript
export function createSafe(
  handler: (err: any) => void,
): <T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (err: any, handler: (err: any) => void) => void,
) => (...args: Parameters<T>) => ReturnType<T> | undefined
```

> 说明：实现中 `createSafe` 的返回类型标注为 `(...args: any[]) => any | undefined`，但实际返回的是上面所示的泛型安全包装器，用于更准确地表达其行为。

#### 参数说明

| 参数      | 类型                 | 描述                                                                           | 必需 |
| --------- | -------------------- | ------------------------------------------------------------------------------ | ---- |
| `handler` | `(err: any) => void` | 默认错误处理函数，在未提供自定义 `errorHandler` 或自定义处理器选择委托时被调用 | 是   |

#### 返回值

- **类型**: `<T extends (...args: any[]) => any>(fn: T, errorHandler?: (err: any, handler: (err: any) => void) => void) => (...args: Parameters<T>) => ReturnType<T> | undefined`
- **说明**:
  - 返回一个高阶函数，用于将任意目标函数包装为带错误处理能力的安全函数
  - 默认使用传入的 `handler` 作为错误处理器
  - 当调用时传入第二个参数 `errorHandler` 时，将使用该处理器，并以第二个参数的形式将默认 `handler` 传入，便于在自定义处理逻辑中选择性委托

#### 泛型约束

- **`T`**：待包装的目标函数类型，包装后参数与返回值类型保持一致，仅在错误时扩展为 `undefined`。

---

### \_JSON

#### 类型签名

```typescript
export const _JSON: {
  parse: (
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
  ) => any | undefined
  stringify: (
    value: any,
    replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null,
    space?: string | number,
  ) => string | undefined
}
```

#### 参数说明

`_JSON.parse`

| 参数      | 类型                                          | 描述                                         | 必需 |
| --------- | --------------------------------------------- | -------------------------------------------- | ---- |
| `text`    | `string`                                      | 需要被解析的 JSON 字符串                     | 是   |
| `reviver` | `(this: any, key: string, value: any) => any` | 可选的转换函数，用于在返回结果前对值进行转换 | 否   |

`_JSON.stringify`

| 参数       | 类型                                                                            | 描述                                                               | 必需 |
| ---------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---- |
| `value`    | `any`                                                                           | 需要序列化为 JSON 字符串的值                                       | 是   |
| `replacer` | `((this: any, key: string, value: any) => any) \| (number \| string)[] \| null` | 可选的替换函数或属性数组，用于控制哪些属性会被序列化以及如何序列化 | 否   |
| `space`    | `string \| number`                                                              | 用于美化输出的缩进字符串或缩进空格数                               | 否   |

#### 返回值

- **`_JSON.parse`**
  - **类型**: `any \| undefined`
  - **说明**:
    - 解析成功时返回解析后的 JavaScript 值
    - 当解析过程中发生错误（例如格式无效）时，返回 `undefined`
- **`_JSON.stringify`**
  - **类型**: `string \| undefined`
  - **说明**:
    - 序列化成功时返回 JSON 字符串
    - 当序列化过程中发生错误（例如存在循环引用）时，返回 `undefined`

## 注意事项与边界情况

### 输入边界

- `fn` 参数为 **非函数值**（如 `undefined`、`null`、数字、字符串、`Function` 构造器等）时：
  - `safe` 会在控制台输出告警信息，并使用一个总是返回 `undefined` 的默认函数替代
  - 返回的包装函数仍然可调用，且不会抛出异常
- 被包装函数可以是：
  - 普通同步函数（包括无参数函数）
  - 返回 Promise 的异步函数
  - 返回函数的高阶函数
  - 作为对象方法使用时，`this` 指向会被原样保留
- 当函数参数中存在 **函数类型参数** 时：
  - 这些参数会被递归地用 `safe` 包装
  - 非函数参数仍按原样传入，不会被修改
- 对于 `_JSON`：
  - `parse` 在传入非法 JSON 字符串时不会抛出异常，而是返回 `undefined`
  - `stringify` 在遇到循环引用等无法序列化的结构时不会抛出异常，而是返回 `undefined`

### 错误处理

- **异常类型**
  - 可捕获的异常类型包括：
    - 普通 `Error` 实例（例如 `new Error('...')`）
    - 任意非 `Error` 值（例如字符串、对象等使用 `throw 'error'` 抛出的情况）
    - 异步函数或 Promise 中的拒绝原因（包括 `Error` 与任意自定义类型）
    - `JSON.parse` 解析错误（通常为 `SyntaxError`）
    - `JSON.stringify` 在对象中存在循环引用等情况时抛出的 `TypeError`
  - `safe` 本身不会重新抛出这些异常，而是统一通过 `errorHandler` 回调或静默吞掉。
- **处理建议**
  - 对于需要区分"业务返回 `undefined`"与"发生异常导致 `undefined`"的场景，推荐始终提供 `errorHandler`：
    - 同步函数：在 `errorHandler` 中记录日志或转换为业务错误码
    - 异步函数：结合日志系统或监控系统记录错误
  - 使用 `createSafe` 时可以：
    - 在默认 `handler` 中实现统一日志、上报逻辑
    - 在单次调用中使用自定义 `errorHandler`，根据需要决定是否调用默认处理器
  - 需要注意的是：如果 `errorHandler` 自身抛出异常，该异常不会被 `safe` 捕获，将直接向上传播。

### 性能考虑

- **时间复杂度**
  - 每次调用由 `safe` 包装的函数时：
    - 参数预处理阶段对参数列表进行一次扫描，并对其中的函数参数进行包装，时间复杂度为 O(n)，其中 n 为参数个数
    - 对于返回 Promise 的函数，仅在 Promise 链上追加一次 `catch`，额外开销接近 O(1)
  - `_JSON.parse` 与 `_JSON.stringify` 的总体时间复杂度与原生 `JSON` 实现一致：
    - 解析和序列化的核心复杂度通常与输入字符串长度或对象属性数量成正比
- **空间复杂度**
  - `safe` 在每次调用时只会分配少量包装函数和中间变量，额外空间复杂度为 O(1)
  - 对于包含大量高阶函数或深层嵌套回调的场景：
    - 递归包装函数可能导致更多闭包实例，但通常仍远小于业务数据结构占用
- **优化建议**
  - 在性能敏感且调用频率极高的核心循环中，只在关键边界位置使用 `safe`，避免对每一个极短小的内部函数都重复包装
  - 对于 `_JSON`：
    - 大体量对象的序列化/反序列化性能主要由原生 `JSON` 决定
    - 使用 `_JSON` 带来的额外开销非常有限，可以视作安全保护层而非性能瓶颈

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/function/safe/index.ts)
