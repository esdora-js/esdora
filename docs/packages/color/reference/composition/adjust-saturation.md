---
title: adjustSaturation
description: "adjustSaturation - Dora Pocket 中 @esdora/color 库提供的颜色编排工具函数，用于在 HSL 色彩空间中精确调整饱和度。"
---

# adjustSaturation

在 HSL 色彩空间中精确调整任意颜色的饱和度。

## 示例

### 基本用法：设置绝对饱和度值

```typescript
import { adjustSaturation } from '@esdora/color'

// 将红色的饱和度直接设置为 0.5
const half = adjustSaturation('#ff0000', 0.5)
// => { mode: 'hsl', h: 0, s: 0.5, l: 0.5, alpha: 1 }

// 将饱和度设置为 0，颜色变为灰色
const gray = adjustSaturation('#ff0000', 0)
// => { mode: 'hsl', h: 0, s: 0, l: 0.5, alpha: 1 }
```

### 使用函数进行相对调整

```typescript
import { adjustSaturation } from '@esdora/color'

// 将当前饱和度降低一半
const reduced = adjustSaturation('#ff0000', s => s * 0.5)
// => { mode: 'hsl', h: 0, s: 0.5, l: 0.5, alpha: 1 }

// 在当前饱和度基础上增加 0.2，并确保不超过 1
const increased = adjustSaturation('hsl(0, 50%, 50%)', s => s + 0.2)
// => { mode: 'hsl', h: 0, s: 0.7, l: 0.5, alpha: 1 }
```

### 处理边界值和未定义饱和度

```typescript
import { adjustSaturation } from '@esdora/color'

// 超出范围的饱和度会被自动裁剪到 [0, 1]
const clampedLow = adjustSaturation('#ff0000', -0.5)
// => { mode: 'hsl', h: 0, s: 0, l: 0.5, alpha: 1 }

const clampedHigh = adjustSaturation('#ff0000', 1.5)
// => { mode: 'hsl', h: 0, s: 1, l: 0.5, alpha: 1 }

// 当饱和度为 undefined 时默认为 0，再进行调整
const edgeCaseColor = {
  mode: 'hsl',
  h: 0,
  s: undefined,
  l: 0.5,
  alpha: 1,
} as any

const fromUndefined = adjustSaturation(edgeCaseColor, s => s + 0.5)
// => { mode: 'hsl', h: 0, s: 0.5, l: 0.5, alpha: 1 }
```

## 签名与说明

### 类型签名

```typescript
export type SaturationAdjuster = (currentSaturation: number) => number

export function adjustSaturation(
  color: string | EsdoraColor,
  adjuster: number | SaturationAdjuster,
): EsdoraColor | null
```

### 参数说明

| 参数     | 类型                           | 描述                                                                                    | 必需 |
| -------- | ------------------------------ | --------------------------------------------------------------------------------------- | ---- |
| color    | `string \| EsdoraColor`        | 要调整的基础颜色，可以是任意可解析的颜色字符串（HEX、RGB、HSL 等）或 `EsdoraColor` 对象 | 是   |
| adjuster | `number \| SaturationAdjuster` | 饱和度调整器：可以是目标饱和度值 (0 到 1)，也可以是基于当前饱和度返回新饱和度的函数     | 是   |

**类型别名 SaturationAdjuster**

| 名称               | 类型                                    | 描述                                         |
| ------------------ | --------------------------------------- | -------------------------------------------- |
| SaturationAdjuster | `(currentSaturation: number) => number` | 接收当前饱和度值并返回新的饱和度值（0 到 1） |

### 返回值

- **类型**: `EsdoraColor \| null`
- **说明**:
  - 成功时返回一个 HSL 格式的颜色对象，`mode` 为 `'hsl'`，`s` 为裁剪到 `[0, 1]` 范围内的新饱和度值
  - 返回的新颜色对象不会修改传入的颜色实例
- **特殊情况**:
  - 当 `color` 无法被解析为有效颜色，或内部 HSL 转换失败时（例如 `mode` 非法），返回 `null`

### 泛型约束（如适用）

本函数未使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 当 `adjuster` 是数值时：
  - 传入 `0` 会将饱和度设置为 `0`（无彩度，接近灰色）
  - 传入 `1` 会将饱和度设置为 `1`（最鲜艳的饱和度）
  - 小于 `0` 的值会被自动裁剪为 `0`
  - 大于 `1` 的值会被自动裁剪为 `1`
- 当 `adjuster` 是函数时：
  - 回调参数为当前饱和度 `s`，范围为 `[0, 1]`，当原始颜色的 `s` 为 `undefined` 时，会被视为 `0`
  - 即使函数返回超出 `[0, 1]` 范围的值，也会被自动裁剪到合法区间
- 支持的输入颜色包括：
  - 常见颜色字符串：HEX、RGB、HSL 等
  - `EsdoraColor` 对象
  - HSL 颜色对象（如 `{ mode: 'hsl', h: 0, s: 0.5, l: 0.5, alpha: 1 }`）

### 错误处理

- 当 `color` 为无效颜色字符串、空字符串、`null` 或 `undefined` 时，返回 `null`，而不会抛出异常
- 当颜色对象的 `mode` 不被内部 HSL 转换函数支持时，会在转换阶段失败并返回 `null`
- 建议在处理用户输入或外部数据源时对返回值进行空值检查，例如：

```typescript
const result = adjustSaturation(userInput, 0.5)

if (!result) {
  // => 处理无效颜色输入或转换失败的情况
}
```

### 性能考虑

- 时间复杂度: O(1) —— 每次调用只进行一次颜色解析、一次颜色空间转换和常数次数值运算
- 空间复杂度: O(1) —— 仅创建少量中间颜色对象和数值
- 优化建议:
  - 适合在色板编辑器、可视化配置面板等高频调整饱和度的场景中使用
  - 若需链式调用多个颜色操作，可考虑统一在 HSL 或 OKLCH 颜色空间中进行，以减少重复转换

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/composition/adjust-saturation/index.ts)
