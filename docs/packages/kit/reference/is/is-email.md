---
title: isEmail
description: "isEmail - Dora Pocket 中 @esdora/kit 库提供的字符串验证工具函数，用于检查字符串是否为符合基本格式的电子邮件地址。"
---

# isEmail

检查字符串是否为符合基本格式的电子邮件地址，提供简化版和严格版两种验证模式。

## 示例

### 基本用法（简化版）

```typescript
import { isEmail } from '@esdora/kit'

// 常见的有效格式
isEmail('user@example.com') // => true
isEmail('user.name@example.co.uk') // => true
isEmail('user_name+tag123@example.io') // => true

// 无效格式
isEmail('invalid-email') // => false
isEmail('@example.com') // => false
isEmail('user@') // => false
```

### 国际化邮箱（严格版）

```typescript
import { isEmailStrict } from '@esdora/kit'

// 支持中文及国际化字符
isEmailStrict('中文@example.com') // => true

// 支持带引号的本地部分
isEmailStrict('"quoted-local-part"@example.com') // => true

// 标准格式也支持
isEmailStrict('user@example.com') // => true
```

### 简化版与严格版对比

```typescript
import { isEmail, isEmailStrict } from '@esdora/kit'

const internationalEmail = '中文@example.com'
isEmail(internationalEmail) // => false (简化版不支持)
isEmailStrict(internationalEmail) // => true (严格版支持)

const quotedEmail = '"quoted-local-part"@example.com'
isEmail(quotedEmail) // => false (简化版不支持)
isEmailStrict(quotedEmail) // => true (严格版支持)
```

## 签名与说明

### 类型签名

```typescript
function isEmail(email: string): boolean
function isEmailStrict(email: string): boolean
```

### 参数说明

| 参数  | 类型     | 描述                                     | 必需 |
| ----- | -------- | ---------------------------------------- | ---- |
| email | `string` | 要验证的电子邮件字符串                   | 是   |

### 返回值

- **类型**: `boolean`
- **说明**:
  - `isEmail`: 如果字符串是基本格式的电子邮件地址则返回 `true`，否则返回 `false`
  - `isEmailStrict`: 如果字符串符合 RFC 5322 规范的电子邮件地址则返回 `true`，否则返回 `false`
- **特殊情况**: 空字符串、纯空格、缺少 @ 符号等都返回 `false`

## 注意事项与边界情况

### 输入边界

- **简化版 `isEmail`**:
  - 仅支持标准 ASCII 字符集邮箱（a-z, A-Z, 0-9, ., %, +, -, _）
  - 不支持中文字符或其他 Unicode 字符
  - 不支持引号包裹的本地部分（如 `"quoted"@example.com`）
  - 支持子域名（如 `user@sub.domain.com`）
  - 支持国际化域名编码（如 `user@xn--exmple-cua.com`）

- **严格版 `isEmailStrict`**:
  - 支持所有 `isEmail` 支持的格式
  - 额外支持国际化域名（IDN）和中文字符
  - 支持引号包裹的本地部分
  - 更接近 RFC 5322 邮件地址规范

- **共同边界**:
  - 空字符串返回 `false`
  - 纯空格返回 `false`
  - 缺少 @ 符号返回 `false`
  - 本地部分为空（如 `@example.com`）返回 `false`
  - 域名部分为空（如 `user@`）返回 `false`

### 错误处理

- **异常类型**: 无，函数不会抛出异常
- **处理建议**: 无需 try-catch 包裹，所有输入都会被安全处理

### 性能考虑

- **时间复杂度**:
  - `isEmail`: O(n) - 简化正则表达式，性能较高
  - `isEmailStrict`: O(n) - 复杂正则表达式，性能略低但验证更准确

- **空间复杂度**: O(1) - 仅使用正则匹配，无额外内存分配

- **优化建议**:
  - 对于标准 ASCII 邮箱验证场景，优先使用 `isEmail`（性能更好）
  - 需要支持国际化邮箱时，使用 `isEmailStrict`
  - 两种验证器的正则表达式都已预编译，适合高频调用
  - 对于表单验证等场景，建议配合防抖使用以减少验证频率

### 兼容性

- **环境要求**: ES5+
- **浏览器**: 所有现代浏览器和 IE9+
- **Node.js**: 所有版本
- **已知限制**:
  - 不验证邮箱地址是否真实存在
  - 不验证域名 DNS 记录
  - 不验证邮箱长度限制（本地部分最大 64 字符，域名最大 255 字符）

## 相关链接

- 源码: `packages/kit/src/is/is-email/index.ts`
