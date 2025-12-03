title: randomColor
description: "randomColor / randomColors - Dora Pocket 中 @esdora/color 提供的颜色生成工具函数，用于根据可配置约束生成随机颜色或颜色数组。"

---

# randomColor / randomColors

生成一个或多个具有可配置约束（色相、饱和度、亮度、透明度、输出格式、预设风格）的随机颜色。

## 示例

### 基本用法

```typescript
import { randomColor, randomColors } from '@esdora/color'

// 不带任何参数，生成一个随机的十六进制颜色
randomColor() // => '#a3b8d1'

// 使用 randomColors 生成一个包含 3 个随机颜色的数组
randomColors(3) // => ['#f1c40f', '#8e44ad', '#3498db']
```

### 指定格式与预设

```typescript
import { randomColor, randomColors } from '@esdora/color'

// 生成一个柔和色调 (pastel) 的 HSL 格式颜色
randomColor({ preset: 'pastel', format: 'hsl' }) // => 'hsl(208.7, 33.3%, 80%)'

// 生成一组 4 个深色的 RGB 格式颜色
randomColors(4, { preset: 'dark', format: 'rgb' })
// => ['rgb(52, 73, 94)', 'rgb(120, 2, 45)', 'rgb(22, 102, 98)', 'rgb(91, 44, 111)']
```

### 自定义范围与透明度

```typescript
import { randomColor } from '@esdora/color'

// 生成一个指定范围内的、半透明的 RGBA 颜色
randomColor({
  hue: [0, 60], // 红色到黄色之间
  lightness: [70, 90], // 较亮的颜色
  alpha: 0.5, // 50% 的透明度
  format: 'rgb'
})
// => 'rgba(255, 230, 204, 0.5)'
```

## 签名与说明

### 类型签名

```typescript
export interface RandomColorOptions {
  format?: 'hex' | 'rgb' | 'hsl'
  preset?: 'bright' | 'dark' | 'light' | 'pastel' | 'vibrant' | 'monochrome'
  hue?: number | [number, number] | 'random'
  saturation?: number | [number, number] | 'random'
  lightness?: number | [number, number] | 'random'
  alpha?: number | [number, number] | 'random'
}

export function randomColor(options?: RandomColorOptions): string | null

export function randomColors(count: number, options?: RandomColorOptions): string[]
```

### 参数说明

| 参数                 | 类型                                     | 描述                                                                                                       | 必需 |
| -------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---- |
| `options`            | `RandomColorOptions`                     | 随机颜色生成配置对象，用于约束色相、饱和度、亮度、透明度及输出格式和预设类型。                             | 否   |
| `options.format`     | `'hex' \| 'rgb' \| 'hsl'`                | 输出格式，默认值为 `'hex'`。指定为 `'rgb'` 时返回 `rgb(...)`/`rgba(...)` 字符串，`'hsl'` 类似。            | 否   |
| `options.preset`     | 字面量联合类型                           | 预设颜色风格：`'bright'`、`'dark'`、`'light'`、`'pastel'`、`'vibrant'`、`'monochrome'`。                   | 否   |
| `options.hue`        | `number \| [number, number] \| 'random'` | 色相约束，取值范围约为 `0-360`；可指定固定值或 `[最小值, 最大值]` 范围，也可以设置为 `'random'` 不做约束。 | 否   |
| `options.saturation` | `number \| [number, number] \| 'random'` | 饱和度约束，支持 `0-1` 的小数或 `0-100` 的百分比数值/范围，函数内部会自动归一化。                          | 否   |
| `options.lightness`  | `number \| [number, number] \| 'random'` | 亮度约束，支持 `0-1` 的小数或 `0-100` 的百分比数值/范围，函数内部会自动归一化。                            | 否   |
| `options.alpha`      | `number \| [number, number] \| 'random'` | 透明度约束，取值范围为 `0-1` 或 `[最小值, 最大值]`；设置为 `'random'` 时不限制透明度。                     | 否   |
| `count`              | `number`                                 | `randomColors` 中要生成的颜色数量，`count <= 0` 时返回空数组。                                             | 是   |

### 返回值

- **类型**: `string \| null`（`randomColor`） / `string[]`（`randomColors`）
- **说明**:
  - `randomColor` 返回符合约束条件的单个颜色字符串，格式取决于 `options.format`。
  - `randomColors` 返回颜色字符串数组，每个元素都通过一次 `randomColor` 调用生成。
- **特殊情况**:
  - 当 `count` 小于或等于 `0` 时，`randomColors` 返回空数组。
  - `randomColor` 的类型签名包含 `null`，调用方在类型层面应考虑极端情况下的空值分支。

### 泛型约束（如适用）

本模块不使用泛型类型参数。

## 注意事项与边界情况

### 输入边界

- 如果未指定 `format`，`randomColor` 和 `randomColors` 默认返回十六进制 (`hex`) 格式的颜色字符串（例如 `#a3b8d1`）。
- `saturation` 和 `lightness` 支持 `0-1` 和 `0-100` 两种表示方式；当传入大于 `1` 的数值或范围（如 `80` 或 `[30, 70]`）时，内部会按百分比自动转换。
- `hue`、`saturation`、`lightness`、`alpha` 设置为 `'random'` 时，对应通道不施加额外约束，由底层随机引擎自行决定。
- `randomColors` 在 `count <= 0`（如 `0` 或负数）时直接返回空数组，不会尝试生成颜色。
- 当提供的约束超出推荐范围（例如 `hue: 400`、`saturation: 150`、`lightness: -10`）时，底层颜色库会进行归一化处理，仍然返回合法的颜色字符串。

### 错误处理

- 函数内部未对底层随机颜色生成过程做显式的 `try/catch` 包裹。
- 在正常使用（传入合法配置对象）的情况下，测试覆盖表明不会抛出异常，并能返回符合约束的字符串。
- 若在业务上允许用户直接输入复杂约束（特别是不受控的对象），建议在调用处进行参数校验，或额外包裹一层 `try/catch` 以兜底处理潜在的底层异常。

### 性能考虑

- **时间复杂度**:
  - `randomColor` 为 O(1)，每次调用只生成一个颜色。
  - `randomColors` 约为 O(`count`)，对每个元素调用一次 `randomColor`。
- **空间复杂度**:
  - `randomColor` 为 O(1)。
  - `randomColors` 为 O(`count`)，返回数组长度与生成的颜色数量成正比。
- **优化建议**:
  - 在需要批量生成大量随机颜色时，可优先使用 `randomColors` 一次性生成，而不是在循环中反复调用 `randomColor`。
  - 当 `count` 非常大（例如上万级别）时，建议结合业务场景控制上限或分批生成，以避免在短时间内创建过多字符串对象。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/generation/random-color/index.ts)
