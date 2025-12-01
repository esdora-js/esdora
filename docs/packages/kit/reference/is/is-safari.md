---
title: isSafari
description: "isSafari - Dora Pocket 中 @esdora/kit 库提供的环境检测工具函数，用于判断用户代理字符串是否表示 Safari 浏览器。"
---

# isSafari

通过匹配用户代理（User-Agent）字符串中的 `Version/... Safari/...` 段落，判断给定 UA 是否为 Safari 浏览器（包括 macOS 和 iOS 上的 Safari）。

## 示例

### 基本用法

```typescript
import { isSafari } from '@esdora/kit'

// 典型的 macOS Safari 用户代理
const safariUA
  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15'

isSafari(safariUA)
// => true
```

### 非 Safari 浏览器

```typescript
import { isSafari } from '@esdora/kit'

// Chrome（UA 中包含 "Safari" 字符串，但整体并非 Safari）
const chromeUA
  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'

isSafari(chromeUA)
// => false

// Firefox
const firefoxUA
  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0'

isSafari(firefoxUA)
// => false
```

### 在浏览器环境中使用

```typescript
import { isSafari } from '@esdora/kit'

const ua = navigator.userAgent
isSafari(ua)
// => true 或 false，取决于当前浏览器
```

## 签名与说明

### 类型签名

```typescript
function isSafari(ua: string): boolean
```

### 参数说明

| 参数 | 类型     | 描述                                                                 | 必需 |
| ---- | -------- | -------------------------------------------------------------------- | ---- |
| ua   | `string` | 用户代理（User-Agent）字符串，一般来自浏览器的 `navigator.userAgent` | 是   |

### 返回值

- **类型**: `boolean`
- **说明**: 当 UA 匹配 Safari 浏览器特征时返回 `true`，否则返回 `false`
- **特殊情况**:
  - 为空字符串 `''` 时返回 `false`
  - 仅当 UA 中同时包含 `Version/` 和 `Safari/` 段落时才会被识别为 Safari

## 注意事项与边界情况

### 输入边界

- 只对传入的 `ua` 字符串进行正则匹配，不会自动从运行环境中读取 UA
- UA 字符串可以被用户或浏览器插件伪造，因此结果仅适用于体验优化场景，不适合作为安全校验依据
- 对于非常规或极端精简的 UA 字符串，可能无法准确判断是否为 Safari

### 错误处理

- **异常类型**: 无，函数不会在运行时抛出异常
- **处理建议**: 可以安全地在任何环境中调用，错误输入只会导致返回 `false`

### 性能考虑

- **时间复杂度**: O(n) - 正则表达式对 UA 字符串进行一次遍历匹配，n 为 UA 长度
- **空间复杂度**: O(1) - 不依赖额外的动态内存分配
- **优化建议**: 适合作为运行时特性检测的一部分在前端应用中高频使用

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-safari/index.ts)
