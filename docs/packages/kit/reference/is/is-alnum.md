---
title: isAlnum
description: '@esdora/kit 的 isAlnum 函数，检查字符串是否完全由英文字母和数字组成'
---

# isAlnum

检查字符串是否完全由英文字母（a-z, A-Z）和数字（0-9）组成。

## 示例

### 基本用法

```typescript
import { isAlnum } from '@esdora/kit'

// 仅包含字母
isAlnum('abc') // => true

// 仅包含数字
isAlnum('123') // => true

// 包含字母和数字
isAlnum('123a') // => true
```

### 边界情况

```typescript
import { isAlnum } from '@esdora/kit'

// 包含特殊符号
isAlnum('123a@') // => false

// 包含空格
isAlnum('abc 123') // => false

// 包含标点符号
isAlnum('user-name') // => false

// 空字符串
isAlnum('') // => false
```

## 签名

```typescript
function isAlnum(str: string): boolean
```

## 参数

| 参数 | 类型     | 描述               | 必需 |
| ---- | -------- | ------------------ | ---- |
| str  | `string` | 要进行检查的字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果字符串完全由一个或多个字母或数字组成，则返回 `true`，否则返回 `false`
- **特殊情况**:
  - 空字符串返回 `false`
  - 包含空格、标点符号、下划线或其他非字母数字字符时返回 `false`

## 注意事项

### 输入边界

- 空字符串被视为无效，返回 `false`
- 仅支持英文字母（a-z, A-Z），不包含中文或其他 Unicode 字母
- 下划线 `_` 不属于字母或数字，包含下划线的字符串返回 `false`

### 错误处理

- 该函数不抛出异常，对于任何非字符串输入，返回结果取决于 JavaScript 的隐式类型转换行为
- 建议调用方确保传入 `string` 类型参数以获得预期结果

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-alnum/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-alnum/index.test.ts)
