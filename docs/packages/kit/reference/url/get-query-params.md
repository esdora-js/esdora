---
title: getQueryParams
description: "getQueryParams - Dora Pocket 中 @esdora/kit 库提供的 URL 解析工具函数，用于从 URL 字符串中安全解析查询参数为对象。"
---

# getQueryParams

从任意 URL 字符串中安全解析查询参数，返回一个键值对对象，并在输入无效时优雅地返回 `null`。

## 示例

### 基本用法：解析标准 URL

```typescript
import { getQueryParams } from '@esdora/kit'

const httpUrl = 'https://esdora.dev/path?user=test&id=123'

const params = getQueryParams(httpUrl)
// => { user: 'test', id: '123' }
```

### 解析自定义协议与编码参数

```typescript
import { getQueryParams } from '@esdora/kit'

const weixinUrl = 'weixin://dl/business/?appid=abc&path=pages/articles/detail&query=url%3Dhttps%3A%2F%2Fbaidu.com'

const params = getQueryParams(weixinUrl)
// => { appid: 'abc', path: 'pages/articles/detail', query: 'url=https://baidu.com' }
```

### 处理无参数与无效输入

```typescript
import { getQueryParams } from '@esdora/kit'

// 没有查询参数的有效 URL，返回空对象
getQueryParams('https://example.com/some/path')
// => {}

// 无效的 URL 字符串
getQueryParams('I am not a URL')
// => null

// 非字符串输入
getQueryParams(null)
// => null
getQueryParams(12345 as any)
// => null
```

## 签名与说明

### 类型签名

```typescript
export function getQueryParams(url: unknown): Record<string, string> | null
```

### 参数说明

| 参数 | 类型      | 描述                                              | 必需 |
| ---- | --------- | ------------------------------------------------- | ---- |
| url  | `unknown` | 待解析的 URL 输入，接受任意类型以安全处理用户输入 | 是   |

### 返回值

- **类型**: `Record<string, string> | null`
- **说明**:
  - 当 `url` 能被解析为有效 URL 时，返回一个包含所有查询参数的简单对象
  - 当 URL 有效但不包含任何查询参数时，返回空对象 `{}`（而非 `null`）
  - 当 `url` 不是字符串、为空字符串或无法被解析为合法 URL 时，返回 `null`
- **特殊情况**:
  - URL 中的查询参数键和值会自动进行 URL 解码，例如 `%3D` 会被解码为 `=`
  - 当内部 `new URL()` 调用因为非法字符（如包含 `\0`）抛出异常时，函数会捕获并返回 `null`

### 泛型约束（如适用）

本函数未使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 对于以下输入：
  - 非字符串类型（如 `null`、`undefined`、数字、普通对象等）
  - 空字符串 `''`
  - 仅包含主机但无法被识别为有效 URL 的字符串（例如乱写的文本）
    函数都会返回 `null`。
- 当传入的字符串是有效 URL 但不包含查询参数（没有 `?`，或 `?` 后为空）时，返回空对象 `{}`。
- URL 中的查询参数名称和值都支持 URL 编码，会在解析结果中以解码后的形式返回。

### 错误处理

- 内部使用 `new URL(url, BASE)` 进行解析，当遇到包含非法字符（例如带有 `\0` 的字符串）时，`URL` 构造函数会抛出 `TypeError`。
- 这些异常会被 `try...catch` 捕获，并统一转换为返回 `null`，调用方不会看到异常抛出。
- 对于非字符串输入，函数在调用 `URL` 之前就会直接返回 `null`，避免无意义的解析尝试。

### 性能考虑

- **时间复杂度**: O(n)，其中 n 为 URL 字符串长度，主要开销来自标准 `URL` 解析和遍历查询参数。
- **空间复杂度**: O(m)，其中 m 为查询参数的数量，需要创建一个新的对象来存放键值对。
- **优化建议**:
  - 对于高频解析相同 URL 的场景，可以在业务层做结果缓存。
  - 当只关心少量参数时，可在解析结果上再做按需取值，而无需额外的防御性处理。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/url/get-query-params/index.ts)
