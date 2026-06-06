---
title: isEmail
description: '@esdora/kit 的 isEmail 函数，检查字符串是否为符合基本格式的电子邮件地址'
---

# isEmail

检查字符串是否为符合基本格式的电子邮件地址。

该函数使用简化的正则表达式快速验证常见的电子邮件格式，主要针对标准 ASCII 字符集邮箱。对于需要覆盖更广泛邮件格式的场景，请使用 `isEmailStrict`。

## 示例

### 基本用法

```typescript
import { isEmail } from '@esdora/kit'

isEmail('normal@example.com') // => true
isEmail('user.name@example.co.uk') // => true
isEmail('user_name+tag123@example.io') // => true
isEmail('user-name@sub.domain.com') // => true
isEmail('u1234567@example.org') // => true
isEmail('USER@EXAMPLE.COM') // => true
isEmail('user%example@example.org') // => true
isEmail('user.name+tag@xn--exmple-cua.com') // => true
isEmail('user@localhost.localdomain') // => true
```

### 不支持的格式

```typescript
import { isEmail } from '@esdora/kit'

isEmail('中文@example.com') // => false
isEmail('"quoted-local-part"@example.com') // => false
isEmail('plainaddress') // => false
```

## 签名

```typescript
function isEmail(email: string): boolean
```

## 参数

| 参数  | 类型     | 描述                   | 必需 |
| ----- | -------- | ---------------------- | ---- |
| email | `string` | 要验证的电子邮件字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果字符串是格式基本的电子邮件地址，则返回 `true`，否则返回 `false`
- **特殊情况**: 对于包含中文字符、引号本地部分等复杂格式的邮箱，即使符合 RFC 规范也会返回 `false`

## 注意事项

### 输入边界

- 仅支持标准 ASCII 字符集邮箱格式
- 不支持包含中文字符的本地部分（local-part）
- 不支持使用引号的本地部分
- 空字符串或非字符串输入的行为取决于调用方（TypeScript 类型系统会在编译期拦截类型不匹配）

### 错误处理

- 该函数不抛出异常
- 对于任何输入，均通过正则表达式返回 `boolean` 结果

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-email/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-email/index.test.ts)
- [isEmailStrict](./is-email-strict.md) — 严格模式验证，支持中文和国际化字符
