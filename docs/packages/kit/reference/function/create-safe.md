---
title: createSafe
description: "@esdora/kit 的 createSafe 函数，创建可复用的自定义错误处理安全包装器"
---

# createSafe

创建一个高阶函数，用于将目标函数包装为带有错误处理逻辑的安全函数。适用于多处需要复用同一套错误处理逻辑的场景。

`createSafe` 返回的函数接收目标函数 `fn` 和可选的 `errorHandler`：优先使用传入的 `errorHandler`（会接收错误和原始 `handler`），否则使用创建时指定的默认 `handler`。

## 示例

### 基本用法

```typescript
import { createSafe } from '@esdora/kit'

// 创建一个统一用 console.error 处理错误的包装器
const safe = createSafe(console.error)

function strictAdd(a: number, b: number) {
  if (a < 0 || b < 0) {
    throw new Error('Negative numbers are not allowed')
  }
  return a + b
}

const safeStrictAdd = safe(strictAdd)

safeStrictAdd(1, 2) // => 3
safeStrictAdd(-1, 2) // => undefined，同时 console.error 输出错误
```

### 覆盖默认错误处理器

```typescript
import { createSafe } from '@esdora/kit'

const defaultHandler = (err: any) => console.error('默认处理:', err)
const safe = createSafe(defaultHandler)

function risky() {
  throw new Error('boom')
}

// 调用时传入自定义 errorHandler，会覆盖默认 handler
// 传入的 errorHandler 第二个参数接收原始的 defaultHandler
safe(risky, (err, handler) => {
  console.warn('自定义处理:', err)
  console.warn('原始 handler:', handler)
}) // => undefined
```

## 签名

```typescript
function createSafe(handler: (err: any) => void): (
  fn: T,
  errorHandler?: (err: any, handler: (err: any) => void) => void,
) => (...args: Parameters<T>) => ReturnType<T> | undefined
```

## 参数

### createSafe 参数

| 参数      | 类型                 | 描述             | 必需 |
| --------- | -------------------- | ---------------- | ---- |
| `handler` | `(err: any) => void` | 默认错误处理函数 | 是   |

### 返回的包装器函数参数

| 参数           | 类型                                              | 描述                                       | 必需 |
| -------------- | ------------------------------------------------- | ------------------------------------------ | ---- |
| `fn`           | `T`                                               | 需要安全包装的目标函数                     | 是   |
| `errorHandler` | `(err: any, handler: (err: any) => void) => void` | 可选的自定义错误处理器，覆盖默认 `handler` | 否   |

## 返回值

- **类型**: 一个接收 `fn` 和可选 `errorHandler` 的高阶函数
- **说明**: 该高阶函数返回值与 [`safe`](./safe.md) 一致——出错时返回 `undefined`，正常时返回原始函数的结果
- **特殊情况**: 若调用时提供 `errorHandler`，它会在捕获错误时被调用，并接收原始的 `handler` 作为第二参数

## 注意事项

### 错误处理优先级

- 调用包装器时传入 `errorHandler` → 使用 `errorHandler`（接收错误 + 原始 `handler`）
- 未传入 `errorHandler` → 使用 `createSafe` 创建时指定的默认 `handler`
- 底层均委托 [`safe`](./safe.md) 实现，因此同步/异步错误的捕获行为与 `safe` 一致

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/function/safe/create-safe.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/function/safe/create-safe.test.ts)
- [safe](./safe.md) — 基础安全包装函数
