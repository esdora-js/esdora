---
title: cn
description: "atom-css - Dora Pocket 中 @esdora/biz 库提供的原子 CSS 工具函数，用于合并类名并解决 Tailwind CSS 冲突。"
---

# cn

用于合并 CSS 类名并智能解决 Tailwind CSS 冲突的工具模块。结合 `clsx` 处理条件类名和 `tailwind-merge` 实现 Tailwind 特定的去重。

## 示例

### 基本用法

```typescript
import { cn } from '@esdora/biz/atom-css'

// 合并字符串类名
cn('foo') // => 'foo'
cn('foo', 'bar') // => 'foo bar'

// 条件类名
cn('base', true && 'active') // => 'base active'
cn({ foo: true, bar: false }) // => 'foo'
```

### Tailwind CSS 冲突解决

```typescript
import { cn } from '@esdora/biz/atom-css'

// 相同属性的类名冲突（后者覆盖前者）
cn('px-2', 'px-4') // => 'px-4'
cn('text-sm', 'text-lg') // => 'text-lg'
cn('bg-red-500', 'bg-blue-500') // => 'bg-blue-500'

// 不冲突的类名会保留
cn('px-2', 'py-4') // => 'px-2 py-4'
cn('text-sm', 'font-bold') // => 'text-sm font-bold'
```

### 响应式和伪类

```typescript
import { cn } from '@esdora/biz/atom-css'

// 响应式类名
cn('px-2', 'md:px-4') // => 'px-2 md:px-4'
cn('text-sm', 'lg:text-lg') // => 'text-sm lg:text-lg'

// 伪类
cn('text-black', 'hover:text-blue-500') // => 'text-black hover:text-blue-500'
cn('bg-white', 'focus:bg-gray-100') // => 'bg-white focus:bg-gray-100'
```

### 混合输入类型

```typescript
import { cn } from '@esdora/biz/atom-css'

// 字符串、数组、对象、布尔值混合
cn('foo', ['bar'], { baz: true }, false, 'qux') // => 'foo bar baz qux'

// 嵌套数组
cn(['foo', ['bar', 'baz']]) // => 'foo bar baz'
```

### 组件中使用

```tsx
import { cn } from '@esdora/biz/atom-css'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'lg'
  className?: string
}

function Button({ variant = 'primary', size = 'sm', className }: ButtonProps) {
  return (
    <button className={cn(
      'rounded font-medium',
      variant === 'primary' && 'bg-blue-500 text-white',
      variant === 'secondary' && 'bg-gray-200 text-gray-900',
      size === 'sm' && 'px-3 py-1 text-sm',
      size === 'lg' && 'px-6 py-3 text-lg',
      className // 允许外部覆盖样式
    )}
    />
  )
}
```

### 与 CVA 结合使用

```tsx
import { cn, cva } from '@esdora/biz/atom-css'

const buttonVariants = cva('rounded font-medium', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'sm',
  },
})

function Button({ variant, size, className, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

## 签名与说明

### 类型签名

```typescript
function cn(...inputs: ClassValue[]): string
```

### 参数说明

| 参数        | 类型           | 描述                                                              | 必需 |
| ----------- | -------------- | ----------------------------------------------------------------- | ---- |
| `...inputs` | `ClassValue[]` | 可变数量的类名值，支持字符串、对象、数组、布尔值、null、undefined | 否   |

### 返回值

- **类型**: `string`
- **说明**: 合并后的类名字符串，Tailwind CSS 冲突已解决
- **特殊情况**: 空输入返回空字符串 `''`

### 类型定义

```typescript
import type { ClassValue } from 'clsx'

// ClassValue 类型（来自 clsx）
type ClassValue
  = | ClassArray
    | ClassDictionary
    | string
    | number
    | null
    | boolean
    | undefined

type ClassDictionary = Record<string, any>
type ClassArray = ClassValue[]
```

## 注意事项与边界情况

### 输入边界

- **空输入**: `cn()` 或 `cn('')` 返回空字符串
- **null/undefined**: 会被忽略，不影响其他类名
- **空数组/对象**: 会被忽略
- **嵌套数组**: 支持任意深度的嵌套，会被展平处理
- **重复类名**: 非 Tailwind 类名不会自动去重（如 `cn('foo', 'foo')` 返回 `'foo foo'`）

```typescript
// 边界情况示例
cn() // => ''
cn('') // => ''
cn(undefined) // => ''
cn(null) // => ''
cn('foo', undefined, 'bar') // => 'foo bar'
cn([]) // => ''
cn({}) // => ''
cn({ foo: false }) // => ''
cn(['foo', ['bar', 'baz']]) // => 'foo bar baz'
```

### Tailwind CSS 冲突解决规则

- **相同属性冲突**: 后面的值覆盖前面的值（如 `px-2` 被 `px-4` 覆盖）
- **响应式修饰符**: 保留所有响应式类名（如 `md:`、`lg:`）
- **伪类修饰符**: 保留所有伪类（如 `hover:`、`focus:`）
- **不同属性**: 不冲突的工具类会全部保留

```typescript
// 冲突解决示例
cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-2 被移除)
cn('text-sm font-normal', 'text-lg') // => 'font-normal text-lg'
```

### 错误处理

- **异常类型**: 无（函数不会抛出异常）
- **处理建议**: 所有无效输入都会被安全忽略，无需 try-catch

### 性能考虑

- **时间复杂度**: O(n) - n 为输入类名的总数量
- **空间复杂度**: O(n) - 需要创建新的字符串
- **优化建议**:
  - 如果不需要 Tailwind 冲突解决，可以直接使用 `twJoin`（更快）
  - 避免在高频渲染的组件中进行复杂的类名计算

## 重导出的工具

### cva (class-variance-authority)

创建带有类型安全变体的组件样式。

```typescript
import { cva } from '@esdora/biz/atom-css'

const button = cva('base-button', {
  variants: {
    intent: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
    },
    size: {
      small: 'btn-sm',
      large: 'btn-lg',
    },
  },
  defaultVariants: {
    intent: 'primary',
  },
})

button({ intent: 'primary', size: 'small' })
// => 'base-button btn-primary btn-sm'

button()
// => 'base-button btn-primary' (使用默认值)
```

### clsx (命名空间)

通过命名空间访问 `clsx` 工具。

```typescript
import { clsx } from '@esdora/biz/atom-css'

clsx.clsx('foo', 'bar') // => 'foo bar'
clsx.clsx({ foo: true, bar: false }) // => 'foo'

// 类型使用
const value: clsx.ClassValue = 'foo'
```

### twMerge

合并 Tailwind CSS 类名并解决冲突。

```typescript
import { twMerge } from '@esdora/biz/atom-css'

twMerge('px-2', 'px-4') // => 'px-4'
twMerge('text-sm', 'text-lg') // => 'text-lg'
```

### twJoin

连接类名，不进行冲突解决（性能更好）。

```typescript
import { twJoin } from '@esdora/biz/atom-css'

twJoin('foo', 'bar') // => 'foo bar'
twJoin('foo', undefined, 'bar') // => 'foo bar'
```

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/biz/src/atom-css/index.ts)
- [clsx](https://github.com/lukeed/clsx) - 条件类名工具
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Tailwind CSS 类名合并器
- [class-variance-authority](https://github.com/joe-bell/cva) - 组件变体系统
