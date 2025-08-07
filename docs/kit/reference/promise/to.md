---
title: to
---

# to

<!-- 1. 简介：一句话核心功能描述 -->

将 Promise 的结果转换为一个 `[error, data]` 元组，以便在 `async/await` 中进行无 `try/catch` 的优雅错误处理。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

当 Promise 成功时，返回 `[null, data]`。

```typescript
async function fetchUser() {
  const promise = Promise.resolve({ id: 1, name: 'Alice' })
  const [error, user] = await to(promise)

  if (error) {
    // 这段代码不会执行
    return
  }

  return user
}

const user = await fetchUser()
// => { id: 1, name: 'Alice' }
```

### 处理错误

当 Promise 失败时，返回 `[error, undefined]`。

```typescript
async function fetchWithError() {
  // eslint-disable-next-line prefer-promise-reject-errors
  const promise = Promise.reject('Network Error')
  const [error, data] = await to(promise)

  if (error) {
    console.error(error) // => 'Network Error'
    return null
  }

  // 这段代码不会执行
  return data
}

await fetchWithError()
// => null
```

### 附加错误信息

在捕获错误时，可以附加额外的上下文信息到错误对象上。

```typescript
async function fetchWithContext() {
  // eslint-disable-next-line prefer-promise-reject-errors
  const promise = Promise.reject({ code: 404, message: 'Not Found' })
  const [error, data] = await to(promise, { requestId: 'xyz-123' })

  return error
}

const error = await fetchWithContext()
// => { code: 404, message: 'Not Found', requestId: 'xyz-123' }
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 将 Promise 转换为一个元组，包含错误和数据。
 * 这种模式源于 Go 语言的错误处理方式，允许在不使用 try-catch 块的情况下处理 async/await 操作的可能失败。
 *
 * @template T 成功解决时数据的类型。
 * @template U 失败时错误的类型，默认为 Error。
 * @param {Promise<T>} promise 要处理的 Promise 实例。
 * @param {object} [errorExt] 当 Promise 失败时，要附加到错误对象上的额外属性。
 * @returns {Promise<[U, undefined] | [null, T]>}
 *          一个总是会成功解决的 Promise。
 *          - 如果输入的 Promise 成功，它会解决为 `[null, T]`。
 *          - 如果输入的 Promise 失败，它会解决为 `[U, undefined]`。
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]>
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **总是解决**: `to` 函数本身返回的 Promise **总是会解决 (resolve)**，绝不会拒绝 (reject)。它将输入 Promise 的拒绝状态转化为元组中的一个值。
- **成功情况**: 当输入的 Promise 成功解决时，返回的元组第一项为 `null`，第二项为 Promise 的解决值。
- **失败情况**: 当输入的 Promise 被拒绝时，返回的元组第一项为拒绝的原因（错误对象），第二项为 `undefined`。
- **错误扩展**: 提供的 `errorExt` 对象仅在输入 Promise 被拒绝时生效，它的属性会被合并到最终的错误对象中。如果 Promise 成功，`errorExt` 将被忽略。

<!-- 5. 相关链接：提供相关链接 -->

## 相关链接

- **源码**: [`src/async/to/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/promise/to/index.ts)
- 该方法引用自：[await-to-js](https://github.com/scopsy/await-to-js)
