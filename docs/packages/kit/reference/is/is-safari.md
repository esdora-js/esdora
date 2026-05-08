---
title: isSafari
description: '@esdora/kit 的 isSafari 函数，检测用户代理字符串是否代表 Safari 浏览器'
---

# isSafari

检测给定的用户代理（User Agent, UA）字符串是否代表 Safari 浏览器。

## 示例

### 基本用法

```typescript
import { isSafari } from '@esdora/kit'

// Safari 浏览器（macOS）
isSafari('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15') // => true

// Chrome 浏览器（UA 中包含 "Safari" 字样，但不会被误判）
isSafari('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36') // => false

// Firefox 浏览器
isSafari('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0') // => false
```

### 浏览器环境用法

```typescript
import { isSafari } from '@esdora/kit'

if (isSafari(navigator.userAgent)) {
  console.log('欢迎你，Safari 用户！')
  // 可以在这里应用针对 Safari 的特定逻辑
}
```

## 签名

```typescript
function isSafari(ua: string): boolean
```

## 参数

| 参数 | 类型     | 描述                       | 必需 |
| ---- | -------- | -------------------------- | ---- |
| ua   | `string` | 需要被检测的用户代理字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果 UA 字符串匹配 Safari，则返回 `true`，否则返回 `false`
- **特殊情况**:
  - 传入空字符串时返回 `false`
  - 传入非 Safari 的 UA 字符串时返回 `false`
  - 基于 Chromium 的浏览器（如 Chrome、Edge）的 UA 中通常也包含 "Safari" 字样，但本函数会正确返回 `false`

## 注意事项

### 输入边界

- 参数 `ua` 必须是字符串类型，传入非字符串可能导致意外行为
- 空字符串会被视为不匹配，返回 `false`
- 函数仅检测 UA 字符串内容，不验证字符串格式是否合法

### 错误处理

- 本函数不会抛出异常
- 对于任何输入，均返回 `boolean` 值

### 兼容性

- **环境要求**: 所有支持正则表达式的 JavaScript 运行环境
- **浏览器兼容性**: 适用于所有现代浏览器及 Node.js 环境
- **User Agent 可靠性**: User Agent 字符串可以被用户或浏览器扩展修改，检测结果仅供参考，不建议作为安全决策的唯一依据
- **Chromium 浏览器排除**: 正则表达式使用 `version/[\d._].*safari` 进行匹配，要求同时包含 `Version/x.x` 和 `Safari` 字样，从而排除 Chromium 系列浏览器

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-safari/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-safari/index.test.ts)
