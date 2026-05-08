---
title: isPhone
description: '@esdora/kit 的 isPhone 函数，检查字符串是否为有效的中国大陆手机号码'
---

# isPhone

检查字符串是否为有效的中国大陆手机号码。

该函数使用严格的正则表达式验证输入值是否符合中国大陆手机号格式。支持可选的 `+86` 或 `0086` 国家代码前缀，不接受分隔符或其他非数字字符。

## 示例

### 基本用法

```typescript
import { isPhone } from '@esdora/kit'

isPhone('19119255642') // => true
isPhone('19519255642') // => true
isPhone('+8617888829981') // => true
isPhone('008618311006933') // => true
```

### 无效号码

```typescript
import { isPhone } from '@esdora/kit'

isPhone('12345678901') // => false（无效号段）
isPhone('123456789012') // => false（长度错误）
```

## 签名

```typescript
function isPhone(phone: string): boolean
```

## 参数

| 参数  | 类型     | 描述                   | 必需 |
| ----- | -------- | ---------------------- | ---- |
| phone | `string` | 要验证的手机号码字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果字符串是有效的中国大陆手机号码，则返回 `true`，否则返回 `false`
- **特殊情况**: 对于包含非数字字符（如连字符、空格）、长度不为 11 位、或使用非中国大陆号段的输入，均返回 `false`

## 注意事项

### 输入边界

- 仅支持中国大陆手机号码格式（11 位数字）
- 支持可选的 `+86` 或 `0086` 国家代码前缀
- 不支持包含分隔符（如 `-`、空格）的号码格式
- 空字符串或非字符串输入的行为取决于调用方（TypeScript 类型系统会在编译期拦截类型不匹配）

### 错误处理

- 该函数不抛出异常
- 对于任何输入，均通过正则表达式返回 `boolean` 结果

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-phone/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-phone/index.test.ts)
