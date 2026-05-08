---
title: isFirefox
description: '@esdora/kit 的 isFirefox 函数，检测用户代理字符串是否代表 Firefox 浏览器'
---

# isFirefox

检测给定的用户代理（User Agent, UA）字符串是否代表 Firefox 浏览器。

## 示例

### 基本用法

```typescript
import { isFirefox } from '@esdora/kit'

// Firefox 浏览器
isFirefox('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0') // => true

// Safari 浏览器
isFirefox('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15') // => false

// Chrome 浏览器
isFirefox('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36') // => false
```

### 浏览器环境用法

```typescript
import { isFirefox } from '@esdora/kit'

if (isFirefox(navigator.userAgent)) {
  console.log('欢迎你，火狐用户！')
  // 可以在这里应用针对 Firefox 的特定逻辑
}
```

## 签名

```typescript
function isFirefox(ua: string): boolean
```

## 参数

| 参数 | 类型     | 描述                       | 必需 |
| ---- | -------- | -------------------------- | ---- |
| ua   | `string` | 需要被检测的用户代理字符串 | 是   |

## 返回值

- **类型**: `boolean`
- **说明**: 如果 UA 字符串匹配 Firefox，则返回 `true`，否则返回 `false`
- **特殊情况**:
  - 传入空字符串时返回 `false`
  - 传入非 Firefox 的 UA 字符串时返回 `false`
  - 该正则表达式会排除 SeaMonkey（`^(?!.*Seamonkey)(?=.*Firefox).*/i`）

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
- **SeaMonkey 排除**: 正则表达式使用负向前瞻 `(?!.*Seamonkey)` 排除 SeaMonkey 浏览器，即使其 UA 中包含 "Firefox" 字样也不会被匹配

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-firefox/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/kit/src/is/is-firefox/index.test.ts)
