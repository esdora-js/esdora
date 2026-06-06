---
title: isDigit
description: '@esdora/kit 的 isDigit 函数，检查字符串是否完全由数字字符（0-9）组成。'
---

# isDigit

检查字符串是否完全由数字字符（`0-9`）组成。

## 示例

### 基本用法

```typescript
import { isDigit } from '@esdora/kit'

isDigit('123') // => true
isDigit('0') // => true
isDigit('123a') // => false
isDigit('123a@') // => false
```

### 包含非数字字符

小数点、负号、空格或字母都会导致返回 `false`：

```typescript
import { isDigit } from '@esdora/kit'

isDigit('12.3') // => false
isDigit('-123') // => false
isDigit(' 123') // => false
isDigit('') // => false
```

## 签名

```typescript
function isDigit(str: string): boolean
```

## 参数

| 参数 | 类型     | 描述               | 必需 |
| ---- | -------- | ------------------ | ---- |
| str  | `string` | 要进行检查的字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果字符串完全由一个或多个数字字符组成，则返回 `true`，否则返回 `false`。
- **特殊情况**: 空字符串返回 `false`。

## 注意事项

### 输入边界

- 仅接受 `string` 类型输入，不进行任何类型转换。
- 空字符串返回 `false`。
- 包含任何非数字字符（字母、符号、空格等）均返回 `false`。

### 错误处理

- 本函数不抛出异常，所有输入均返回 `boolean`。
- 对于非字符串输入，行为取决于传入值的 `toString()` 结果或类型错误（TypeScript 编译期会阻止非法类型传入）。

## 相关链接

- [源码](https://github.com/esdora/esdora/blob/main/packages/kit/src/is/is-digit/index.ts)
- [单元测试](https://github.com/esdora/esdora/blob/main/packages/kit/src/is/is-digit/index.test.ts)
