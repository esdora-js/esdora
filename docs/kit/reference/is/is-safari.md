---
title: isSafari
---

# isSafari

验证传入的ua是否是Safari。mac版与iOS版都会返回true

该方法使用的正则如下：

```ts
const REGEX_UA_SAFARI = /version\/[\d._].*safari/i
```

## 示例

```ts
import { isSafari } from '@esdora/kit'

const ua = navigator.userAgent
isSafari(ua) // 返回布尔值
```
