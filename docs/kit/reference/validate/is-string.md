---
title: isString
---

# isString

验证值是否为字符串类型。

## 基本用法

```typescript
import { isString } from '@esdora/kit'

isString('hello') // true
isString('') // true
isString(123) // false
isString(null) // false
isString(undefined) // false
```

## 参数

- `value: any` - 要验证的值

## 返回值

- `boolean` - 如果是字符串返回 `true`，否则返回 `false`
