# to

该方法引用自[await-to-js](https://github.com/scopsy/await-to-js)

## 食用方法

```typescript
import { to } from '@esdora/kit'

async function main() {
  const [error, result] = await to<string, Error>(Promise.resolve('sss'))
}
```
