---
title: isHarmony
description: isHarmony - 来自 Dora Pocket 的环境“道具”，用于判断用户代理（User Agent）是否为鸿蒙（HarmonyOS）设备。
---

# isHarmony

<!-- 1. 简介：一句话核心功能描述 -->

检查用户代理（User Agent）字符串是否表明客户端是鸿蒙（HarmonyOS）设备。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 包含 "HarmonyOS" 关键字的 User Agent
const harmonyUA = 'Mozilla/5.0 (Linux; Android 10; TAS-AN00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 HuaweiBrowser/11.1.1.301 Mobile Safari/537.36 HarmonyOS/2.0.0'
isHarmony(harmonyUA)
// => true

// 包含 "OpenHarmony" 关键字的 User Agent
const openHarmonyUA = 'Mozilla/5.0 (Phone; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 ArkWeb/4.1.6.1 Mobile HuaweiBrowser/5.1.9.301'
isHarmony(openHarmonyUA)
// => true
```

### 非鸿蒙环境

```typescript
// Android 设备的 User Agent
const androidUA = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
isHarmony(androidUA)
// => false

// iOS 设备的 User Agent
const iosUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
isHarmony(iosUA)
// => false
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 检查用户代理（User Agent）字符串是否表明客户端是鸿蒙（HarmonyOS）设备。
 *
 * 此函数通过测试给定的字符串中是否包含 "HarmonyOS" 或 "OpenHarmony" 等关键字来判断客户端环境是否为鸿蒙系统。
 *
 * @param ua 要进行检查的用户代理（User Agent）字符串，通常来自 `navigator.userAgent`。
 * @returns 如果用户代理字符串表明是鸿蒙设备，则返回 `true`，否则返回 `false`。
 */
export function isHarmony(ua: string): boolean
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于判定逻辑**: 函数通过正则表达式检查输入字符串中是否包含 `HarmonyOS` 或 `OpenHarmony` 关键字。测试用例证实了这两种情况都会被正确识别。
- **关于空字符串**: 当输入为空字符串 `''` 时，函数将返回 `false`。
- **关于 UA 伪造**: 用户代理字符串可以被用户或浏览器插件轻易伪造，因此该函数不应作为安全验证的依据，仅适用于内容适配、统计分析等场景。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/kit/src/is/is-harmony/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-harmony/index.ts)
