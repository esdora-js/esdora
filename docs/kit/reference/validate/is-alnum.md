---
title: isAlnum
---

# isAlnum

该方法使用的正则如下：

```ts
const REGEX_ALNUM = /^[a-z0-9]+$/i
```

## 食用方法

该方法可以验证字符串是否仅包含字母或数字

```ts
import { isAlnum } from '@esdora/kit'

isAlnum('abc') // true
isAlnum('123') // true
isAlnum('123a') // true
isAlnum('123a@') // false
```
