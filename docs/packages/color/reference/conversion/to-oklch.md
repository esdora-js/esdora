---
title: toOklch
description: "toOklch - Dora Pocket 中 @esdora/color 库提供的颜色转换工具函数，用于将任意颜色格式转换为 OKLCH 颜色对象。"
---

# toOklch

将任意合法的颜色字符串或颜色对象转换为简洁的 OKLCH 颜色对象，方便在感知均匀的颜色空间中进行运算和调色。

## 示例

### 基本用法

```typescript
import { toOklch } from '@esdora/color'

const red = toOklch('#FF0000')
// => { l: 0.628, c: 0.258, h: 29.234 }

const fromHsl = toOklch('hsl(0, 100%, 50%)')
// => { l: 0.628, c: 0.258, h: 29.234 }
```

### 处理透明度与灰度颜色

```typescript
import { toOklch } from '@esdora/color'

const semiTransparent = toOklch('rgba(255, 0, 0, 0.5)')
// => { l: 0.628, c: 0.258, h: 29.234, a: 0.5 }

const opaque = toOklch('rgba(255, 0, 0, 1)')
// => { l: 0.628, c: 0.258, h: 29.234 }

const gray = toOklch('#808080')
// => { l: 0.6, c: 0, h: 0 }
```

### 处理无效输入与边界情况

```typescript
import { toOklch } from '@esdora/color'

const invalid = toOklch('invalid-color')
// => null

function safeToOklch(input: string | null | undefined) {
  return input ? toOklch(input) : null
}

safeToOklch(null)
// => null
```

## 签名与说明

### 类型签名

```typescript
export function toOklch(color: string | EsdoraColor): EsdoraOklchColor | null
```

### 参数说明

| 参数  | 类型                    | 描述                                                               | 必需 |
| ----- | ----------------------- | ------------------------------------------------------------------ | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色输入，可以是颜色字符串或符合 culori 规范的颜色对象。 | 是   |

### 返回值

- **类型**: `EsdoraOklchColor | null`
- **说明**: 当 `color` 可以成功解析并转换为 OKLCH 颜色空间时，返回一个包含 `l`、`c`、`h`（以及必要时 `a`）字段的对象；当输入无法解析或转换失败时返回 `null`。
- **特殊情况**: 对于灰度颜色（如 `#FFFFFF`、`#000000`、`#808080`），返回的对象中 `c` 和 `h` 都为 `0`；当内部转换结果的某些字段为 `undefined` 时，会被当作 `0` 处理。

### 泛型约束（如适用）

- 本函数不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 接受常见颜色格式：如 `#RRGGBB`、`#RGB`、`rgb(...)`、`rgba(...)`、`hsl(...)` 字符串，以及包含 `mode` 字段的 culori 兼容颜色对象。
- 返回的 `EsdoraOklchColor` 按约定使用以下数值范围：`l` 在 `0-1` 之间，`c` 一般在 `0-0.4` 之间，`h` 在 `0-360` 之间，`a` 在 `0-1` 之间。
- 虽然类型签名只接受 `string` 或 `EsdoraColor`，实现内部对异常输入做了防御性处理，确保不会因为格式错误导致抛出异常。

### 错误处理

- 当颜色字符串无法被解析器识别（例如 `'invalid-color'` 或空字符串）时，函数返回 `null`。
- 当传入的对象虽然可以被解析为颜色，但在转换到 OKLCH 颜色空间时底层库抛出异常时，内部会捕获异常并返回 `null`，而不是向上传播错误。
- 当底层 OKLCH 结果中的 `l`、`c` 或 `h` 为 `undefined` 时，会被视为 `0`，从而保证输出对象始终包含数值类型字段。
- 当颜色的透明度 `alpha` 小于 `1` 时，返回对象会包含 `a` 字段；当 `alpha` 为 `1` 或未提供时则不会包含 `a` 字段。

### 性能考虑

- 单次调用的时间复杂度为 O(1)，适用于运行时按需将颜色转换为 OKLCH，以便进行亮度、对比度或色阶计算。
- 每次调用都会重新解析输入颜色并进行转换；在需要对同一颜色多次执行转换的场景中，可以在业务层缓存 `EsdoraOklchColor` 结果以避免重复计算。
- 由于只进行一次解析和一次颜色空间转换，对典型的前端和 Node.js 使用场景来说性能消耗可忽略不计。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-oklch/index.ts)
