---
title: isUrl
---

# isUrl

验证字符串是否为有效的 URL 格式。

## 基本用法

```typescript
import { isUrl } from '@esdora/kit'

isUrl('https://example.com') // true
isUrl('http://localhost:3000') // true
isUrl('ftp://files.example.com') // true
isUrl('not-a-url') // false
isUrl('example.com') // false (缺少协议)
```

## 参数

- `url: string` - 要验证的字符串

## 返回值

- `boolean` - 如果是有效的 URL 返回 `true`，否则返回 `false`

## 支持的协议

- `http://`
- `https://`
- `ftp://`
- `file://`
- 其他标准协议

## 注意事项

- 该函数会验证 URL 的基本格式
- 不会检查 URL 是否真实存在或可访问
- 需要包含协议部分（如 `http://` 或 `https://`）
