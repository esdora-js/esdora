---
title: safe
---

# safe

`safe` 是一个高阶函数，用于为任意函数（包括同步、异步、参数为函数、高阶函数等）提供安全的错误捕获包装。它能防止异常导致程序崩溃，并允许自定义错误处理逻辑，极大提升代码的健壮性和开发体验。

## 示例

### 基础用法

```ts
import { safe } from '@esdora/kit'

const fn = (a: number, b: number) => a + b
const safeFn = safe(fn)

console.log(safeFn(1, 2)) // 3
console.log(safeFn(null as any, 2)) // NaN（原函数行为）
```

### 捕获异常

```ts
function fnError(a: number) {
  if (a < 0)
    throw new Error('参数不能为负数')
  return a
}
const safeFn = safe(fnError)

console.log(safeFn(-1)) // undefined
```

### 自定义错误处理

```ts
function fnError() {
  throw new Error('出错了')
}
const safeFn = safe(fnError, (err) => {
  console.error('捕获到错误:', err)
})

safeFn() // 控制台输出：捕获到错误: 出错了
```

### 支持异步函数

```ts
async function asyncFn(x: number) {
  if (x < 0)
    throw new Error('负数不允许')
  return x * 2
}
const safeAsyncFn = safe(asyncFn)

safeAsyncFn(-1).then((res) => {
  console.log(res) // undefined
})
```

### 高阶函数与参数为函数

所有参数为函数的，也会自动递归包裹：

```ts
const highOrder = (fn: (x: number) => number) => fn(1)
const safeHighOrder = safe(highOrder)

safeHighOrder((x) => {
  throw new Error('error')
}) // undefined
```

### createSafe 用法

为一组函数统一指定默认错误处理：

```ts
import { createSafe } from '@esdora/kit'

const safe = createSafe((err) => {
  alert(`发生错误: ${err}`)
})

function fn(x: number) {
  if (x < 0)
    throw new Error('bad')
}
const safeFn = safe(fn)

safeFn(-1) // 弹窗提示
```

### 安全 JSON 工具

```ts
import { _JSON } from '@esdora/kit'

const obj = _JSON.parse('{"a":1}') // { a: 1 }
const fail = _JSON.parse('{a:1}') // undefined

const str = _JSON.stringify({ a: 1 }) // '{"a":1}'
const circular: any = {}
circular.self = circular
const failStr = _JSON.stringify(circular) // undefined
```

## 签名与说明

```ts
function safe<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (err: any, handler?: (err: any) => void) => void,
): (...args: Parameters<T>) => ReturnType<T> | undefined
```

- **参数**
  - `fn`: 需要安全包装的目标函数。支持同步、异步、高阶、参数为函数等多种类型。
  - `errorHandler`: 可选，错误处理回调。接收异常对象和可选的默认处理器。
- **返回值**
  - 返回一个新函数，参数与原函数一致，出错时返回 `undefined`，否则返回原函数结果。

### 相关辅助工具

- `createSafe(handler)`: 生成带默认错误处理的安全包装器，便于批量函数安全化。
- `_JSON.parse` / `_JSON.stringify`: 安全的 JSON 解析与序列化，异常时返回 `undefined`。

## 注意事项与边界情况

- 所有同步/异步异常都会被捕获，返回 `undefined`。
- 所有参数为函数的会自动递归包裹，返回值为函数也会递归包裹。
- 不会处理业务逻辑错误，只捕获异常。
- 保持原有 `this` 行为，适用于对象方法。
- 支持抛出非 Error 类型的异常（如字符串等）。
- 对于异步函数，异常会通过 Promise.catch 捕获并处理。
- 如果传入的 `fn` 不是函数，则返回一个始终返回 `undefined` 的空函数。

## 相关链接

- 源码: [`packages/kit/src/function/safe/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/function/safe/index.ts)
