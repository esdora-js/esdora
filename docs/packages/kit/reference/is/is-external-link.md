---
title: isExternalLink
description: '@esdora/kit 的 isExternalLink 函数，检查链接是否为外部链接（智能模式）'
---

# isExternalLink

检查链接是否为外部链接（智能模式）。

此函数使用智能逻辑判断一个链接是否指向外部资源。它会识别多种链接格式，包括完整 URL、协议相对 URL、特殊协议链接等。相对路径和危险协议被视为内部链接。

## 示例

### 基本用法

```typescript
import { isExternalLink } from '@esdora/kit'

// 完整 URL（外部链接）
isExternalLink('https://example.com') // => true
isExternalLink('http://example.com/path') // => true

// 协议相对 URL（外部链接）
isExternalLink('//cdn.example.com/script.js') // => true

// 特殊协议（外部链接）
isExternalLink('mailto:test@example.com') // => true
isExternalLink('tel:1234567890') // => true
```

### 内部链接识别

```typescript
import { isExternalLink } from '@esdora/kit'

// 相对路径（内部链接）
isExternalLink('/path/to/page') // => false
isExternalLink('#section') // => false
isExternalLink('./page.html') // => false
isExternalLink('../parent/page') // => false
isExternalLink('?query=value') // => false

// 危险协议（内部链接，安全考虑）
isExternalLink('javascript:void(0)') // => false
isExternalLink('data:text/plain,Hello') // => false

// 不含协议的字符串（内部链接）
isExternalLink('page.html') // => false
```

### 边缘情况

```typescript
import { isExternalLink } from '@esdora/kit'

// 空字符串和空白字符串
isExternalLink('') // => false
isExternalLink('   ') // => false

// 带前后空格的链接
isExternalLink('  https://example.com  ') // => true
isExternalLink('  /path  ') // => false
```

## 签名

```typescript
function isExternalLink(href: string): boolean
```

## 参数

| 参数 | 类型     | 描述               | 必需 |
| ---- | -------- | ------------------ | ---- |
| href | `string` | 要检查的链接字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果链接是外部链接，则返回 `true`，否则返回 `false`
- **特殊情况**:
  - 空字符串或仅包含空白的字符串返回 `false`
  - 以 `javascript:` 或 `data:` 开头的链接返回 `false`（安全考虑）
  - 不含协议的字符串（如 `page.html`）返回 `false`

## 注意事项

### 输入边界

- 空字符串和仅包含空白的字符串会被视为内部链接，返回 `false`
- 输入会自动去除前后空白字符后再进行判断
- 不含协议的纯字符串（如 `page.html`）被视为内部链接

### 错误处理

- 此函数不抛出异常
- 对于非字符串输入，行为取决于 `startsWith` 方法的运行时表现

### 性能考虑

- **时间复杂度**: O(1) — 仅涉及固定次数的字符串前缀比较
- **空间复杂度**: O(1) — 仅创建一次 `trim()` 后的字符串副本

## isExternalLinkStrict

检查链接是否为外部链接（严格模式）。

此函数仅识别以 `http://` 或 `https://` 开头的完整 URL 为外部链接。所有其他格式（包括协议相对 URL、特殊协议、相对路径等）均被视为内部链接。适用于需要明确区分 HTTP/HTTPS 外部资源的场景。

### 示例

```typescript
import { isExternalLinkStrict } from '@esdora/kit'

// HTTP/HTTPS 完整 URL（外部链接）
isExternalLinkStrict('https://example.com') // => true
isExternalLinkStrict('http://example.com/path') // => true

// 协议相对 URL（内部链接）
isExternalLinkStrict('//cdn.example.com/script.js') // => false

// 特殊协议（内部链接）
isExternalLinkStrict('mailto:test@example.com') // => false

// 相对路径（内部链接）
isExternalLinkStrict('/path/to/page') // => false
```

### 签名

```typescript
function isExternalLinkStrict(href: string): boolean
```

### 与 isExternalLink 的区别

| 行为                   | `isExternalLink`（智能模式） | `isExternalLinkStrict`（严格模式） |
| ---------------------- | ---------------------------- | ---------------------------------- |
| `http://` / `https://` | 外部                         | 外部                               |
| `//cdn.example.com`    | 外部                         | 内部                               |
| `mailto:` / `tel:`     | 外部                         | 内部                               |
| 相对路径 / 无协议      | 内部                         | 内部                               |

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-external-link/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-external-link/index.test.ts)
