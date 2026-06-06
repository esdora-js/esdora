---
title: cn
description: "@esdora/biz 的 cn 函数，基于 clsx 与 tailwind-merge 封装的原子类名合并工具"
---

# cn

基于 `clsx` 与 `tailwind-merge` 封装的原子类名合并工具。支持字符串、数组、对象、条件表达式等多种输入形式，并自动解决 Tailwind CSS 类名冲突。

## 示例

### 基本用法

```typescript
import { cn } from '@esdora/biz/atom-css'

cn('foo') // => 'foo'
cn('foo bar') // => 'foo bar'
cn('foo', 'bar') // => 'foo bar'
```

### 数组与对象类名

```typescript
import { cn } from '@esdora/biz/atom-css'

cn(['foo', 'bar']) // => 'foo bar'
cn({ foo: true, bar: false }) // => 'foo'
cn({ foo: true, bar: true }) // => 'foo bar'
```

### 条件类名

```typescript
import { cn } from '@esdora/biz/atom-css'

const isActive = true
const isDisabled = false

cn('base', isActive && 'active', isDisabled && 'disabled') // => 'base active'
```

### 混合类型输入

```typescript
import { cn } from '@esdora/biz/atom-css'

cn('foo', ['bar'], { baz: true }, false, 'qux') // => 'foo bar baz qux'
```

### Tailwind CSS 类名冲突解决

```typescript
import { cn } from '@esdora/biz/atom-css'

cn('px-2', 'px-4') // => 'px-4'
cn('text-sm', 'text-lg') // => 'text-lg'
cn('bg-red-500', 'bg-blue-500') // => 'bg-blue-500'
```

### 保留不冲突的类名

```typescript
import { cn } from '@esdora/biz/atom-css'

cn('px-2', 'py-4') // => 'px-2 py-4'
cn('text-sm', 'font-bold') // => 'text-sm font-bold'
```

### 响应式与伪类

```typescript
import { cn } from '@esdora/biz/atom-css'

cn('px-2', 'md:px-4') // => 'px-2 md:px-4'
cn('text-black', 'hover:text-blue-500') // => 'text-black hover:text-blue-500'
```

### 复杂场景

```typescript
import { cn } from '@esdora/biz/atom-css'

cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
cn('text-sm font-normal', 'text-lg') // => 'font-normal text-lg'
```

## 签名

```typescript
import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]): string
```

## 参数

| 参数     | 类型           | 描述                           | 必需 |
| -------- | -------------- | ------------------------------ | ---- |
| `inputs` | `ClassValue[]` | 可变参数，接收一个或多个类名值 | 否   |

`ClassValue` 类型支持以下形式：

- `string` — 普通类名字符串，如 `'foo bar'`
- `string[]` — 类名数组，如 `['foo', 'bar']`
- `Record<string, boolean>` — 条件对象，如 `{ foo: true, bar: false }`
- `boolean` / `undefined` / `null` — 会被忽略

## 返回值

- **类型**: `string`
- **说明**: 合并并去冲突后的类名字符串
- **特殊情况**:
  - 无输入或所有输入均为假值时，返回空字符串 `''`
  - 非 Tailwind 类名的重复字符串不会被自动去重（如 `cn('foo', 'foo')` 返回 `'foo foo'`）

## 注意事项

### 输入边界

- 空输入 `cn()` 返回空字符串 `''`
- `undefined`、`null`、`false`、`''`、`[]`、`{}` 等假值会被安全忽略，不会导致错误
- 嵌套数组会被扁平化处理，如 `cn(['foo', ['bar', 'baz']])` 返回 `'foo bar baz'`
- 对象中所有值为 `false` 时返回空字符串

### 错误处理

- 本函数不抛出异常，对任意输入都具有容错性
- 内部依赖 `clsx` 进行类型归一化，依赖 `tailwind-merge` 进行冲突解决

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/biz/src/atom-css/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/biz/src/atom-css/index.test.ts)
