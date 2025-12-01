---
title: adjustLightness
description: "adjustLightness - Dora Pocket 中 @esdora/color 库提供的颜色编排工具函数，用于在 OKLCH 色彩空间中以感知均匀方式调整亮度。"
---

# adjustLightness

以感知均匀的 OKLCH 色彩空间为基础，精确调整任意颜色的亮度。

## 示例

### 基本用法：设置绝对亮度值

```typescript
import { adjustLightness } from '@esdora/color'

// 将红色的亮度设置为 0.5
const mid = adjustLightness('#ff0000', 0.5)
// => { mode: 'oklch', l: 0.5, c: 0.22..., h: 29.23... }

// 将亮度设置为 1，颜色接近白色
const whiteLike = adjustLightness('#ff0000', 1)
// => { mode: 'oklch', l: 1, c: 0.22..., h: 29.23... }
```

### 使用函数进行相对调整

```typescript
import { adjustLightness } from '@esdora/color'

// 将当前亮度降低一半
const darker = adjustLightness('#ff0000', l => l * 0.5)
// => { mode: 'oklch', l: 0.31..., c: 0.22..., h: 29.23... }

// 在当前亮度基础上增加 0.2，并确保不超过 1
const lighter = adjustLightness('#ff0000', l => l + 0.2)
// => { mode: 'oklch', l: 0.82..., c: 0.22..., h: 29.23... }
```

### 处理多种输入格式与边界值

```typescript
import { adjustLightness } from '@esdora/color'

// 支持 RGB 对象
const fromRgbObject = adjustLightness({ r: 255, g: 0, b: 0 } as any, 0.3)
// => { mode: 'oklch', l: 0.3, c: 0.22..., h: 29.23... }

// 支持 HSL 字符串
const fromHsl = adjustLightness('hsl(0, 100%, 50%)', 0.7)
// => { mode: 'oklch', l: 0.7, c: 0.22..., h: 29.23... }

// 超出范围的亮度会被自动裁剪到 [0, 1]
const clampedLow = adjustLightness('#ff0000', -0.5)
// => { mode: 'oklch', l: 0, c: 0.22..., h: 29.23... }

const clampedHigh = adjustLightness('#ff0000', 1.5)
// => { mode: 'oklch', l: 1, c: 0.22..., h: 29.23... }
```

## 签名与说明

### 类型签名

```typescript
export type LightnessAdjuster = (currentLightness: number) => number

export function adjustLightness(
  color: string | EsdoraColor,
  adjuster: number | LightnessAdjuster,
): EsdoraColor | null
```

### 参数说明

| 参数     | 类型                          | 描述                                                                                    | 必需 |
| -------- | ----------------------------- | --------------------------------------------------------------------------------------- | ---- |
| color    | `string \| EsdoraColor`       | 要调整的基础颜色，可以是任意可解析的颜色字符串（HEX、RGB、HSL 等）或 `EsdoraColor` 对象 | 是   |
| adjuster | `number \| LightnessAdjuster` | 亮度调整器：可以是目标亮度值 (0 到 1)，也可以是基于当前亮度返回新亮度的函数             | 是   |

**类型别名 LightnessAdjuster**

| 名称              | 类型                                   | 描述                                     |
| ----------------- | -------------------------------------- | ---------------------------------------- |
| LightnessAdjuster | `(currentLightness: number) => number` | 接收当前亮度值并返回新的亮度值（0 到 1） |

### 返回值

- **类型**: `EsdoraColor \| null`
- **说明**:
  - 成功时返回一个 OKLCH 格式的颜色对象，`mode` 固定为 `'oklch'`，`l` 为裁剪到 `[0, 1]` 范围内的新亮度值
  - 返回的新颜色对象不会修改传入的颜色实例
- **特殊情况**:
  - 当 `color` 无法被解析为有效颜色，或内部 OKLCH 转换失败时，返回 `null`

### 泛型约束（如适用）

本函数未使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 当 `adjuster` 是数值时：
  - 传入 `0` 会将亮度设置为 `0`（接近纯黑）
  - 传入 `1` 会将亮度设置为 `1`（接近纯白）
  - 小于 `0` 的值会被自动裁剪为 `0`
  - 大于 `1` 的值会被自动裁剪为 `1`
- 当 `adjuster` 是函数时：
  - 回调参数为当前亮度 `l`，范围为 `[0, 1]`
  - 即使函数返回超出 `[0, 1]` 范围的值，也会被自动裁剪到合法区间
- 支持的输入颜色包括：
  - 常见颜色字符串：HEX、RGB、HSL 等
  - `EsdoraColor` 对象
  - culori 风格的颜色对象（如 `{ mode: 'rgb', r: 1, g: 0, b: 0 }`）

### 错误处理

- 当 `color` 为无效颜色字符串、空字符串、`null`、`undefined` 或无法解析的对象时，返回 `null`，而不会抛出异常
- 当颜色对象的 `mode` 不被内部 OKLCH 转换函数支持时，会在转换阶段失败并返回 `null`
- 建议对来自不可信数据源的颜色参数进行返回值检查，例如：

```typescript
const result = adjustLightness(userInput, 0.5)

if (!result) {
  // => 处理无效颜色输入的情况
}
```

### 性能考虑

- 时间复杂度: O(1) —— 每次调用只进行一次颜色解析、一次颜色空间转换和常数次数值运算
- 空间复杂度: O(1) —— 仅创建少量中间颜色对象和数值
- 优化建议:
  - 适合在动画、渐变生成等需要频繁调整亮度的场景中使用
  - 如需对同一颜色做多步操作，可复用解析后的 `EsdoraColor` 对象以减少重复解析

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/composition/adjust-lightness/index.ts)
