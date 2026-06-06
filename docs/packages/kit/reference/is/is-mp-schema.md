---
title: isMpSchema
description: '@esdora/kit 的 isMpSchema 函数，判断字符串是否为微信小程序协议（weixin://）'
---

# isMpSchema

判断给定字符串是否以微信小程序协议 `weixin://` 开头。

## 示例

### 基本用法

```typescript
import { isMpSchema } from '@esdora/kit'

isMpSchema('weixin://dl/business?appid=11') // => true
isMpSchema('https://dl/business?appid=11') // => false
```

### 边界情况

```typescript
import { isMpSchema } from '@esdora/kit'

isMpSchema('weixin://') // => true
isMpSchema('weixin://path') // => true
isMpSchema('') // => false
isMpSchema('weixin') // => false
isMpSchema('WEIXIN://PATH') // => false（区分大小写）
```

## 签名

```typescript
function isMpSchema(url: string): boolean
```

## 参数

| 参数 | 类型     | 描述                | 必需 |
| ---- | -------- | ------------------- | ---- |
| url  | `string` | 待检测的 URL 字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 当字符串以 `weixin://` 开头时返回 `true`，否则返回 `false`
- **特殊情况**: 空字符串返回 `false`；大小写不匹配时返回 `false`（仅匹配小写 `weixin`）

## 注意事项

### 输入边界

- 仅检测字符串前缀，不验证 URL 的完整格式
- 匹配区分大小写，`WEIXIN://` 会被判定为 `false`
- 空字符串返回 `false`

### 错误处理

- 函数不抛出异常；非字符串输入会通过类型系统阻止（TypeScript 编译期检查）
- 运行时传入非字符串值可能导致意外结果，依赖 TypeScript 类型约束保证输入安全

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-mp-schema/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-mp-schema/index.test.ts)
