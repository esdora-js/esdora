---
"@esdora/date": minor
---

feat: 扩充 `DATE_FORMAT` 常量集合

补全 `YEAR`、`MONTH`、`DAY`、`HOUR`、`MINUTE`、`SECOND` 等单位格式常量，以及 `HH_MM` 时间区间复合常量，方便直接引用而不必手写字符串：

```diff
 export const DATE_FORMAT = {
+  YEAR: 'yyyy',
+  MONTH: 'MM',
+  DAY: 'dd',
+  HOUR: 'HH',
+  MINUTE: 'mm',
+  SECOND: 'ss',
+  HH_MM: 'HH:mm',
   HH_MM_SS: 'HH:mm:ss',
   YYYY_MM_DD: 'yyyy-MM-dd',
   // ...
 }
```

常量值严格遵循 date-fns 的 Unicode token 规范（`yyyy`/`MM`/`dd` 等），不可与 dayjs/moment 的大写风格（`YYYY`/`DD`）混用——后者在 date-fns 下会被拒绝或产生语义错位。
