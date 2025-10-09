---
title: isIos
description: isIos - 来自 Dora Pocket 的环境“道具”，用于判断用户代理（User Agent）是否为 iOS 设备。
---

# isIos

<!-- 1. 简介：一句话核心功能描述 -->

检查用户代理（User Agent）字符串是否表明客户端是 iOS 设备（iPhone、iPad 或 iPod）。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// iPhone User Agent
const iphoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
isIos(iphoneUA)
// => true

// iPad User Agent
const ipadUA = 'Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1'
isIos(ipadUA)
// => true
```

### 非 iOS 环境

```typescript
// Android 设备的 User Agent
const androidUA = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
isIos(androidUA)
// => false

// 桌面 Mac 浏览器的 User Agent
const desktopUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
isIos(desktopUA)
// => false
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 检查用户代理（User Agent）字符串是否表明客户端是 iOS 设备。
 *
 * 此函数通过测试给定的字符串中是否包含 "iPhone"、"iPad" 或 "iPod" 关键字来判断客户端环境是否为 iOS 系统，
 * 从而覆盖苹果公司的主要移动设备。
 *
 * @param ua 要进行检查的用户代理（User Agent）字符串，通常来自 `navigator.userAgent`。
 * @returns 如果用户代理字符串表明是 iOS 设备（iPhone, iPad, 或 iPod），则返回 `true`，否则返回 `false`。
 */
export function isIos(ua: string): boolean
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于判定逻辑**: 函数通过检查输入字符串中是否包含 `iPhone`、`iPad` 或 `iPod` 之一来做出判断。只要满足其中一个条件即返回 `true`。
- **关于桌面 Mac**: 此函数不会将桌面版 macOS 的 User Agent 误判为 iOS。如测试用例所示，包含 `Macintosh; Intel Mac OS X` 的字符串会返回 `false`。
- **关于空字符串**: 当输入为空字符串 `''` 时，函数将返回 `false`。
- **关于 UA 伪造**: 用户代理字符串可以被用户或浏览器插件轻易伪造，因此该函数不应作为安全验证的依据，仅适用于内容适配等场景。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/kit/src/is/is-ios/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-ios/index.ts)
