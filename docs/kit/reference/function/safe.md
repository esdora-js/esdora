---
title: safe
---

# safe

为函数提供安全的错误捕获包装，避免同步或异步异常导致程序崩溃，并可自定义错误处理逻辑。

## 导出内容

- `safe(fn, errorHandler?)`：安全包装任意函数
- `createSafe(handler)`：生成带默认错误处理的安全包装器
- `_JSON.parse` / `_JSON.stringify`：安全的 JSON 解析与序列化

---

## 使用方法

### 1. 基础用法

```ts
import { safe } from '@esdora/kit'

const fn = (a: number, b: number) => a + b
const safeFn = safe(fn)

console.log(safeFn(1, 2)) // 3
console.log(safeFn(null as any, 2)) // NaN（原函数行为）
```

### 2. 捕获异常

```ts
function fnError(a: number) {
  if (a < 0)
    throw new Error('参数不能为负数')
  return a
}
const safeFn = safe(fnError)

console.log(safeFn(-1)) // undefined
```

### 3. 自定义错误处理

```ts
function fnError() {
  // eslint-disable-next-line no-throw-literal
  throw '出错了'
}
const safeFn = safe(fnError, (err) => {
  console.error('捕获到错误:', err)
})

safeFn() // 控制台输出：捕获到错误: 出错了
```

### 4. 支持异步函数

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

### 5. 高阶函数与参数为函数

所有参数为函数的，也会自动递归包裹：

```ts
const highOrder = (fn: (x: number) => number) => fn(1)
const safeHighOrder = safe(highOrder)

safeHighOrder((x) => {
  // eslint-disable-next-line no-throw-literal
  throw 'error'
}) // undefined
```

### 6. createSafe 用法

为一组函数统一指定默认错误处理：

```ts
import { createSafe } from '@esdora/kit'

const safe = createSafe((err) => {
  // 统一错误处理
  alert(`发生错误: ${err}`)
})

function fn(x: number) {
  if (x < 0)
    // eslint-disable-next-line no-throw-literal
    throw 'bad'
}
const safeFn = safe(fn)

safeFn(-1) // 弹窗提示
```

### 7. 安全 JSON 工具

```ts
import { _JSON } from '@esdora/kit'

const obj = _JSON.parse('{"a":1}') // { a: 1 }
const fail = _JSON.parse('{a:1}') // undefined

const str = _JSON.stringify({ a: 1 }) // '{"a":1}'
const circular: any = {}
circular.self = circular
const failStr = _JSON.stringify(circular) // undefined
```

---

## 注意事项

- 所有同步/异步异常都会被捕获，返回 `undefined`。
- 所有参数为函数的会自动递归包裹，返回值为函数也会递归包裹。
- 不会处理业务逻辑错误，只捕获异常。
- 保持原有 `this` 行为。

---

## 类型定义

```ts
function safe<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (err: any) => void,
): (...args: Parameters<T>) => ReturnType<T> | undefined
```

---
