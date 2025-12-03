---
title: adjustHue
description: "adjustHue - Dora Pocket 中 @esdora/color 库提供的颜色编排工具函数，用于在 OKLCH 色彩空间中以感知均匀方式调整色相。"
---

# adjustHue

以感知均匀的 OKLCH 色彩空间为基础，精确调整任意颜色的色相。

## 示例

### 基本用法：设置绝对色相值

```typescript
import { adjustHue } from '@esdora/color'

// 将红色的色相设置为 180 度 (变为接近青色)
const cyanLike = adjustHue('#FF0000', 180)
// => { mode: 'oklch', l: 0.62..., c: 0.22..., h: 180 }

// 设置一个负值，它会自动标准化到 0-360 范围内
const wrapped = adjustHue('#FF0000', -30) // 等同于 330 度
// => { mode: 'oklch', l: 0.62..., c: 0.22..., h: 330 }
```

### 使用函数进行相对调整

```typescript
import { adjustHue } from '@esdora/color'

// 在当前色相基础上增加 30 度
// 红色 (OKLCH 色相约为 29.23) + 30 度
const shifted = adjustHue('#FF0000', h => h + 30)
// => { mode: 'oklch', l: 0.62..., c: 0.22..., h: 59.23... }

// 即使结果超出 360，也会被自动标准化
const normalized = adjustHue('hsl(350, 100%, 50%)', h => h + 20) // 350 + 20 = 370 -> 10
// => { mode: 'oklch', l: 0.62..., c: 0.22..., h: 10 }
```

### 处理多种输入格式与无效输入

```typescript
import { adjustHue } from '@esdora/color'

// 支持 RGB 对象
const fromRgbObject = adjustHue({ r: 255, g: 0, b: 0 } as any, 120)
// => { mode: 'oklch', l: 0.62..., c: 0.22..., h: 120 }

// 支持 culori 风格的颜色对象
const fromCulori = adjustHue({ mode: 'rgb', r: 1, g: 0, b: 0 }, 60)
// => { mode: 'oklch', l: 0.62..., c: 0.22..., h: 60 }

// 无效颜色输入时返回 null
const invalid = adjustHue('invalid-color', 180)
// => null
```

## 签名与说明

### 类型签名

```typescript
export type HueAdjuster = (currentHue: number) => number

export function adjustHue(
  color: string | EsdoraColor,
  adjuster: number | HueAdjuster,
): EsdoraColor | null
```

### 参数说明

| 参数     | 类型                    | 描述                                                                                    | 必需 |
| -------- | ----------------------- | --------------------------------------------------------------------------------------- | ---- |
| color    | `string \| EsdoraColor` | 要调整的基础颜色，可以是任意可解析的颜色字符串（HEX、RGB、HSL 等）或 `EsdoraColor` 对象 | 是   |
| adjuster | `number \| HueAdjuster` | 色相调整器：可以是目标色相值（单位：度），也可以是基于当前色相返回新色相的函数          | 是   |

**类型别名 HueAdjuster**

| 名称        | 类型                             | 描述                                   |
| ----------- | -------------------------------- | -------------------------------------- |
| HueAdjuster | `(currentHue: number) => number` | 接收当前色相值并返回新的色相值（度数） |

### 返回值

- **类型**: `EsdoraColor \| null`
- **说明**:
  - 成功时返回一个 OKLCH 格式的颜色对象，`mode` 固定为 `'oklch'`，`h` 为标准化后的新色相值
  - 返回的颜色对象为新对象，不会修改传入的颜色实例
- **特殊情况**:
  - 当 `color` 无法被解析为有效颜色，或内部 OKLCH 转换失败时，返回 `null`

### 泛型约束（如适用）

本函数未使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 当 `adjuster` 是数值时：
  - 传入 `0` 会将色相设置为 `0` 度
  - 传入 `360` 会被标准化为 `0` 度
  - 传入大于 `360` 的值（如 `450`、`720`）会被自动折返到 `[0, 360)` 范围内
  - 传入负值（如 `-30`、`-390`）也会被折返到 `[0, 360)` 范围内
- 当 `adjuster` 是函数时：
  - 回调参数始终为当前色相的数值（如果原始颜色没有色相，则视为 `0`）
  - 即使回调返回超出范围的色相值，也会被自动标准化到 `[0, 360)` 范围内
- 支持的输入颜色包括：
  - 常见颜色字符串：HEX、RGB、HSL 等
  - `EsdoraColor` 对象
  - culori 风格的颜色对象（如 `{ mode: 'rgb', r: 1, g: 0, b: 0 }`）

### 错误处理

- 当 `color` 为无效颜色字符串、空字符串、`null`、`undefined` 或无法解析的对象时，返回 `null`，而不会抛出异常
- 当颜色对象的 `mode` 不被内部 OKLCH 转换函数支持时，会在转换阶段失败并返回 `null`
- 建议在处理外部输入时对返回值进行空值检查，例如：

```typescript
const result = adjustHue(userInput, 180)

if (!result) {
  // => 处理无效颜色输入的情况
}
```

### 性能考虑

- 时间复杂度: O(1) —— 每次调用只进行一次颜色解析、一次颜色空间转换和常数次数值运算
- 空间复杂度: O(1) —— 仅创建少量中间颜色对象和数值
- 优化建议:
  - 适合在交互场景中高频调用（如滑块实时调整色相）
  - 如果需要对同一颜色进行多次复杂操作，可以考虑复用解析后的 `EsdoraColor` 对象，再组合使用其他颜色工具函数

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/composition/adjust-hue/index.ts)
