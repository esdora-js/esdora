---
"@esdora/biz": minor
---

refactor: 重构函数导出路径和重命名查询字符串模块从 `query` 到 `qs`

```diff
- import { parse, stringify } from '@esdora/biz/query'
+ import { parse, stringify } from '@esdora/biz/qs'
```
