---
title: safe
description: "safe - Dora Pocket 中 @esdora/kit 库提供的错误处理工具函数，用于将任意函数包装为不会抛出未捕获异常的安全版本，并提供基于该机制的 createSafe 高阶函数和 _JSON 安全 JSON 工具。"
---

# safe

将任意函数包装为“安全版本”，在同步或异步执行过程中捕获错误并交给自定义错误处理器，同时提供基于该机制的 `createSafe` 高阶构造函数和 `_JSON` 安全 JSON 解析/序列化工具。

## 示例

### 基本用法：为普通函数添加安全错误处理

```typescript
import { safe } from '@esdora/kit'

function parseNumber(input: string) {
  if (input.trim() === '') {
    throw new Error('empty input')
  }
  return Number(input)
}

const safeParseNumber = safe(parseNumber, (err) => {
  console.error('parse error:', err.message)
})

safeParseNumber('42')
// => 42

safeParseNumber('')
// => undefined （错误被捕获并交给 errorHandler，不会抛出到调用栈外）
```

### 高级场景 1：安全包装包含回调和 Promise 的复杂流程

```typescript
import { createSafe, safe } from '@esdora/kit'

// 统一的错误上报函数
function reportError(err: any) {
  console.error('捕获到异常:', err)
}

// 基于 createSafe 创建安全包装工厂
const safeHandler = createSafe(reportError)

// 包装包含 Promise 的异步函数
const safeFetchJson = safeHandler(async (url: string) => {
  const res = await fetch(url)
  const text = await res.text()
  return JSON.parse(text)
})

// 包装包含回调参数的函数，safe 会自动对回调参数做安全包装
function doAsyncTask(task: (done: () => void) => void) {
  task(() => {
    throw new Error('任务完成回调中抛出的异常')
  })
}

const safeDoAsyncTask = safe(doAsyncTask, reportError)

await safeFetchJson('/api/profile')
// => 正常时返回解析后的 JSON 对象
// => 请求或解析失败时返回 Promise<undefined>，错误由 reportError 处理

safeDoAsyncTask((done) => {
  // 这个回调会被 safe 自动包装，内部异常不会导致未捕获错误
  done()
})
// => 即使回调中抛错，也只会触发 reportError，不会中断整个应用
```

### 高级场景 2：使用 \_JSON 安全处理不可信 JSON 数据

```typescript
import { _JSON } from '@esdora/kit'

const text = '{"name":"Alice"}'
const data = _JSON.parse(text)
// => { name: 'Alice' }

// 无效 JSON 字符串时不会抛出异常，而是返回 undefined
const invalid = _JSON.parse('invalid json')
// => undefined

// 正常序列化
const json = _JSON.stringify({ id: 1, name: 'Bob' })
// => '{"id":1,"name":"Bob"}'

// 原生 JSON.stringify 会在循环引用时抛出错误，这里会被 safe 捕获并返回 undefined
const circular: any = {}
circular.self = circular

const result = _JSON.stringify(circular)
// => undefined
```

## 签名与说明

### 类型签名

```typescript
export declare function safe<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (err: any, handler?: (err: any) => void) => void,
): (...args: Parameters<T>) => ReturnType<T> | undefined

export declare function createSafe(handler: (err: any) => void): (...args: any[]) => any | undefined

export declare const _JSON: {
  parse: (text: string, reviver?: (this: any, key: string, value: any) => any) => any
  stringify: (value: any, replacer?: (string | number)[], space?: string | number) => string
}
```

### 参数说明

#### `safe`

| 参数         | 类型                                               | 描述                                                                                      | 必需 |
| ------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- |
| fn           | `T extends (...args: any[]) => any`                | 需要被安全包装的目标函数，可以是同步函数或返回 Promise 的异步函数，也可以返回另一个函数。 | 是   |
| errorHandler | `(err: any, handler?: (err: any) => void) => void` | 可选的错误处理函数，用于接收捕获到的错误以及可选的下游处理器引用。                        | 否   |

#### `createSafe`

| 参数    | 类型                 | 描述                                                       | 必需 |
| ------- | -------------------- | ---------------------------------------------------------- | ---- |
| handler | `(err: any) => void` | 基础错误处理函数，用于统一处理由安全函数捕获到的所有错误。 | 是   |

> `createSafe` 返回的函数本身是一个高阶工厂，它的典型调用形式为：`safeHandler(fn, errorHandler?)`，其中：
>
> - `fn`: 需要包装的目标函数，其参数和返回值类型由 TypeScript 推断。
> - `errorHandler`: 可选的增强错误处理器，签名为 `(err, baseHandler) => void`，可在调用后继续委托给 `handler`。

#### `_JSON.parse`

| 参数    | 类型                                                       | 描述                                             | 必需 |
| ------- | ---------------------------------------------------------- | ------------------------------------------------ | ---- |
| text    | `string`                                                   | 需要解析的 JSON 字符串。                         | 是   |
| reviver | `(this: any, key: string, value: any) => any` _(可选参数)_ | 可选的转换函数，用于在返回之前转换解析得到的值。 | 否   |

#### `_JSON.stringify`

| 参数     | 类型                   | 描述                                                               | 必需 |
| -------- | ---------------------- | ------------------------------------------------------------------ | ---- |
| value    | `any`                  | 需要被序列化为 JSON 字符串的 JavaScript 值。                       | 是   |
| replacer | `(string \| number)[]` | 可选的属性键数组，用于选择性地序列化对象中的部分属性。             | 否   |
| space    | `string \| number`     | 可选的缩进字符或缩进空格数，用于格式化输出便于阅读的 JSON 字符串。 | 否   |

### 返回值

- **`safe`**
  - **类型**: `(...args: Parameters<T>) => ReturnType<T> | undefined`
  - **说明**: 返回一个新的安全函数，参数与 `fn` 完全一致；当执行成功时返回与原函数相同的结果，当发生错误时返回 `undefined`。
  - **特殊情况**:
    - 如果 `fn` 不是函数，会在控制台输出警告并使用一个始终返回 `undefined` 的默认函数替代。
    - 当 `fn` 返回 Promise 且 Promise 被拒绝时，返回值为一个始终 resolve 的 Promise，其值为 `undefined`。
    - 当 `fn` 返回一个函数时，返回的函数会被再次通过 `safe` 包装，实现多层安全防护。

- **`createSafe`**
  - **类型**: `(...args: any[]) => any | undefined`
  - **说明**: 返回一个高阶函数，用于创建带有统一错误处理逻辑的安全函数。典型调用为 `const safeHandler = createSafe(handler)`，随后通过 `safeHandler(fn, errorHandler?)` 获取具体的安全包装函数。
  - **特殊情况**:
    - 如果为 `safeHandler` 提供了自定义 `errorHandler`，则错误会先交给该处理器，并可以选择性地调用基础 `handler`。

- **`_JSON.parse`**
  - **类型**: `(text: string, reviver?: (this: any, key: string, value: any) => any) => any`
  - **说明**: 行为与原生 `JSON.parse` 类似，用于将 JSON 字符串安全地解析为 JavaScript 值。
  - **特殊情况**:
    - 当解析失败（例如传入非法 JSON 字符串）时，不会抛出异常，而是返回 `undefined`。

- **`_JSON.stringify`**
  - **类型**: `(value: any, replacer?: (string | number)[], space?: string | number) => string`
  - **说明**: 行为与原生 `JSON.stringify` 类似，用于安全地将 JavaScript 值序列化为 JSON 字符串。
  - **特殊情况**:
    - 当序列化失败（例如遇到循环引用导致原生 `JSON.stringify` 抛出错误）时，不会抛出异常，而是返回 `undefined`。

### 泛型约束（如适用）

- **`T`**（用于 `safe`）:
  - 约束为 `T extends (...args: any[]) => any`，即只能包装可调用的函数类型。
  - 返回的安全函数会自动继承 `T` 的参数列表和返回值类型，并在类型层面附加 `| undefined`，反映错误时的返回结果。

## 注意事项与边界情况

### 输入边界

- 当传入的 `fn` 不是函数（如 `null`、`undefined`、对象、数字等）时，`safe` 会发出控制台警告，并使用一个始终返回 `undefined` 的默认函数代替，避免运行时崩溃。
- `safe` 会检测传入参数中是否存在函数，如果存在，则会对这些函数参数递归调用 `safe` 进行包装，使得嵌套回调也具备相同的错误捕获能力。
- 对于返回函数的场景（例如返回另一个处理器或闭包），`safe` 会自动对返回的函数再次进行包装，形成“安全函数链”。
- `_JSON.parse` 和 `_JSON.stringify` 针对非法输入（非法 JSON 字符串、无法序列化的值等）会返回 `undefined` 而不是抛出异常，调用方需要显式对返回值进行判空检查。

### 错误处理

- **异常类型**:
  - `safe` 本身不会抛出由被包装函数产生的异常，这些异常会被捕获并传递给 `errorHandler`（如果提供）。
  - `_JSON` 系列方法内部使用 `safe` 包装原生 `JSON` 方法，因此也不会对解析/序列化错误抛出异常。
- **处理建议**:
  - 为关键逻辑传入合适的 `errorHandler` 或在 `createSafe` 中注入统一的 `handler`，用于集中上报日志、埋点或业务降级处理。
  - 需要注意的是，如果 `errorHandler` 自身抛出异常，则这些异常不会被 `safe` 再次捕获，可能会重新变成未处理错误，因此建议在错误处理器内部保持逻辑简单、稳健。
  - 对返回值包含 `undefined` 的场景（如 `_JSON.parse` 失败、异步 Promise 被拒绝）应显式进行判空处理。

### 性能考虑

- **时间复杂度**:
  - `safe` 在包装函数时主要增加了常数级别的开销（参数扫描、`try/catch` 包装和少量分支判断），不会改变原函数的算法复杂度。
  - 当存在函数类型的参数或返回值时，每一层额外的安全包装都会多一次函数调用和闭包分配，在高频调用场景中需要权衡。
- **空间复杂度**:
  - `safe` 会为每个被包装的函数创建一个新的闭包实例，在大量创建短生命周期安全函数的场景下可能带来一定的内存分配开销。
  - `_JSON` 将 `JSON.parse` 和 `JSON.stringify` 预先包装为安全版本，避免在每次调用时重复创建包装函数，从而控制额外开销。
- **优化建议**:
  - 对于极端性能敏感的热点路径，可以仅在开发或调试阶段使用 `safe`，在生产构建中选择性关闭或减少包装层级。
  - 避免在紧密循环中重复创建安全函数，优先在外层创建一次安全包装后复用。

### 兼容性

- `safe` 和 `_JSON` 依赖于原生的 `Promise`、`JSON.parse` 和 `JSON.stringify`，在现代浏览器和 Node.js 环境中均可正常工作。
- 对于不支持 `Promise` 的旧环境，需要通过 polyfill 提供 Promise 支持后再使用与异步函数相关的模式。
- 控制台警告使用 `console.warn` 输出，适用于浏览器和 Node.js，一般不会影响业务逻辑。

## 相关链接

- 源码: `packages/kit/src/function/safe/index.ts`
