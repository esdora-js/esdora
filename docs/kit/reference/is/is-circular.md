# isCircular

检查一个值（如对象或数组）中是否存在循环引用，并可选择性地返回第一个被发现的循环路径。

## 示例

### 基本用法

此函数可以检测各种形式的循环引用。

```typescript
import { isCircular } from '@esdora/kit'

// 1. 直接自引用
const obj1 = { name: 'A' }
obj1.self = obj1
isCircular(obj1)
// => true

// 2. 相互引用
const objA = {}
const objB = { ref: objA }
objA.ref = objB
isCircular(objA)
// => true

// 3. 数组中的循环引用
const arr = [1, 2]
arr.push(arr)
isCircular(arr)
// => true

// 4. 无循环的普通对象
const normalObj = { a: { b: { c: 1 } } }
isCircular(normalObj)
// => false
```

### 获取循环路径

通过在 `options` 中设置 `getPath: true`，函数会在找到循环时返回其路径，否则返回 `null`。

```typescript
import { isCircular } from '@esdora/kit'

const user = {
  name: 'Alice',
  profile: {
    details: {
      avatar: 'url'
    }
  }
}
// 创建一个从深层节点指回上层节点的循环
user.profile.details.user = user.profile

const path = isCircular(user, { getPath: true })
// => ['profile', 'details', 'user', "[Circular Reference -> 'profile']"]

// 无循环时返回 null
const normalUser = { name: 'Bob' }
const noPath = isCircular(normalUser, { getPath: true })
// => null
```

## 签名与说明

```typescript
/**
 * 检查一个值中是否存在循环引用。
 *
 * 本函数通过深度优先遍历来探索对象或数组的结构。它设计稳健，
 * 能够正确处理共享节点，并且可以选择性地返回第一个被发现的循环路径。
 *
 * @param value 要检查的任何 JavaScript 值。
 * @param options 可选的配置对象。
 * @param options.getPath 如果为 `true`，则在找到循环时返回路径数组；否则返回 `null`。
 *                        如果为 `false` 或未提供（默认），则只返回 `boolean` 值。
 * @returns 根据 `options.getPath` 的值：
 *          - `boolean`: 表示是否存在循环引用。
 *          - `string[] | null`: 如果找到循环，返回其路径数组；否则返回 `null`。
 */
export function isCircular(value: unknown, options: { getPath: true }): string[] | null
export function isCircular(value: unknown, options?: { getPath: false }): boolean
export function isCircular(value: unknown): boolean
```

## 注意事项与边界情况

- **关于非对象值**: 如果传入的值不是一个可被遍历的对象（例如 `null`, `string`, `number` 等原始类型），函数将直接返回 `false`（或 `null` 当 `getPath: true` 时）。
- **关于特殊对象**: 函数可以正确处理 `Date`, `RegExp`, `Function` 等内置对象类型，并将它们视为遍历的终点（叶子节点），不会深入其内部结构。
- **关于共享引用**: 函数能够正确区分“共享引用”（一个节点被多处引用，但未形成环）和“循环引用”。共享引用不会被误判为循环。
- **返回的路径格式**: 当 `getPath: true` 且找到循环时，返回的路径数组最后一项会是一个特殊的字符串，如 `[Circular Reference -> 'path.to.node']`，用以指明循环指向的节点路径。如果指向根对象，则路径为 `root`。

## 相关链接

- **源码**: [`src/validate/is-circular/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/validate/is-circular/index.ts)
