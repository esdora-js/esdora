---
title: isEmailStrict
description: '@esdora/kit 的 isEmailStrict 函数，检查字符串是否为符合更严格格式的电子邮件地址'
---

# isEmailStrict

检查字符串是否为符合更严格格式的电子邮件地址。

该函数使用更全面的正则表达式，覆盖范围比 `isEmail` 更广，支持包含中文字符的本地部分、国际化域名以及带引号的本地部分。

## 示例

### 基本用法

```typescript
import { isEmailStrict } from '@esdora/kit'

isEmailStrict('normal@example.com') // => true
isEmailStrict('user.name@example.co.uk') // => true
isEmailStrict('user_name+tag123@example.io') // => true
isEmailStrict('user.name+tag@xn--exmple-cua.com') // => true
```

### 严格模式支持的格式

```typescript
import { isEmailStrict } from '@esdora/kit'

isEmailStrict('中文@example.com') // => true
isEmailStrict('"quoted-local-part"@example.com') // => true
```

## 签名

```typescript
function isEmailStrict(email: string): boolean
```

## 参数

| 参数  | 类型     | 描述                       | 必需 |
| ----- | -------- | -------------------------- | ---- |
| email | `string` | 要严格验证的电子邮件字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果字符串是严格模式支持的电子邮件地址，则返回 `true`，否则返回 `false`
- **特殊情况**: 对于简化版 `isEmail` 不支持的中文本地部分和引号本地部分，严格模式可返回 `true`

## 注意事项

### 输入边界

- 支持常见 ASCII 邮箱格式
- 支持包含中文字符的本地部分
- 支持使用引号的本地部分
- 正则表达式比 `isEmail` 更复杂，性能可能略低

### 错误处理

- 该函数不抛出异常
- 对于任何输入，均通过正则表达式返回 `boolean` 结果

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-email/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-email/index.test.ts)
- [isEmail](./is-email.md) — 简化模式验证，适合常见 ASCII 邮箱格式
