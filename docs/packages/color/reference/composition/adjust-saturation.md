---
title: adjustSaturation
description: '@esdora/color 的 adjustSaturation 函数，以感知均匀的方式调整任意有效颜色的饱和度。'
---

# adjustSaturation

以感知均匀的方式，调整任意有效颜色的饱和度。此函数会先将输入颜色智能转换为 HSL 色彩空间，然后对饱和度 (S) 通道进行操作。

## 示例

### 基本用法

```typescript
import { adjustSaturation } from '@esdora/color'

// 使用数值直接设置饱和度
adjustSaturation('#ff0000', 0.5) // => { mode: 'hsl', h: 0, s: 0.5, l: 0.5, alpha: 1 }

// 使用函数基于当前饱和度进行调整
adjustSaturation('#ff0000', s => s * 0.5) // => { mode: 'hsl', h: 0, s: 0.5, l: 0.5, alpha: 1 }
```

### 边界值处理

```typescript
import { adjustSaturation } from '@esdora/color'

// 数值超过 1 时会被截断到 1
adjustSaturation('#ff0000', 1.5) // => { mode: 'hsl', h: 0, s: 1, l: 0.5, alpha: 1 }

// 数值低于 0 时会被截断到 0
adjustSaturation('#ff0000', -0.5) // => { mode: 'hsl', h: 0, s: 0, l: 0.5, alpha: 1 }

// 使用函数将饱和度设为 0（灰度）
adjustSaturation('#ff0000', () => 0) // => { mode: 'hsl', h: 0, s: 0, l: 0.5, alpha: 1 }

// 使用函数将饱和度设为最大值
adjustSaturation('#ff0000', () => 1) // => { mode: 'hsl', h: 0, s: 1, l: 0.5, alpha: 1 }
```

### 处理饱和度为 undefined 的颜色

```typescript
import { adjustSaturation } from '@esdora/color'

// 当颜色对象的饱和度为 undefined 时，默认按 0 处理
adjustSaturation(
  { mode: 'hsl', h: 0, s: undefined, l: 0.5, alpha: 1 },
  s => s + 0.5
) // => { mode: 'hsl', h: 0, s: 0.5, l: 0.5, alpha: 1 }
```

## 签名

```typescript
export type SaturationAdjuster = (currentSaturation: number) => number

export function adjustSaturation(
  color: string | EsdoraColor,
  adjuster: number | SaturationAdjuster
): EsdoraColor | null
```

## 参数

| 参数       | 类型                           | 描述                                                                                | 必需 |
| ---------- | ------------------------------ | ----------------------------------------------------------------------------------- | ---- |
| `color`    | `string \| EsdoraColor`        | 基础颜色。支持 CSS 颜色字符串（如 `'#ff0000'`、`'rgb(255,0,0)'`）或标准化的颜色对象 | 是   |
| `adjuster` | `number \| SaturationAdjuster` | 饱和度调整值。传入数字时直接设置饱和度；传入函数时，接收当前饱和度并返回新值        | 是   |

## 返回值

- **类型**: `EsdoraColor | null`
- **说明**: 返回一个新的 HSL 颜色对象（`mode: 'hsl'`），其饱和度已被调整。如果输入颜色无效或转换失败，则返回 `null`
- **特殊情况**:
  - 输入无效颜色字符串（如 `'invalid-color'`）时返回 `null`
  - 输入空字符串时返回 `null`
  - 输入 `null` 时返回 `null`
  - 颜色对象包含无效 `mode` 时返回 `null`
  - 当 HSL 颜色的 `s` 为 `undefined` 时，函数调整器会默认按 `0` 处理

## 运行逻辑

```mermaid
flowchart TD
    A[输入 color + adjuster] --> B{parseColor 解析}
    B -->|解析失败| C[返回 null]
    B -->|解析成功| D[转换为 HSL 色彩空间]
    D --> E{转换是否成功?}
    E -->|失败| C
    E -->|成功| F{adjuster 类型}
    F -->|number| G[直接赋值 newSaturation]
    F -->|function| H[调用函数，传入当前 s 值]
    H --> I{s 为 undefined?}
    I -->|是| J[使用 0 作为默认值]
    I -->|否| K[使用当前 s 值]
    J --> L[通过 clamp 截断到 [0, 1]]
    K --> L
    G --> L
    L --> M[返回调整后的 HSL 颜色对象]
```

函数首先尝试解析输入颜色，然后将其转换为 HSL 色彩空间。根据 `adjuster` 的类型决定调整方式：数值直接设置，函数则基于当前值计算。最终结果通过 `clamp` 确保饱和度在 `[0, 1]` 范围内。

## 注意事项

### 输入边界

- 颜色字符串支持所有 CSS 标准格式（hex、rgb、hsl 等），也支持 culori 扩展格式
- 颜色对象支持 `{ r, g, b }`、`{ h, s, l }` 等开发者习惯格式，会自动归一化到标准范围
- 当传入函数作为 `adjuster` 时，如果当前颜色的 `s` 为 `undefined`，默认按 `0` 处理

### 错误处理

- 此函数**不抛出异常**，所有错误情况均通过返回 `null` 表达
- 返回 `null` 的场景包括：无效颜色字符串、空字符串、`null` 输入、不支持的 `mode`、HSL 转换失败

### 性能考虑

- **时间复杂度**: O(1) — 仅涉及单次颜色解析、转换和数值计算
- **空间复杂度**: O(1) — 创建固定大小的颜色对象，无额外集合分配

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/composition/adjust-saturation/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/composition/adjust-saturation/index.test.ts)
