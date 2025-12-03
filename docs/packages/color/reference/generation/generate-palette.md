---
title: generatePalette
description: generatePalette - 来自 Dora Pocket 的颜色“道具”，用于基于色彩理论生成和谐的调色板。
---

# generatePalette

基于一个基础颜色，根据不同的色彩和谐理论（如单色、类似色、互补色等）生成一个颜色数组。

## 示例

### 基本用法

```typescript
import { generatePalette } from '@esdora/color'

// 默认生成一个包含 5 种颜色的单色调色板（十六进制格式）
generatePalette('#3498db')
// => ['#1a5490', '#2980b9', '#3498db', '#5dade2', '#85c1e9'] // 示例输出

// 可以通过 count 控制颜色数量
generatePalette('#3498db', { type: 'monochromatic', count: 3 })
// => ['#1a5490', '#2980b9', '#5dade2'] // 示例输出
```

### 生成互补色调色板

```typescript
import { generatePalette } from '@esdora/color'

// 'complementary' 类型会生成色轮上相对的颜色
generatePalette('#ff0000', { type: 'complementary' })
// => 至少包含 '#ff0000' 和其互补色 '#00ffff'

// 可以指定生成更多数量的颜色，函数会自动调整明暗
generatePalette('#ff0000', { type: 'complementary', count: 4, includeBase: true })
// => ['#ff0000', '#00ffff', '#ff4d4d', '#00b3b3'] // 示例输出
```

### 生成类似色调色板

```typescript
import { generatePalette } from '@esdora/color'

// 'analogous' 类型会生成色轮上相邻的颜色，常用于创建柔和、自然的配色方案
generatePalette('#ff6b6b', { type: 'analogous', count: 3 })
// => ['#ff9933', '#ff6b6b', '#ff3d9e'] // 示例输出
```

### 移除基础颜色

```typescript
import { generatePalette } from '@esdora/color'

// 设置 includeBase: false 可以从结果中排除原始的基础颜色
generatePalette('#ff0000', { type: 'triadic', includeBase: false })
// => ['#00ff00', '#0000ff'] // 示例输出
```

## 签名与说明

### 类型签名

```typescript
import type { Color } from '@esdora/color'

export interface PaletteOptions {
  /** 生成的颜色数量，默认为 5 */
  count?: number
  /** 调色板类型 */
  type?: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'split-complementary'
  /** 是否包含基础颜色，默认为 true */
  includeBase?: boolean
}

export function generatePalette(
  baseColor: string | Color,
  options?: PaletteOptions,
): string[] | null
```

### 参数说明

| 参数                | 类型              | 描述                                                                                                                | 必需 |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------- | ---- |
| baseColor           | `string \| Color` | 基础颜色字符串或 `Color` 颜色对象（由 `@esdora/color` 透出），支持 HEX、RGB、HSL 等格式                             | 是   |
| options             | `PaletteOptions`  | 可选配置对象，用于控制生成数量、调色板类型以及是否包含基础颜色                                                      | 否   |
| options.count       | `number`          | 生成的颜色数量，默认值为 `5`（对部分调色板类型会被忽略，见下文注意事项）                                            | 否   |
| options.type        | 字面量联合类型    | 调色板类型：`'monochromatic'`、`'analogous'`、`'complementary'`、`'triadic'`、`'tetradic'`、`'split-complementary'` | 否   |
| options.includeBase | `boolean`         | 是否在结果中包含基础颜色本身，默认包含                                                                              | 否   |

### 返回值

- **类型**: `string[] | null`
- **说明**: 返回一个由十六进制颜色字符串组成的数组，每个元素都是以 `'#'` 开头的有效 HEX 颜色。
- **特殊情况**:
  - 当基础颜色无法解析或内部转换失败时，返回 `null`。
  - 对于部分调色板类型（如 `triadic`, `tetradic`, `split-complementary`），即使传入 `count`，返回数组长度仍然是固定的（分别为 3、4、3）。

### 泛型约束（如适用）

- 本函数不使用泛型类型参数。

## 注意事项与边界情况

- **关于输出格式**: 所有生成的颜色都将以十六进制字符串（如 `#ffffff`）的形式返回。
- **关于默认行为**: 如果不提供任何 `options`，函数将默认生成一个包含 5 种颜色的 `monochromatic` (单色) 调色板，并包含基础颜色。
- **关于无效输入**: 当 `baseColor` 参数为无效颜色字符串（如 `'invalid-color'`）、空字符串、`null` 或无法解析的对象时，函数将返回 `null`。
- **关于 `count` 选项**:
  - 对于 `triadic`, `tetradic`, `split-complementary` 类型，`count` 选项无效，它们总是返回固定数量的颜色（分别为 3, 4, 3）。
  - 对于 `monochromatic`, `analogous`, `complementary` 类型，`count` 选项有效，用于控制最终生成的颜色数量。
- **关于鲁棒性**: 即使输入的颜色对象缺少 `h`, `s`, `l` 等属性（值为 `undefined`），函数也会使用默认值 `0` 来处理，确保不会因意外输入而崩溃。

### 输入边界

- 支持 HEX、RGB、HSL 字符串以及 HSL 颜色对象作为基础颜色。
- 当基础颜色无法被解析为合法颜色时，函数返回 `null`。
- 在单色调色板中，当基础颜色本身不在自动生成的序列中时，会将基础颜色插入后按亮度排序，并截取到指定的 `count` 长度。

### 错误处理

- 内部使用颜色解析和 HSL/HEX 转换工具，当解析或转换过程中出现异常时，会返回 `null` 而不是抛出错误。
- 建议在调用方对返回值进行空值检查，并在必要时提供默认调色板或回退策略。

### 性能考虑

- 时间复杂度大致为 O(`count`)，其中 `count` 为生成的颜色数量。
- 在需要批量为大量基础颜色生成调色板的场景下，建议在业务层做结果缓存，避免对同一基础颜色反复调用。
- 由于内部依赖颜色空间转换（HSL/HEX），在性能敏感路径中应避免在动画帧中频繁创建大规模调色板。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/generation/generate-palette/index.ts)
