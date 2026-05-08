---
title: isAlpha
description: "@esdora/kit 的 isAlpha 函数，检查字符串是否完全由英文字母（a-z, A-Z）组成。"
---

# isAlpha

检查字符串是否完全由英文字母（a-z, A-Z）组成。

## 示例

### 基本用法

```typescript
import { isAlpha } from '@esdora/kit'

isAlpha('abc') // => true
isAlpha('123') // => false
isAlpha('123a') // => false
isAlpha('123a@') // => false
```

### 边界情况

```typescript
import { isAlpha } from '@esdora/kit'

// 空字符串
isAlpha('') // => false

// 包含空格
isAlpha('hello world') // => false

// 包含连字符
isAlpha('hello-world') // => false

// 大小写混合
isAlpha('HelloWorld') // => true
```

## 签名

```typescript
function isAlpha(str: string): boolean
```

## 参数

| 参数 | 类型     | 描述               | 必需 |
| ---- | -------- | ------------------ | ---- |
| str  | `string` | 要进行检查的字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果字符串完全由一个或多个英文字母组成，则返回 `true`，否则返回 `false`。
- **特殊情况**:
  - 空字符串返回 `false`
  - 包含任何非字母字符（数字、空格、标点符号、特殊字符等）均返回 `false`
  - 大小写不敏感，大写和小写字母均视为有效

## 注意事项

### 输入边界

- 仅接受 `string` 类型输入
- 空字符串会被视为无效，返回 `false`
- 任何非字母字符（包括数字、空格、标点符号、特殊字符、Unicode 字母等）都会导致返回 `false`
- 该函数仅识别标准的拉丁字母（a-z, A-Z），不包含其他语言字母（如中文、日文、希腊文等）

### 错误处理

- 该函数不抛出异常
- 对于非字符串输入，行为取决于传入值的 `String.prototype` 方法表现

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-alpha/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-alpha/index.test.ts)
