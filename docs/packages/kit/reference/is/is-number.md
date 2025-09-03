---
title: isNumber
---

# isNumber

验证值是否为有效的数字。

## 基本用法

```typescript
import { isNumber } from '@esdora/kit'

isNumber(123) // true
isNumber('123') // true
isNumber('123.45') // true
isNumber('abc') // false
isNumber(null) // false
isNumber(undefined) // false
```

## 参数

- `value: any` - 要验证的值

## 返回值

- `boolean` - 如果是有效的数字返回 `true`，否则返回 `false`

## 特殊情况

```typescript
isNumber(Number.NaN) // false
isNumber(Infinity) // true
isNumber(-Infinity) // true
isNumber('') // false
isNumber(' ') // false
```
