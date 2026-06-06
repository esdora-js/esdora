---
title: isIOS
description: '@esdora/kit 的 isIOS 函数，检测用户代理字符串是否表明客户端为 iOS 设备'
---

# isIOS

检测用户代理（User Agent）字符串是否表明客户端是 iOS 设备（iPhone、iPad 或 iPod）。

## 示例

### 基本用法

```typescript
import { isIOS } from '@esdora/kit'

// iPhone User Agent
isIOS('Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1')
// => true

// iPad User Agent
isIOS('Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1')
// => true
```

### 非 iOS 设备

```typescript
import { isIOS } from '@esdora/kit'

// Android User Agent
isIOS('Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36')
// => false

// 桌面浏览器 User Agent
isIOS('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36')
// => false
```

## 签名

```typescript
function isIOS(ua: string): boolean
```

## 参数

| 参数 | 类型     | 描述                                                               | 必需 |
| ---- | -------- | ------------------------------------------------------------------ | ---- |
| ua   | `string` | 要检测的用户代理（User Agent）字符串，通常为 `navigator.userAgent` | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 若用户代理字符串包含 "iPhone"、"iPad" 或 "iPod" 关键字，则返回 `true`，否则返回 `false`
- **特殊情况**:
  - 传入空字符串时返回 `false`
  - 用户代理字符串可被伪造，检测结果不能保证 100% 准确
  - 仅检测 iOS 移动设备（iPhone / iPad / iPod），桌面端 macOS 返回 `false`

## 注意事项

### 输入边界

- 参数为必填项，需传入有效的 User Agent 字符串
- 空字符串或不含 iOS 特征的字符串均返回 `false`

### 错误处理

- 本函数不抛出异常，任何输入均返回布尔值
- 对于非字符串输入，由于 TypeScript 类型约束，在编译阶段即可发现问题

### 兼容性

- **环境要求**: 适用于所有支持正则表达式的 JavaScript 运行环境
- 通常用于浏览器环境，通过 `navigator.userAgent` 获取当前设备的 User Agent

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-ios/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-ios/index.test.ts)
