---
title: isMpSchema
description: isMpSchema - 来自 Dora Pocket 的 URL“道具”，用于判断一个 URL 字符串是否为微信小程序 Schema。
---

# isMpSchema

<!-- 1. 简介：一句话核心功能描述 -->

判断给定的 URL 字符串是否为微信小程序 Schema 链接。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 检查一个有效的微信小程序 Schema
isMpSchema('weixin://dl/business?appid=11')
// => true
```

### 错误的 Schema

```typescript
// 对于非 `weixin://` 开头的 URL，将返回 false
isMpSchema('https://dl/business?appid=11')
// => false
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 判断给定的 URL 字符串是否为微信小程序 Schema 链接。
 * 微信小程序 Schema 格式通常以 `weixin://` 开头。
 *
 * @param url 要检查的 URL 字符串。
 * @returns 如果是微信小程序 Schema 则返回 `true`，否则返回 `false`。
 */
export function isMpSchema(url: string): boolean
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于协议检查**: 此函数仅严格检查 URL 是否以 `weixin://` 开头，不验证 URL 的其余部分是否有效。
- **关于大小写**: 检查是区分大小写的。例如，`'Weixin://... '` 将返回 `false`。
- **关于空字符串**: 输入一个空字符串会返回 `false`。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/kit/src/is/is-mp-schema/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-mp-schema/index.ts)
