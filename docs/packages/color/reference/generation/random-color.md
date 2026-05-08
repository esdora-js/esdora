---
title: randomColor
description: "@esdora/color 的 randomColor 函数，根据约束条件生成随机颜色字符串"
---

# randomColor

根据约束条件生成随机颜色字符串。支持指定输出格式、色相/饱和度/亮度/透明度范围，以及多种预设类型来快速生成符合特定风格的颜色。

## 示例

### 基本用法

```typescript
import { randomColor } from '@esdora/color'

randomColor() // => '#a7c4e8'
randomColor({}) // => '#ff6b9d'
```

### 指定输出格式

```typescript
import { randomColor } from '@esdora/color'

randomColor({ format: 'hex' }) // => '#4ecdc4'
randomColor({ format: 'rgb' }) // => 'rgb(78, 205, 196)'
randomColor({ format: 'hsl' }) // => 'hsl(175, 55%, 55%)'
```

### 使用预设类型

```typescript
import { randomColor } from '@esdora/color'

randomColor({ preset: 'bright', format: 'hsl' }) // => 'hsl(340, 85%, 55%)'
randomColor({ preset: 'dark', format: 'hsl' }) // => 'hsl(210, 40%, 25%)'
randomColor({ preset: 'light', format: 'hsl' }) // => 'hsl(45, 60%, 82%)'
randomColor({ preset: 'pastel', format: 'hsl' }) // => 'hsl(280, 35%, 80%)'
randomColor({ preset: 'vibrant', format: 'hsl' }) // => 'hsl(120, 90%, 55%)'
randomColor({ preset: 'monochrome', format: 'hsl' }) // => 'hsl(0, 0%, 45%)'
```

### 指定参数范围

```typescript
import { randomColor } from '@esdora/color'

// 色相范围：红色到黄色
randomColor({ hue: [0, 60], saturation: [70, 100], lightness: [40, 60], format: 'hsl' })
// => 'hsl(30, 85%, 50%)'

// 固定色相，随机饱和度，固定亮度
randomColor({ hue: 120, saturation: 'random', lightness: 50, format: 'hsl' })
// => 'hsl(120, 65%, 50%)'
```

### 透明度控制

```typescript
import { randomColor } from '@esdora/color'

randomColor({ alpha: 0.5, format: 'rgb' }) // => 'rgba(120, 80, 200, 0.5)'
randomColor({ alpha: [0.3, 0.7], format: 'rgb' }) // => 'rgba(120, 80, 200, 0.55)'
```

## 签名

```typescript
export interface RandomColorOptions {
  format?: 'hex' | 'rgb' | 'hsl'
  hue?: number | [number, number] | 'random'
  saturation?: number | [number, number] | 'random'
  lightness?: number | [number, number] | 'random'
  alpha?: number | [number, number] | 'random'
  preset?: 'bright' | 'dark' | 'light' | 'pastel' | 'vibrant' | 'monochrome'
}

export function randomColor(options?: RandomColorOptions): string | null
```

## 参数

| 参数    | 类型                 | 描述             | 必需 |
| ------- | -------------------- | ---------------- | ---- |
| options | `RandomColorOptions` | 随机颜色生成选项 | 否   |

### RandomColorOptions

| 字段       | 类型                                                                     | 描述                       | 默认值     |
| ---------- | ------------------------------------------------------------------------ | -------------------------- | ---------- |
| format     | `'hex' \| 'rgb' \| 'hsl'`                                                | 输出颜色格式               | `'hex'`    |
| hue        | `number \| [number, number] \| 'random'`                                 | 色相约束（0-360）          | `'random'` |
| saturation | `number \| [number, number] \| 'random'`                                 | 饱和度约束（0-100 或 0-1） | `'random'` |
| lightness  | `number \| [number, number] \| 'random'`                                 | 亮度约束（0-100 或 0-1）   | `'random'` |
| alpha      | `number \| [number, number] \| 'random'`                                 | 透明度约束（0-1）          | `'random'` |
| preset     | `'bright' \| 'dark' \| 'light' \| 'pastel' \| 'vibrant' \| 'monochrome'` | 预设颜色类型               | —          |

#### 预设类型说明

| 预设         | 饱和度 | 亮度  | 效果       |
| ------------ | ------ | ----- | ---------- |
| `bright`     | 70-100 | 45-65 | 明亮的颜色 |
| `dark`       | 随机   | 10-40 | 深色       |
| `light`      | 20-80  | 70-95 | 浅色       |
| `pastel`     | 20-50  | 70-90 | 柔和色     |
| `vibrant`    | 80-100 | 40-70 | 鲜艳色     |
| `monochrome` | 0      | 随机  | 单色/灰度  |

## 返回值

- **类型**: `string \| null`
- **说明**: 生成的随机颜色字符串，格式由 `format` 选项决定
- **特殊情况**:
  - 当 `format` 为 `'hex'` 时返回 `'#rrggbb'` 格式（如 `'#a7c4e8'`）
  - 当 `format` 为 `'rgb'` 时返回 `'rgb(r, g, b)'` 或 `'rgba(r, g, b, a)'` 格式
  - 当 `format` 为 `'hsl'` 时返回 `'hsl(h, s%, l%)'` 或 `'hsla(h, s%, l%, a)'` 格式
  - 当传入无效 `format` 时回退到 `hex` 格式
  - 底层生成失败时可能返回 `null`

## 注意事项

### 输入边界

- `hue` 范围为 0-360，超出范围的值由底层 culori 库处理，不会抛异常
- `saturation` 和 `lightness` 支持两种表示方式：
  - 百分比值（1-100），如 `saturation: 80` 表示 80%
  - 小数（0-1），如 `saturation: 0.8` 同样表示 80%
- `alpha` 范围为 0-1，超出范围的行为由底层库决定
- 预设与显式参数同时存在时，显式参数优先级更高（预设作为默认值）
- 未知预设名称会被忽略，回退到完全随机生成

### 错误处理

- 函数**不抛出异常**，所有边界情况均静默处理
- 空选项对象 `{}` 等价于无参调用
- 无效 `format` 值回退到默认 `'hex'` 格式
- 负数 `count`（`randomColors`）返回空数组

### 性能考虑

- **时间复杂度**: O(1) — 单次随机颜色生成
- **空间复杂度**: O(1) — 仅创建少量中间对象

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/generation/random-color/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/generation/random-color/index.test.ts)
