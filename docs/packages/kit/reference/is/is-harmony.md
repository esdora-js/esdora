---
title: isHarmony
description: '@esdora/kit 的 isHarmony 函数，检查用户代理字符串是否表明客户端是鸿蒙（HarmonyOS）设备。'
---

# isHarmony

检查用户代理（User Agent）字符串是否表明客户端是鸿蒙（HarmonyOS）设备。

## 示例

### 基本用法

```typescript
import { isHarmony } from '@esdora/kit'

// 鸿蒙 User Agent（OpenHarmony）
isHarmony('Mozilla/5.0 (Phone; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 ArkWeb/4.1.6.1 Mobile HuaweiBrowser/5.1.9.301')
// => true

// 鸿蒙 User Agent（HarmonyOS）
isHarmony('Mozilla/5.0 (Linux; Android 10; HarmonyOS; VOG-AL00; HMSCore 6.14.0.302; GMSCore 20.15.16) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.196 HuaweiBrowser/15.0.4.312 Mobile Safari/537.36')
// => true

// Android User Agent
isHarmony('Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36')
// => false

// iOS User Agent
isHarmony('Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1')
// => false

// 空字符串
isHarmony('')
// => false
```

### 边界情况

```typescript
import { isHarmony } from '@esdora/kit'

// macOS User Agent
isHarmony('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36')
// => false

// iPad User Agent
isHarmony('Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1')
// => false
```

## 签名

```typescript
function isHarmony(ua: string): boolean
```

## 参数

| 参数 | 类型     | 描述                                                                   | 必需 |
| ---- | -------- | ---------------------------------------------------------------------- | ---- |
| ua   | `string` | 要进行检查的用户代理（User Agent）字符串，通常是 `navigator.userAgent` | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果用户代理字符串包含 "HarmonyOS"、"OpenHarmony" 或 "ArkWeb" 关键字，则返回 `true`，否则返回 `false`
- **特殊情况**:
  - 传入空字符串时返回 `false`
  - 传入非鸿蒙设备的 User Agent 时返回 `false`

## 注意事项

### 输入边界

- 参数 `ua` 为空字符串时返回 `false`
- 检测基于正则匹配，关键字包括：`HarmonyOS`、`OpenHarmony`、`ArkWeb`
- 该函数仅检测 User Agent 字符串，不检测实际运行环境

### 错误处理

- 该函数不会抛出异常
- 对于非字符串输入，TypeScript 类型系统会在编译期拦截；运行时传入非字符串可能导致不可预期的正则匹配行为

### 兼容性

- **环境要求**: 所有支持正则表达式的 JavaScript 运行环境
- 适用于浏览器端（通过 `navigator.userAgent`）和服务器端（通过请求头 `User-Agent`）

## 相关链接

- [源码](https://github.com/esdora/esdora/blob/main/packages/kit/src/is/is-harmony/index.ts)
- [单元测试](https://github.com/esdora/esdora/blob/main/packages/kit/src/is/is-harmony/index.test.ts)
