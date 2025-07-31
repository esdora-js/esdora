# isPhone

该方法使用的正则如下：

```ts
const REGEX_CN_PHONE_STRICT = /^(?:(?:\+|00)86)?1(?:3\d|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8\d|9[0125-9])\d{8}$/
```

来源于：https://github.com/any86/any-rule/blob/master/packages/www/src/RULES.js

验证是否是中国大陆手机号

## 示例

```ts
import { isPhone } from '@esdora/kit'

isPhone('008618311006933') // true
isPhone('+8617888829981') // true
isPhone('19119255642') // true
isPhone('19519255642') // true
```
