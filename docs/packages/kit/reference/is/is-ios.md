---
title: isIos
description: "isIos - Dora Pocket 中 @esdora/kit 库提供的环境检测工具函数，用于判断用户代理（User Agent）是否为 iOS 设备。"
---

# isIos

检查用户代理（User Agent）字符串是否表明客户端是 iOS 设备（iPhone、iPad 或 iPod），用于在前端代码中针对 iOS 平台进行样式和功能适配。

## 示例

### 基本用法

```typescript
import { isIos } from '@esdora/kit'

// iPhone User Agent
const iphoneUA
  = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
isIos(iphoneUA)
// => true

// iPad User Agent
const ipadUA
  = 'Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1'
isIos(ipadUA)
// => true
```

### 非 iOS 环境

```typescript
import { isIos } from '@esdora/kit'

// Android 设备的 User Agent
const androidUA
  = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
isIos(androidUA)
// => false

// 桌面 Mac 浏览器的 User Agent
const desktopUA
  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
isIos(desktopUA)
// => false
```

### 在浏览器环境中使用

```typescript
import { isIos } from '@esdora/kit'

const ua: string = navigator.userAgent

if (isIos(ua)) {
  // => 在 iOS 设备上启用特定样式或行为
  document.body.classList.add('ios-only')
}
else {
  // => 非 iOS 设备上的兜底处理
  document.body.classList.remove('ios-only')
}
```

## 签名与说明

### 类型签名

```typescript
export function isIos(ua: string): boolean
```

### 参数说明

| 参数 | 类型     | 描述                                                                       | 必需 |
| ---- | -------- | -------------------------------------------------------------------------- | ---- |
| ua   | `string` | 要进行检查的用户代理（User Agent）字符串，通常来自 `navigator.userAgent`。 | 是   |

### 返回值

- **类型**: `boolean`
- **说明**: 如果 `ua` 字符串表明是 iOS 设备（iPhone、iPad 或 iPod），则返回 `true`，否则返回 `false`。
- **特殊情况**:
  - 当输入为空字符串 `''` 时，返回 `false`。
  - 包含 `Macintosh; Intel Mac OS X` 的桌面 macOS User Agent 会返回 `false`，不会被误判为 iOS。

### 泛型约束（如适用）

- 此函数未使用泛型参数。

## 注意事项与边界情况

### 输入边界

- 函数通过检查输入字符串中是否包含 `iPhone`、`iPad` 或 `iPod` 之一来做出判断，只要满足其中一个条件即返回 `true`。
- 空字符串、仅包含空白字符的字符串或明显不符合浏览器 UA 格式的字符串都会返回 `false`。
- 对于某些旧设备或非标准 UA，如果缺少上述关键字，则不会被识别为 iOS。

### 错误处理

- **异常类型**: 函数不会主动抛出异常，只要传入的是 `string` 类型就会被安全处理。
- **处理建议**: 在服务端渲染或 Node.js 环境中使用时，请先确认是否能够获取到 UA 字符串；在无法获取 UA 的情况下，可以跳过检测逻辑或传入空字符串。

### 性能考虑

- **时间复杂度**: O(n) - 其中 n 为 UA 字符串长度，内部仅执行少量正则匹配操作。
- **空间复杂度**: O(1) - 使用预编译的正则表达式 `REGEX_UA_IPHONE`、`REGEX_UA_IPAD` 和 `REGEX_UA_IPOD`，不分配额外内存。
- **优化建议**:
  - 适合在运行时进行 UA 检测，例如在首屏脚本中决定是否启用某些移动端特性。
  - 对于重复调用场景，建议在外层缓存 UA 字符串并重复使用。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-ios/index.ts)
