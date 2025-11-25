---
title: isCircular
description: "isCircular - Dora Pocket 中 @esdora/kit 库提供的验证工具函数，用于检测对象或数组中是否存在循环引用，并可选择性地返回循环引用路径。"
---

# isCircular

检测对象或数组中是否存在循环引用，并可选择性地返回第一个检测到的循环引用路径。

## 示例

### 基本用法

```typescript
import { isCircular } from '@esdora/kit'

// 检测简单对象
const obj1 = { a: 1, b: { c: 2 } }
isCircular(obj1) // => false

// 检测循环引用
const obj2: any = { a: 1 }
obj2.self = obj2
isCircular(obj2) // => true

// 检测复杂的相互引用
const objA: any = { name: 'A' }
const objB: any = { name: 'B' }
objA.ref = objB
objB.ref = objA
isCircular(objA) // => true
```

### 获取循环引用路径

```typescript
import { isCircular } from '@esdora/kit'

// 获取直接自引用的路径
const obj: any = { a: 1 }
obj.self = obj
isCircular(obj, { getPath: true }) // => ['self', "[Circular Reference -> 'root']"]

// 获取深层循环引用的路径
const deep: any = {
  a: {
    b: {
      c: {}
    }
  }
}
deep.a.b.c.ref = deep
isCircular(deep, { getPath: true }) // => ['a', 'b', 'c', 'ref', "[Circular Reference -> 'root']"]

// 无循环引用时返回 null
const normal = { a: 1, b: { c: 2 } }
isCircular(normal, { getPath: true }) // => null
```

### 数组中的循环检测

```typescript
import { isCircular } from '@esdora/kit'

// 检测数组中的循环引用
const arr: any = [1, { nested: {} }]
arr[1].nested.ref = arr
isCircular(arr) // => true

const path = isCircular(arr, { getPath: true })
// => ['1', 'nested', 'ref', "[Circular Reference -> 'root']"]
```

## 签名与说明

### 类型签名

```typescript
function isCircular(value: unknown, options: { getPath: true }): string[] | null
function isCircular(value: unknown, options?: { getPath: false }): boolean
function isCircular(value: unknown): boolean
```

### 参数说明

| 参数            | 类型                 | 描述                                                                                   | 必需 |
| --------------- | -------------------- | -------------------------------------------------------------------------------------- | ---- |
| value           | unknown              | 要检查的值，可以是任何 JavaScript 类型                                                 | 是   |
| options         | { getPath: boolean } | 可选的配置对象，用于控制函数的行为和返回类型                                           | 否   |
| options.getPath | boolean              | 决定函数的返回类型：true 启用路径查找模式，false 或未提供使用布尔检查模式（默认值）   | 否   |

### 返回值

- **类型**: `boolean | string[] | null`（取决于 `options.getPath` 参数）
- **说明**:
  - 当 `getPath` 为 `true` 时：返回表示循环路径的字符串数组，如果不存在循环则返回 `null`
  - 当 `getPath` 为 `false` 或未提供时：返回布尔值，`true` 表示存在循环引用，`false` 表示不存在
- **特殊情况**:
  - 基础类型（null、undefined、string、number、boolean、symbol、bigint）始终返回 `false` 或 `null`（取决于模式）
  - 空对象和空数组返回 `false` 或 `null`
  - 路径数组的最后一个元素是特殊字符串，格式为 `[Circular Reference -> 'path']`，指明循环指向的节点路径

## 注意事项与边界情况

### 输入边界

- **基础类型**: 所有基础类型（null、undefined、string、number、boolean、symbol、bigint）都会被快速识别并返回 `false`（或 `null` 在路径模式下）
- **空对象和空数组**: 空对象 `{}` 和空数组 `[]` 返回 `false`，因为它们不包含循环引用
- **深层嵌套**: 函数能正确处理任意深度的嵌套对象和数组，测试覆盖深度达 100 层
- **特殊对象类型**: Date、RegExp、Function 等特殊对象类型会被正确处理，不会误报循环引用
- **多条循环路径**: 当对象中存在多条可能的循环路径时，路径查找模式返回第一个找到的路径（按 `Object.entries` 的遍历顺序）
- **共享引用**: 函数能够正确区分"共享引用"（一个节点被多处引用但未形成环）和"循环引用"，共享引用不会被误判

### 错误处理

- **异常类型**: 此函数不会抛出异常，所有输入都会被安全处理
- **处理建议**: 无需使用 try-catch 包裹，函数内部已处理所有边界情况

### 性能考虑

- **时间复杂度**:
  - 布尔检查模式：O(n)，其中 n 是对象中的属性总数（包括嵌套对象的属性）
  - 路径查找模式：O(n)，相同的时间复杂度，但因需要记录路径，实际运行时间略长
- **空间复杂度**:
  - 布尔检查模式：O(m)，其中 m 是递归深度（使用 WeakSet 仅存储对象引用）
  - 路径查找模式：O(m + p)，其中 p 是路径长度（使用 Map 存储路径信息）
- **优化建议**:
  - 如果只需要判断是否存在循环引用，使用默认的布尔检查模式（性能更好，内存占用更少）
  - 路径查找模式适合调试场景，帮助定位循环引用的具体位置
  - 对于大型对象（深度 > 100 或属性数量 > 1000），两种模式的性能差异会更明显
  - 函数使用 WeakSet（布尔模式）和 Map（路径模式）来避免内存泄漏

### 兼容性

- **环境要求**: ES2015+（需要 WeakSet 和 Map 支持）
- **浏览器**: 所有现代浏览器（Chrome、Firefox、Safari、Edge）
- **Node.js**: 6.0+
- **已知限制**: 不支持 ES5 及更早的 JavaScript 环境

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-circular/index.ts)
