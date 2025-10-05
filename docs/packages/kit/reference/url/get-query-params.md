---
title: getQueryParams
description: getQueryParams - 来自 Dora Pocket 的 URL“道具”，用于从一个 URL 字符串中安全地解析出查询参数。
---

# getQueryParams

<!-- 1. 简介：一句话核心功能描述 -->

安全地从 URL 字符串中解析查询参数，并以键值对对象的形式返回。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 解析标准的 HTTP URL
const httpUrl = 'https://esdora.dev/path?user=test&id=123'
getQueryParams(httpUrl)
// => { user: 'test', id: '123' }

// 解析自定义协议的 URL，并自动解码参数值
const weixinUrl = 'weixin://dl/business/?appid=abc&query=url%3Dhttps%3A%2F%2Fbaidu.com'
getQueryParams(weixinUrl)
// => { appid: 'abc', query: 'url=https://baidu.com' }
```

### 处理无参数或无效的 URL

```typescript
// 对于一个没有查询参数的有效 URL，返回一个空对象
getQueryParams('https://example.com/some/path')
// => {}

// 对于任何无效的输入，如格式错误的字符串、null 或非字符串类型，均返回 null
getQueryParams('I am not a URL')
// => null

getQueryParams(null)
// => null
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 从一个 URL 字符串中安全地解析出查询参数，并以对象形式返回。
 * 该实现基于 Web 标准 URL API，确保了最高的健壮性和安全性，能够处理标准及自定义协议。
 *
 * @param url 一个标准的或自定义协议的 URL 字符串。接受 `unknown` 类型以安全处理任意输入。
 * @returns 如果 URL 格式有效，则返回一个包含所有查询参数的键值对对象（即使没有参数，也会返回空对象 `{}`）；如果 URL 字符串无法被解析为有效的 URL，则返回 `null`。
 */
export function getQueryParams(url: unknown): Record<string, string> | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于安全性**: 该函数能安全处理任意类型的输入。对于 `null`、`undefined`、数字、对象或空字符串等非有效 URL 字符串，将统一返回 `null`。
- **关于自动解码**: 函数会自动解码 URL 编码的参数键和值，无需手动处理（例如，`%3D` 会被转为 `=`）。
- **关于无参数 URL**: 如果 URL 有效但不包含任何查询参数（即没有 `?` 部分），函数将返回一个空对象 `{}`，而不是 `null`。
- **关于解析引擎**: 内部使用标准的 `new URL()` 构造函数，这保证了其行为与浏览器和现代 JavaScript 环境一致，并能有效防御注入等安全问题。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`/kit/src/url/get-query-params/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/url/get-query-params/index.ts)
