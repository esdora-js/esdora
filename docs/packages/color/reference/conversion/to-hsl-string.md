---
title: toHslString
description: toHslString - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为 HSL/HSLA 字符串。
---

# toHslString

将任意合法的颜色字符串或颜色对象转换为 `hsl()` 或 `hsla()` 格式的 CSS 颜色字符串。

## 示例

### 基本用法

```typescript
import { toHslString } from '@esdora/color'

toHslString('#FF0000') // => 'hsl(0, 100%, 50%)'
toHslString('rgb(255, 0, 0)') // => 'hsl(0, 100%, 50%)'
toHslString({ r: 255, g: 0, b: 0, mode: 'rgb' }) // => 'hsl(0, 100%, 50%)'
```

### 处理透明度

```typescript
import { toHslString } from '@esdora/color'

// 当颜色包含透明度时，会使用 hsla() 格式输出
toHslString('rgba(255, 0, 0, 0.5)') // => 'hsla(0, 100%, 50%, 0.5)'

// 当颜色完全不透明 (alpha = 1) 时，会使用 hsl() 格式
toHslString('rgba(255, 0, 0, 1)') // => 'hsl(0, 100%, 50%)'
```

### 边界和错误场景

```typescript
import { toHslString } from '@esdora/color'

// 对于灰度颜色，亮度分量可能包含小数
toHslString('#808080') // => 'hsl(0, 0%, 50.2%)'

toHslString('invalid-color') // => null
toHslString('') // => null
```

## 签名与说明

### 类型签名

```typescript
export function toHslString(color: string | EsdoraColor): string | null
```

### 参数说明

| 参数  | 类型                    | 描述                                                                                 | 必需 |
| ----- | ----------------------- | ------------------------------------------------------------------------------------ | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色表示，可以是 HEX/RGB/HSL 等 CSS 颜色字符串，或 Culori 支持的颜色对象。 | 是   |

### 返回值

- **类型**: `string | null`
- **说明**: 当解析成功时，返回一个 `hsl(h, s%, l%)` 或 `hsla(h, s%, l%, a)` 格式的字符串，自动根据透明度选择是否包含 alpha。
- **特殊情况**: 当颜色无法解析、转换失败或输入不合法（如无效字符串、`null`、`undefined` 等）时，返回 `null`。

### 泛型约束（如适用）

本函数不使用泛型参数。

## 注意事项与边界情况

### 输入边界

- 支持 HEX 短格式（如 `#f00`）和长格式（如 `#FF0000`）、RGB/HSL 字符串以及对应的颜色对象。
- 对于灰度颜色（如 `#808080`），亮度 `l` 可能是带小数的百分比（例如 `50.2%`），与底层格式化器的实际计算结果保持一致。

### 错误处理

- **异常类型**: 函数对 HSL 转换过程使用 `try/catch` 包裹，当底层转换器抛出错误（例如传入带有非法 `mode` 的颜色对象）或解析失败时，统一返回 `null`。
- **处理建议**: 调用方应在使用前判断返回值是否为 `null`，在 UI 层可以回退到安全颜色或提示输入错误，不需要额外使用 `try/catch`。

### 性能考虑

- **时间复杂度**: O(1) —— 每次调用仅对单个颜色值进行解析与格式化。
- **空间复杂度**: O(1) —— 只创建少量中间对象，不会随着调用次数线性增加。
- **优化建议**: 适合在样式生成、主题系统等场景中高频调用；如在大列表中多次对同一颜色进行转换，可在业务层做简单缓存以避免重复计算。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-hsl-string/index.ts)
