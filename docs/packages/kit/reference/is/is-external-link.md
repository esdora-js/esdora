---
title: isExternalLink
description: "isExternalLink - Dora Pocket 中 @esdora/kit 库提供的链接验证工具函数，用于智能判断链接是否指向外部资源。"
---

# isExternalLink

智能判断链接是否为外部链接，支持多种链接格式识别，包括完整 URL、协议相对 URL、特殊协议等。

## 示例

### 基本用法

```typescript
import { isExternalLink } from '@esdora/kit'

// 完整 URL（外部链接）
isExternalLink('https://example.com') // => true
isExternalLink('http://example.com/path') // => true

// 相对路径（内部链接）
isExternalLink('/path/to/page') // => false
isExternalLink('#section') // => false
```

### 协议相对 URL

```typescript
import { isExternalLink } from '@esdora/kit'

// 协议相对 URL 被识别为外部链接
isExternalLink('//cdn.example.com/script.js') // => true
```

### 特殊协议处理

```typescript
import { isExternalLink } from '@esdora/kit'

// 通信协议（外部链接）
isExternalLink('mailto:test@example.com') // => true
isExternalLink('tel:1234567890') // => true
isExternalLink('ftp://files.example.com') // => true

// 危险协议（内部链接，安全考虑）
isExternalLink('javascript:void(0)') // => false
isExternalLink('data:text/plain,Hello') // => false
```

### 边缘情况

```typescript
import { isExternalLink } from '@esdora/kit'

// 空字符串和空白字符串
isExternalLink('') // => false
isExternalLink('   ') // => false

// 查询参数和相对路径
isExternalLink('?query=value') // => false
isExternalLink('./page.html') // => false
isExternalLink('../parent/page') // => false
```

## 签名与说明

### 类型签名

```typescript
function isExternalLink(href: string): boolean
```

### 参数说明

| 参数 | 类型     | 描述               | 必需 |
| ---- | -------- | ------------------ | ---- |
| href | `string` | 要检查的链接字符串 | 是   |

### 返回值

- **类型**: `boolean`
- **说明**: 如果链接是外部链接，则返回 `true`，否则返回 `false`
- **特殊情况**: 空字符串或仅包含空白字符的字符串返回 `false`

## 注意事项与边界情况

### 输入边界

- **空字符串**: 空字符串 `''` 返回 `false`
- **空白字符串**: 仅包含空格的字符串 `'   '` 返回 `false`
- **自动去除空白**: 函数会自动去除字符串首尾的空白字符后再进行判断

### 链接识别规则

**外部链接**（返回 `true`）:

- 完整 URL: `http://` 或 `https://` 开头
- 协议相对 URL: `//` 开头
- 通信协议: `mailto:`、`tel:`、`ftp:`、`ftps:` 开头

**内部链接**（返回 `false`）:

- 相对路径: `/`、`#`、`./`、`../` 开头
- 查询参数: `?` 开头
- 危险协议: `javascript:`、`data:` 开头（安全考虑）
- 无协议字符串: 如 `page.html`（默认视为内部链接）

### 安全考虑

- **`javascript:` 和 `data:` 协议**: 这些协议可能存在安全风险（XSS 攻击），因此被视为内部链接，便于统一的安全策略处理
- **协议相对 URL**: `//` 开头的 URL 会继承当前页面的协议，但仍被视为外部资源

### 性能考虑

- **时间复杂度**: O(1) - 仅进行字符串前缀匹配，不涉及正则表达式或复杂解析
- **空间复杂度**: O(1) - 仅使用常量级别的额外空间（trim 后的字符串）
- **优化建议**: 适合高频调用场景，无性能瓶颈

## 相关函数

### isExternalLinkStrict

如果需要更严格的验证逻辑（仅识别 HTTP/HTTPS 完整 URL），可以使用 `isExternalLinkStrict` 函数。

```typescript
import { isExternalLinkStrict } from '@esdora/kit'

// 仅 HTTP/HTTPS 完整 URL 被识别为外部链接
isExternalLinkStrict('https://example.com') // => true
isExternalLinkStrict('//cdn.example.com') // => false
isExternalLinkStrict('mailto:test@example.com') // => false
```

**两者区别**:

- `isExternalLink`: 智能模式，识别多种外部链接格式（HTTP/HTTPS、协议相对 URL、特殊协议）
- `isExternalLinkStrict`: 严格模式，仅识别 HTTP/HTTPS 完整 URL

**使用建议**:

- 通用场景（如导航链接、资源加载）: 使用 `isExternalLink`
- 需要明确区分 HTTP/HTTPS 外部资源的场景: 使用 `isExternalLinkStrict`

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-external-link/index.ts)
