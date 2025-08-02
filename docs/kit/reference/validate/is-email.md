---
title: isEmail
---

# isEmail

该方法使用的正则如下：

```ts
// 简单验证
const REGEX_EMAIL = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
// 严格验证
const REGEX_EMAIL_STRICT = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i
```

来源于：https://github.com/any86/any-rule/blob/master/packages/www/src/RULES.js

## 简易验证

该方法可以验证一些基本的邮箱格式，但不能验证中文和引用类邮箱。

```ts
import { isEmail } from '@esdora/kit'

isEmail('a.b.c_1@example.com') // true
isEmail('中文@example.com') // false
isEmail('"quoted-local-part"@example.com') // false
```

## 严格验证

该方法可以验证所有的邮箱格式，包括中文和引用类邮箱。

```ts
import { isEmailStrict } from '@esdora/kit'

isEmailStrict('a.b.c_1@example.com') // true
isEmailStrict('中文@example.com') // true
isEmailStrict('"quoted-local-part"@example.com') // true
```
