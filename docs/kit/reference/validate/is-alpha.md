# isAlpha

该方法使用的正则如下：

```ts
const REGEX_ALPHA = /^[a-z]+$/i
```

## 食用方法

该方法可以验证字符串是否仅包含字母

```ts
import { isAlpha } from '@esdora/kit'

isAlpha('abc') // true
isAlpha('123') // false
isAlpha('123a') // false
isAlpha('123a@') // false
```
