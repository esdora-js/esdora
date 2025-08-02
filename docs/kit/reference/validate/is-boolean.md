---
title: isBoolean
---

# isBoolean

验证值是否为布尔类型。

## 基本用法

```typescript
import { isBoolean } from '@esdora/kit'

isBoolean(true) // true
isBoolean(false) // true
isBoolean('true') // false
isBoolean(1) // false
isBoolean(0) // false
```
