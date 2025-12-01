---
title: isPhone
description: "isPhone - Dora Pocket 中 @esdora/kit 库提供的字符串验证工具函数，用于检查字符串是否为中国大陆手机号码（支持可选 +86/0086 前缀）。"
---

# isPhone

使用严格的正则表达式验证给定字符串是否为中国大陆手机号码，支持可选的 `+86` 或 `0086` 国家代码前缀。

## 示例

### 基本用法

```typescript
import { isPhone } from '@esdora/kit'

// 带国家码前缀
isPhone('008618311006933')
// => true
isPhone('+8617888829981')
// => true

// 本地 11 位手机号码
isPhone('19119255642')
// => true
isPhone('19519255642')
// => true
```

### 无效的号码

```typescript
import { isPhone } from '@esdora/kit'

// 号段不合法
isPhone('12345678901')
// => false

// 位数不正确（过长）
isPhone('123456789012')
// => false

// 包含分隔符或非数字字符
isPhone('138-1234-5678')
// => false

// 空字符串
isPhone('')
// => false
```

### 在表单校验中使用

```typescript
import { isPhone } from '@esdora/kit'

function validatePhoneInput(value: string) {
  if (!isPhone(value)) {
    return '请输入有效的中国大陆手机号码'
  }

  return ''
}
```

## 签名与说明

### 类型签名

```typescript
function isPhone(phone: string): boolean
```

### 参数说明

| 参数  | 类型     | 描述                                                            | 必需 |
| ----- | -------- | --------------------------------------------------------------- | ---- |
| phone | `string` | 要验证的手机号码字符串，支持可选的 `+86` 或 `0086` 国家代码前缀 | 是   |

### 返回值

- **类型**: `boolean`
- **说明**: 当 `phone` 符合中国大陆手机号格式时返回 `true`，否则返回 `false`
- **特殊情况**:
  - 包含空格、短横线等非数字字符的字符串会返回 `false`
  - 空字符串 `''` 返回 `false`

## 注意事项与边界情况

### 输入边界

- 仅支持中国大陆手机号号段（如 13x、14x、15x、18x、19x 等），其他国家或地区号码会返回 `false`
- 支持可选的 `+86` 或 `0086` 前缀，但不支持其他形式的国家代码（如 `86-`、`(86)` 等）
- 参数类型在 TypeScript 层面被限制为 `string`，其他类型需要先转换为字符串再进行验证

### 错误处理

- **异常类型**: 无，函数不会在运行时抛出异常
- **处理建议**: 可以直接用于表单校验或接口入参校验，将返回值作为分支条件

### 性能考虑

- **时间复杂度**: O(1) - 正则表达式在固定长度的手机号字符串上执行匹配
- **空间复杂度**: O(1) - 不依赖额外的动态内存分配
- **优化建议**: 适合在高频表单输入场景中实时调用

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-phone/index.ts)
