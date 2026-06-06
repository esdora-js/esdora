---
title: getQueryParams
description: '@esdora/kit 的 getQueryParams 函数，从一个 URL 字符串中安全地解析出查询参数，并以对象形式返回。'
---

# getQueryParams

从一个 URL 字符串中安全地解析出查询参数，并以对象形式返回。该实现基于 Web 标准 `URL` API，确保了最高的健壮性和安全性。

## 示例

### 基本用法

```typescript
import { getQueryParams } from '@esdora/kit'

// 解析标准 HTTP URL
getQueryParams('https://esdora.dev/path?user=test&id=123')
// => { user: 'test', id: '123' }

// 解析自定义协议 URL
getQueryParams('weixin://dl/business/?appid=abc&path=pages/articles/detail&query=url%3Dhttps%3A%2F%2Fbaidu.com')
// => { appid: 'abc', path: 'pages/articles/detail', query: 'url=https://baidu.com' }
```

### URL 编码自动解码

```typescript
import { getQueryParams } from '@esdora/kit'

getQueryParams('https://example.com?data=%7B%22key%22%3A%22value%22%7D')
// => { data: '{"key":"value"}' }
```

### 无查询参数的 URL

```typescript
import { getQueryParams } from '@esdora/kit'

getQueryParams('https://example.com/some/path')
// => {}
```

### 无效输入

```typescript
import { getQueryParams } from '@esdora/kit'

getQueryParams('I am not a URL')
// => null

getQueryParams('')
// => null

getQueryParams(null as any)
// => null

getQueryParams(undefined as any)
// => null
```

## 签名

```typescript
function getQueryParams(url: unknown): Record<string, string> | null
```

## 参数

| 参数  | 类型      | 描述                                | 必需 |
| ----- | --------- | ----------------------------------- | ---- |
| `url` | `unknown` | 一个标准的或自定义协议的 URL 字符串 | 是   |

## 返回值

- **类型**: `Record<string, string> | null`
- **说明**: 如果 URL 格式有效，则返回一个包含所有查询参数的键值对对象；如果 URL 字符串无法被解析为有效的 URL，则返回 `null`。
- **特殊情况**:
  - 当 URL 有效但没有查询参数时，返回空对象 `{}`
  - 当传入非字符串、空字符串、或 `new URL()` 无法解析的字符串时，返回 `null`
  - 当 URL 字符串包含 `null` 字符（`\0`）时，返回 `null`

## 注意事项

### 输入边界

- 参数类型为 `unknown`，接受任意输入；非字符串值会被安全地处理为 `null`
- 空字符串 `''` 会返回 `null`，而非空对象
- 自定义协议 URL（如 `weixin://`）可以正常解析
- URL 编码的查询参数值会被自动解码

### 错误处理

- 本函数**不会抛出异常**。所有解析失败的情况（包括无效输入、`new URL()` 抛出的 `TypeError`）都会通过 `try...catch` 捕获，并返回 `null`
- 内部使用 `http://a.b` 作为 `base` 参数调用 `new URL(url, BASE)`，因此即使传入相对路径或自定义协议也能被正确解析
- 对于无法被 `URL` 构造函数识别的字符串（如纯文本），会通过协议、路径名、主机名的比对逻辑返回 `null`

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/url/get-query-params/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/url/get-query-params/index.test.ts)
