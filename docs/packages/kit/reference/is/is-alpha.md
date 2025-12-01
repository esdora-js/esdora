---
title: isAlpha
description: "isAlpha - Dora Pocket 中 @esdora/kit 库提供的字符串验证工具函数，用于检查字符串是否完全由英文字母组成。"
---

# isAlpha

检查字符串是否完全由英文字母（a-z, A-Z）组成。

## 示例

### 基本用法

```typescript
import { isAlpha } from '@esdora/kit'

// 仅包含字母
isAlpha('HelloWorld') // => true
isAlpha('abc') // => true
```

### 无效输入

```typescript
import { isAlpha } from '@esdora/kit'

// 包含数字
isAlpha('abc1') // => false

// 仅包含数字
isAlpha('123') // => false

// 包含字母和数字
isAlpha('123a') // => false

// 包含特殊符号
isAlpha('123a@') // => false

// 空字符串
isAlpha('') // => false
```

## 签名与说明

### 类型签名

```typescript
function isAlpha(str: string): boolean
```

### 参数说明

| 参数 | 类型     | 描述               | 必需 |
| ---- | -------- | ------------------ | ---- |
| str  | `string` | 要进行检查的字符串 | 是   |

### 返回值

- **类型**: `boolean`
- **说明**: 如果字符串完全由一个或多个英文字母组成，则返回 `true`，否则返回 `false`
- **特殊情况**: 空字符串返回 `false`

## 注意事项与边界情况

### 输入边界

- 空字符串 `''` 返回 `false`
- 仅接受英文字母（a-z, A-Z），不支持其他语言或字符集（例如中文、韩文等）
- 含有数字、空格、下划线 `_`、连字符 `-`、标点等字符都会返回 `false`

### 错误处理

- **异常类型**: 无，函数不会抛出异常
- **处理建议**: 无需 `try...catch` 包裹，传入非字符串值时建议在调用前进行类型校验

### 性能考虑

- **时间复杂度**: O(n) - 正则表达式需要检查字符串中的每个字符
- **空间复杂度**: O(1) - 使用预定义的正则表达式，无额外内存分配
- **优化建议**: 适合高频调用场景，对于极长字符串（例如日志内容）建议在调用前进行必要的截断

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-alpha/index.ts)
