# isDigit

该方法使用的正则如下：

```ts
const REGEX_DIGIT = /^\d+$/
```

## 食用方法

该方法可以验证字符串是否仅包含数字

```ts
import { isDigit } from '@esdora/kit'

isDigit('123') // true
isDigit('123a') // false
isDigit('123a@') // false
```
