---
title: randomColors
description: "@esdora/color 的 randomColors 函数，批量生成指定数量的随机颜色数组"
---

# randomColors

生成指定数量的随机颜色数组。基于 [`randomColor`](./random-color.md) 实现，每个颜色独立生成，可应用统一的选项约束。

## 示例

### 基本用法

```typescript
import { randomColors } from '@esdora/color'

// 生成 5 个随机颜色
randomColors(5) // => ['#a7c4e8', '#ff6b9d', '#4ecdc4', '#ffe66d', '#ff6b6b']

// 生成 3 个颜色
randomColors(3) // => ['#88d8b0', '#ff8c94', '#a8e6cf']
```

### 应用统一选项

```typescript
import { randomColors } from '@esdora/color'

// 生成 3 个明亮的颜色
randomColors(3, { preset: 'bright' }) // => ['#ff3366', '#33ff66', '#3366ff']

// 生成 4 个单色（灰度）
randomColors(4, { preset: 'monochrome' }) // => ['#808080', '#a0a0a0', '#606060', '#909090']

// 指定输出格式
randomColors(2, { format: 'rgb' }) // => ['rgb(255, 100, 100)', 'rgb(100, 255, 100)']
```

### 边界情况

```typescript
import { randomColors } from '@esdora/color'

randomColors(0) // => []（零个）
randomColors(-5) // => []（负数视为零）
randomColors(100).length // => 100
```

## 签名

```typescript
function randomColors(count: number, options?: RandomColorOptions): string[]
```

## 参数

| 参数      | 类型                                           | 描述                                    | 必需 |
| --------- | ---------------------------------------------- | --------------------------------------- | ---- |
| `count`   | `number`                                       | 要生成的颜色数量                        | 是   |
| `options` | [`RandomColorOptions`](./random-color.md#参数) | 随机颜色生成选项，与 `randomColor` 共享 | 否   |

## 返回值

- **类型**: `string[]`
- **说明**: 生成的随机颜色数组，每个元素格式由 `options.format` 决定（默认 `'hex'`）
- **特殊情况**:
  - `count` 为 0 或负数时返回空数组 `[]`
  - 若单个颜色生成失败（返回 `null`），该颜色会被跳过，实际返回数组长度可能小于 `count`（极端边界情况）

## 注意事项

### count 处理

- `count` 非正数（0 或负数）时返回空数组，不抛异常
- 内部为简单循环调用 [`randomColor`](./random-color.md)，无批量优化；超大 `count`（如百万级）可能带来性能压力

### 选项共享

- `options` 会原样传递给每次 `randomColor` 调用，所有颜色共享同一约束
- 若需要每个颜色不同约束，请循环调用 `randomColor`

## 相关链接

- [源码](https://github.com/kkfive/esdora/blob/main/packages/color/src/generation/random-colors/index.ts)
- [单元测试](https://github.com/kkfive/esdora/blob/main/packages/color/src/generation/random-colors/index.test.ts)
- [randomColor](./random-color.md) — 生成单个随机颜色，选项定义在此页
