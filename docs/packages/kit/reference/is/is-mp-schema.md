---
title: isMpSchema
description: "isMpSchema - Dora Pocket 中 @esdora/kit 库提供的 URL 工具函数，用于判断给定 URL 字符串是否为微信小程序 Schema 链接。"
---

# isMpSchema

判断给定的 URL 字符串是否为以 `weixin://` 协议开头的微信小程序 Schema 链接。

## 示例

### 基本用法

```typescript
import { isMpSchema } from '@esdora/kit'

// 检查一个有效的微信小程序 Schema 链接
isMpSchema('weixin://dl/business?appid=11')
// => true
```

### 非 Schema 链接

```typescript
import { isMpSchema } from '@esdora/kit'

// 对于非 `weixin://` 开头的 URL，将返回 false
isMpSchema('https://dl/business?appid=11')
// => false

// 普通 HTTP 链接
isMpSchema('http://example.com')
// => false
```

### 在业务中校验跳转链接

```typescript
import { isMpSchema } from '@esdora/kit'

function openLink(url: string) {
  if (isMpSchema(url)) {
    // 小程序 Schema，可交给微信客户端处理
    // openWeixinSchema(url)
  }
  else {
    // 普通链接，走 H5 页面逻辑
    // openInBrowser(url)
  }
}
```

## 签名与说明

### 类型签名

```typescript
function isMpSchema(url: string): boolean
```

### 参数说明

| 参数 | 类型     | 描述                                                | 必需 |
| ---- | -------- | --------------------------------------------------- | ---- |
| url  | `string` | 要检查的 URL 字符串，通常为微信小程序跳转链接字符串 | 是   |

### 返回值

- **类型**: `boolean`
- **说明**: 当 `url` 以 `weixin://` 开头时返回 `true`，否则返回 `false`
- **特殊情况**:
  - 空字符串 `''` 返回 `false`
  - 仅检查前缀是否为 `weixin://`，不会验证查询参数或路径是否合法

## 注意事项与边界情况

### 输入边界

- 只接受 `string` 类型的参数，其他类型需要先转换为字符串
- 协议匹配区分大小写，`'Weixin://...'` 之类的写法将返回 `false`
- 不会对 URL 进行解码或标准化处理，传入的字符串会按原样进行前缀匹配

### 错误处理

- **异常类型**: 无，函数不会在运行时抛出异常
- **处理建议**: 可以直接在条件判断中使用，无需使用 `try-catch` 包裹

### 性能考虑

- **时间复杂度**: O(n) - 使用正则表达式测试整个字符串，n 为 URL 的长度
- **空间复杂度**: O(1) - 不会分配与输入规模相关的额外内存
- **优化建议**: 适合在路由拦截、点击事件等场景中高频调用

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/kit/src/is/is-mp-schema/index.ts)
