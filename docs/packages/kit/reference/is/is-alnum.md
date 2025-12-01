---
title: isAlnum
description: "isAlnum - Dora Pocket 中 @esdora/kit 库提供的字符串验证工具函数，用于检查字符串是否完全由英文字母和数字组成。"
---

# isAlnum

检查字符串是否完全由英文字母（a-z, A-Z）和数字（0-9）组成。

## 示例

### 基本用法

```typescript
import { isAlnum } from '@esdora/kit'

// 包含字母和数字
isAlnum('abc123XYZ') // => true

// 仅包含字母
isAlnum('HelloWorld') // => true

// 仅包含数字
isAlnum('123') // => true
```

### 无效输入

```typescript
import { isAlnum } from '@esdora/kit'

// 包含空格
isAlnum('abc 123') // => false

// 包含特殊符号
isAlnum('123a@') // => false

// 包含标点符号
isAlnum('user-name') // => false

// 空字符串
isAlnum('') // => false
```

## 签名与说明

### 类型签名

```typescript
function isAlnum(str: string): boolean
```

### 参数说明

| 参数 | 类型     | 描述               | 必需 |
| ---- | -------- | ------------------ | ---- |
| str  | `string` | 要进行检查的字符串 | 是   |

### 返回值

- **类型**: `boolean`
- **说明**: 如果字符串完全由一个或多个字母或数字组成，则返回 `true`，否则返回 `false`
- **特殊情况**: 空字符串返回 `false`

## 注意事项与边界情况

### 输入边界

- 空字符串 `''` 返回 `false`
- 仅接受英文字母（a-z, A-Z），不支持其他语言字符
- 下划线 `_`、连字符 `-`、空格等都不被视为有效字符

### 错误处理

- **异常类型**: 无，函数不会抛出异常
- **处理建议**: 无需 `try...catch` 包裹

### 性能考虑

- **时间复杂度**: O(n) - 正则表达式需要检查字符串中的每个字符
- **空间复杂度**: O(1) - 仅使用正则匹配，无额外内存分配
- **优化建议**: 适合高频调用，正则表达式已预定义

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-alnum/index.ts)
