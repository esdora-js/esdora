---
title: isAndroid
description: "@esdora/kit 的 isAndroid 函数，检查用户代理字符串是否表明客户端为 Android 设备"
---

# isAndroid

检查用户代理（User Agent）字符串是否表明客户端是安卓（Android）设备。

## 示例

### 基本用法

```typescript
import { isAndroid } from '@esdora/kit'

// 典型的 Android User Agent
isAndroid('Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36')
// => true

// iOS User Agent
isAndroid('Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1')
// => false

// 桌面浏览器 User Agent
isAndroid('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
// => false
```

### 边界情况

```typescript
import { isAndroid } from '@esdora/kit'

// 空字符串
isAndroid('')
// => false
```

## 签名

```typescript
function isAndroid(ua: string): boolean
```

## 参数

| 参数 | 类型     | 描述                                                               | 必需 |
| ---- | -------- | ------------------------------------------------------------------ | ---- |
| `ua` | `string` | 要检查的用户代理（User Agent）字符串，通常是 `navigator.userAgent` | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果用户代理字符串包含 "Android" 关键字，则返回 `true`，否则返回 `false`
- **特殊情况**:
  - 传入空字符串时返回 `false`
  - 传入非 Android 设备的 User Agent（如 iOS、桌面浏览器）时返回 `false`
  - 该函数仅做字符串匹配，无法保证客户端真实环境（User Agent 可被伪造）

## 注意事项

### 输入边界

- 参数 `ua` 为空字符串时，函数返回 `false`
- 函数内部使用正则 `/(Android);?[\s/]+([\d.]+)?/` 进行匹配，只要字符串中包含 "Android" 关键字即可命中
- 不验证 User Agent 字符串的格式合法性

### 错误处理

- 函数不会抛出异常
- 若传入非字符串类型，由于 TypeScript 类型约束会在编译期报错；运行时若传入非字符串可能导致意外行为

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-android/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-android/index.test.ts)
