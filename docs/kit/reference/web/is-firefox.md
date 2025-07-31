# isFireFox

验证传入的ua是否是火狐浏览器

该方法使用的正则如下：

```ts
const REGEX_UA_FIREFOX = /^(?!.*Seamonkey)(?=.*Firefox).*/i
```

## 示例

```ts
import { isFireFox } from '@esdora/kit'

const ua = navigator.userAgent
isFireFox(ua) // 返回布尔值
```
