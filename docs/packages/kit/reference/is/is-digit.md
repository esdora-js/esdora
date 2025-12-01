---
title: isDigit
description: "isDigit - Dora Pocket 中 @esdora/kit 库提供的验证工具函数，用于检查字符串是否完全由数字字符（0-9）组成。"
---

# isDigit

检查字符串是否完全由 0-9 数字字符组成，不允许小数点、负号或其他非数字字符。

## 示例

### 基本用法

```typescript
import { isDigit } from '@esdora/kit'

// 完全由数字字符组成
isDigit('123') // => true
isDigit('0') // => true

// 包含非数字字符时返回 false
isDigit('123a') // => false
isDigit('12.3') // => false
isDigit('-123') // => false

// 空字符串也视为无效
isDigit('') // => false
```

### 表单输入校验

```typescript
import { isDigit } from '@esdora/kit'

const ageInput = '18'
isDigit(ageInput) // => true

const invalidAgeInput = '18岁'
isDigit(invalidAgeInput) // => false
```

### 过滤列表中的数字字符串

```typescript
import { isDigit } from '@esdora/kit'

const values = ['123', 'abc', '42', '12.3', '-5']
const numericStrings = values.filter(isDigit)
// => ['123', '42']
```

## 签名与说明

### 类型签名

```typescript
function isDigit(str: string): boolean
```

### 参数说明

| 参数 | 类型     | 描述                                                              | 必需 |
| ---- | -------- | ----------------------------------------------------------------- | ---- |
| str  | `string` | 要检查的字符串，仅当字符串由一个或多个 0-9 数字字符组成时视为有效 | 是   |

### 返回值

- **类型**: `boolean`
- **说明**:
  - 当字符串完全由一个或多个数字字符（0-9）组成时，返回 `true`
  - 只要包含任意非数字字符（如字母、小数点、负号、空格等）就返回 `false`
- **特殊情况**:
  - 空字符串返回 `false`
  - 仅包含空白字符（空格、制表符等）的字符串返回 `false`

## 注意事项与边界情况

### 输入边界

- 仅对字符串进行校验，参数类型在 TypeScript 中被限定为 `string`
- 对空字符串 `''` 返回 `false`
- 对仅包含空白字符（如 `'   '`）的字符串返回 `false`
- 对包含小数点、小数分隔符或负号（如 `'12.3'`、`'-123'`）的字符串返回 `false`
- 对混合字母、符号或其他非数字字符（如 `'123a'`、`'123a@'`）的字符串返回 `false`

### 错误处理

- **异常类型**: 函数本身不会主动抛出异常，所有输入都会被安全按字符串进行校验
- **处理建议**: 在业务代码中仍建议通过类型系统或显式检查保证传入参数为字符串

### 性能考虑

- **时间复杂度**: O(n) - 其中 n 为字符串长度，基于正则表达式单次匹配
- **空间复杂度**: O(1) - 使用预编译的正则常量 `REGEX_DIGIT`，不分配额外与输入长度相关的内存
- **优化建议**:
  - 适用于高频次的简单数字字符串校验场景，如表单输入实时验证
  - 对于需要解析为数值的场景，可以先使用 `isDigit` 过滤，再使用 `Number` 或 `parseInt` 转换

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-digit/index.ts)
