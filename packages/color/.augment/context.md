# `@esdora/color` 包本地规则

- **唯一引擎:** 100% 基于 `culori`。
- **内部令牌:** `EsdoraColor` (`import('culori').Color` 的类型别名)。
- **智能解析:** `parseColor` 必须能处理 `rgb({r: 255, ...})`。
- **返回值契约:** `便利层` -> `string`, `转换层(对象)` -> `Esdora...Color`, `核心引擎层` -> `EsdoraColor`。
- **Hex 格式化:** 默认 6 位，带 alpha 时 8 位。
- **参数宽容性:** `amount` 参数必须智能处理比例和百分比。
