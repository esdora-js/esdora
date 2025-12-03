---
title: isFirefox
description: "isFirefox - Dora Pocket 中 @esdora/kit 库提供的环境检测工具函数，用于判断用户代理（User Agent）是否代表 Firefox 浏览器。"
---

# isFirefox

检查用户代理（User Agent）字符串是否代表 Firefox 浏览器（桌面或移动端），便于在前端代码中根据浏览器类型做差异化处理。

## 示例

### 基本用法

```typescript
import { isFirefox } from '@esdora/kit'

// 典型的 Firefox 浏览器 User Agent
const firefoxUA
  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0'

isFirefox(firefoxUA)
// => true
```

### 与其他浏览器区分

```typescript
import { isFirefox } from '@esdora/kit'

// macOS 上的 Safari
const safariUA
  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15'
isFirefox(safariUA)
// => false

// macOS 上的 Chrome
const chromeUA
  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
isFirefox(chromeUA)
// => false
```

### 在浏览器环境中使用

```typescript
import { isFirefox } from '@esdora/kit'

const ua: string = navigator.userAgent

if (isFirefox(ua)) {
  // => 仅在 Firefox 中执行的逻辑
  console.log('欢迎你，Firefox 用户')
}
else {
  // => 其他浏览器的兜底逻辑
  console.log('当前不是 Firefox 浏览器')
}
```

## 签名与说明

### 类型签名

```typescript
export function isFirefox(ua: string): boolean
```

### 参数说明

| 参数 | 类型     | 描述                                                                   | 必需 |
| ---- | -------- | ---------------------------------------------------------------------- | ---- |
| ua   | `string` | 要检测的用户代理（User Agent）字符串，通常来自 `navigator.userAgent`。 | 是   |

### 返回值

- **类型**: `boolean`
- **说明**: 当 `ua` 字符串匹配 Firefox 的用户代理特征时返回 `true`，否则返回 `false`。
- **特殊情况**:
  - 传入空字符串或与浏览器无关的字符串时返回 `false`。
  - 对于包含 `Seamonkey` 关键字的 UA 字符串会返回 `false`，即使其中同时包含 `Firefox`。

### 泛型约束（如适用）

- 此函数未使用泛型参数。

## 注意事项与边界情况

### 输入边界

- 仅当 `ua` 为 `string` 类型时才应调用本函数；在从未知来源（如 HTTP Header）获取 UA 时，请先进行类型检查。
- 空字符串 `''` 或明显不符合浏览器 UA 格式的字符串会返回 `false`。
- 函数使用预定义正则表达式匹配 Firefox 的 UA 特征，可同时识别桌面端和移动端 Firefox。

### 错误处理

- **异常类型**: 函数不会主动抛出异常，只要传入的是 `string` 类型就会被安全处理。
- **处理建议**: 建议在调用前对可能为 `null` / `undefined` 的 UA 源（例如某些非浏览器环境）进行判空处理，在 UA 不可用时可以跳过检测逻辑或传入空字符串。

### 性能考虑

- **时间复杂度**: O(n) - 其中 n 为 UA 字符串长度，内部仅执行一次正则匹配。
- **空间复杂度**: O(1) - 使用预编译的正则表达式 `REGEX_UA_FIREFOX`，不分配额外内存。
- **优化建议**:
  - 适合在运行时进行高频调用，例如埋点上报或前端能力检测。
  - 如果在同一代码路径中多次读取 `navigator.userAgent`，建议在上层缓存 UA 字符串后再重复调用本函数。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-firefox/index.ts)
