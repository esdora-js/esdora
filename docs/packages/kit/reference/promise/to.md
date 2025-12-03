---
title: to
description: "to - Dora Pocket 中 @esdora/kit 库提供的 Promise 错误处理工具函数，用于将 Promise 结果转换为 [error, data] 元组并消除显式 try/catch。"
---

# to

将任意 `Promise` 的结果转换为 `[error, data]` 元组，方便在 `async/await` 流程中以更加直观的方式处理成功与失败。

## 示例

### 基本用法：处理成功结果

```typescript
import { to } from '@esdora/kit'

async function fetchUser() {
  const promise = Promise.resolve({ id: 1, name: 'Alice' })
  const [error, user] = await to(promise)

  if (error) {
    return null
  }

  return user
}

const user = await fetchUser()
// => { id: 1, name: 'Alice' }
```

### 捕获错误而不抛出异常

```typescript
import { to } from '@esdora/kit'

async function fetchWithError() {
  // eslint-disable-next-line prefer-promise-reject-errors
  const promise = Promise.reject('Network Error')
  const [error, data] = await to(promise)

  if (error) {
    console.error(error)
    // => 'Network Error'
    return null
  }

  return data
}

await fetchWithError()
// => null
```

### 为错误附加上下文信息

```typescript
import { to } from '@esdora/kit'

async function fetchWithContext() {
  // eslint-disable-next-line prefer-promise-reject-errors
  const promise = Promise.reject({ code: 404, message: 'Not Found' })
  const [error] = await to<{ name: string }, { code: number, message: string, requestId: string }>(
    promise as unknown as Promise<{ name: string }>,
    { requestId: 'xyz-123' },
  )

  return error
}

const error = await fetchWithContext()
// => { code: 404, message: 'Not Found', requestId: 'xyz-123' }
```

## 签名与说明

### 类型签名

```typescript
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]>
```

### 参数说明

| 参数     | 类型                  | 描述                                                      | 必需 |
| -------- | --------------------- | --------------------------------------------------------- | ---- |
| promise  | `Promise<T>`          | 需要被包装的 Promise，`T` 为其成功结果的类型              | 是   |
| errorExt | `object \| undefined` | 可选的扩展信息对象，当 Promise 被拒绝时会合并到错误对象上 | 否   |

### 返回值

- **类型**: `Promise<[U, undefined] | [null, T]>`
- **说明**:
  - 返回一个**永远不会 reject** 的 Promise
  - 当输入 Promise 成功时，解析为 `[null, data]`
  - 当输入 Promise 失败时，解析为 `[error, undefined]`
- **特殊情况**:
  - 当传入 `errorExt` 且 Promise 被拒绝时，最终的错误值为 `Object.assign({}, err, errorExt)`
  - 如果错误值本身不是对象（例如字符串），扩展属性会按 JavaScript 的对象合并规则尝试添加

### 泛型约束（如适用）

- **`T`**: 表示 Promise 成功解析时的数据类型，例如 `number`、`User` 等。
- **`U`**: 表示错误类型，默认是 `Error`；当你在项目中使用自定义错误类型时，可以显式指定。

## 注意事项与边界情况

### 输入边界

- `promise` 参数应为一个合法的 `Promise` 实例；传入其它值会在运行时导致类型错误。
- 不支持传入非 Promise 值（例如普通对象或函数），这类使用方式会违背 TypeScript 类型签名。
- `errorExt` 建议为普通对象，便于通过 `Object.assign` 正确合并属性。

### 错误处理

- `to` 自身不会抛出异常，而是将错误封装在返回的元组中：
  - 成功：`[null, data]`
  - 失败：`[error, undefined]`
- 推荐在业务代码中**始终检查元组的第一个元素**来判断是否出错，而不是依赖 `try...catch`。
- 当你需要增加请求上下文信息（如 `requestId`、`traceId`、接口名称等）时，可以通过 `errorExt` 提供，以便在日志或监控中追踪。

### 性能考虑

- **时间复杂度**: O(1)，仅在原有 Promise 上追加一次 `then`/`catch` 链。
- **空间复杂度**: O(1)，只创建一个包含两个元素的元组和极少量中间变量。
- **优化建议**:
  - 在性能敏感的热路径中，`to` 的开销可以认为与手写 `try...catch` 接近。
  - 更适合作为统一错误处理风格的工具，而不是解决极端性能问题的手段。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/promise/to/index.ts)
- [参考实现：await-to-js](https://github.com/scopsy/await-to-js)
