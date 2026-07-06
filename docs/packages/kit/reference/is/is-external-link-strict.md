---
title: isExternalLinkStrict
description: '@esdora/kit 的 isExternalLinkStrict 函数，检查链接是否为外部链接（严格模式，仅识别 HTTP/HTTPS）'
---

# isExternalLinkStrict

检查链接是否为外部链接（严格模式）。

此函数仅识别以 `http://` 或 `https://` 开头的完整 URL 为外部链接。所有其他格式（包括协议相对 URL、特殊协议、相对路径等）均被视为内部链接。适用于需要明确区分 HTTP/HTTPS 外部资源的场景。

## 示例

### 基本用法

```typescript
import { isExternalLinkStrict } from '@esdora/kit'

// HTTP/HTTPS 完整 URL（外部链接）
isExternalLinkStrict('https://example.com') // => true
isExternalLinkStrict('http://example.com/path') // => true
isExternalLinkStrict('https://sub.example.com/path?query=1') // => true
```

### 非外部链接的判定

```typescript
import { isExternalLinkStrict } from '@esdora/kit'

// 协议相对 URL（内部链接）
isExternalLinkStrict('//cdn.example.com/script.js') // => false

// 特殊协议（内部链接）
isExternalLinkStrict('mailto:test@example.com') // => false
isExternalLinkStrict('tel:1234567890') // => false
isExternalLinkStrict('ftp://files.example.com') // => false

// 相对路径（内部链接）
isExternalLinkStrict('/path/to/page') // => false
isExternalLinkStrict('#section') // => false
isExternalLinkStrict('./page.html') // => false
isExternalLinkStrict('../parent/page') // => false
```

### 边缘情况

```typescript
import { isExternalLinkStrict } from '@esdora/kit'

// 空字符串和空白字符串
isExternalLinkStrict('') // => false
isExternalLinkStrict('   ') // => false

// 带前后空格的链接
isExternalLinkStrict('  https://example.com  ') // => true
isExternalLinkStrict('  //example.com  ') // => false
```

## 签名

```typescript
function isExternalLinkStrict(href: string): boolean
```

## 参数

| 参数 | 类型     | 描述               | 必需 |
| ---- | -------- | ------------------ | ---- |
| href | `string` | 要检查的链接字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果链接是 HTTP/HTTPS 完整 URL，则返回 `true`，否则返回 `false`
- **特殊情况**:
  - 空字符串或仅包含空白的字符串返回 `false`
  - 协议相对 URL（`//`）、特殊协议（`mailto:`、`tel:` 等）均返回 `false`

## 注意事项

### 输入边界

- 空字符串和仅包含空白的字符串会被视为内部链接，返回 `false`
- 输入会自动去除前后空白字符后再进行判断
- 与 [`isExternalLink`](./is-external-link.md) 不同，此函数不识别协议相对 URL 和特殊协议

### 与 isExternalLink 的区别

| 行为                   | [`isExternalLink`](./is-external-link.md)（智能模式） | `isExternalLinkStrict`（严格模式） |
| ---------------------- | ----------------------------------------------------- | ---------------------------------- |
| `http://` / `https://` | 外部                                                  | 外部                               |
| `//cdn.example.com`    | 外部                                                  | 内部                               |
| `mailto:` / `tel:`     | 外部                                                  | 内部                               |
| 相对路径 / 无协议      | 内部                                                  | 内部                               |

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-external-link/is-external-link-strict.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-external-link/is-external-link-strict.test.ts)
- [isExternalLink](./is-external-link.md) — 智能模式，识别更多链接格式
