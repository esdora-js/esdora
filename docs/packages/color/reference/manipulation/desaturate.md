---
title: desaturate
description: "@esdora/color 的 desaturate 函数，按比例将颜色去饱和化，获得符合视觉感知的效果。"
---

# desaturate

按比例将颜色去饱和化，获得符合视觉感知的效果。支持比例值（0-1）或百分比值（大于 1），也支持传入自定义饱和度调整函数实现高级控制。

## 示例

### 基本用法

```typescript
import { desaturate } from '@esdora/color'

// 按比例去饱和化
desaturate('#ff0000', 0.5) // => '#bf4040'
desaturate('#00ff00', 0.3) // => '#26d926'

// 使用百分比值（大于 1 时自动转换为百分比）
desaturate('#0000ff', 50) // => '#4040bf'
```

### 边界情况

```typescript
import { desaturate } from '@esdora/color'

// amount 为 0 时颜色不变
desaturate('#ff0000', 0) // => '#ff0000'

// amount 为 1 时完全去饱和（变为灰色）
desaturate('#ff0000', 1) // => '#808080'

// 灰色、白色、黑色去饱和化后保持不变
desaturate('#808080', 0.5) // => '#808080'
desaturate('#ffffff', 0.5) // => '#ffffff'
desaturate('#000000', 0.5) // => '#000000'
```

### 不同颜色格式输入

```typescript
import { desaturate } from '@esdora/color'

// 支持多种颜色格式
desaturate('rgb(255, 0, 0)', 0.3) // => '#d92626'
desaturate('hsl(120, 100%, 50%)', 0.3) // => '#26d926'
desaturate('#f00', 0.3) // => '#d92626'
desaturate('red', 0.3) // => '#d92626'

// 带透明度的颜色返回 8 位 Hex
desaturate('rgba(255, 0, 0, 0.8)', 0.3) // => '#d92626cc'
desaturate('rgba(255, 0, 0, 0.5)', 0.3) // => '#d9262680'

// 透明度为 1 时仍返回 6 位 Hex
desaturate('rgba(255, 0, 0, 1)', 0.3) // => '#d92626'
```

### 自定义饱和度调整器

```typescript
import { desaturate } from '@esdora/color'

// 直接减少固定饱和度值
desaturate('#ff0000', s => s - 0.3) // => '#d92626'

// 设置固定饱和度值
desaturate('#ff0000', () => 0.5) // => '#bf4040'

// 复杂的饱和度计算
desaturate('#00ff00', s => Math.max(0, s * 0.7)) // => '#26d926'
```

### 实际使用场景

```typescript
import { desaturate } from '@esdora/color'

// 创建柔和的 UI 颜色
const primaryColor = '#3498db'
const softColor = desaturate(primaryColor, 0.2) // => '#4595ca'

// 创建禁用状态的颜色
const activeColor = '#e74c3c'
const disabledColor = desaturate(activeColor, 0.6) // => '#b4766f'

// 创建灰度效果
const colorfulColor = '#9b59b6'
const grayishColor = desaturate(colorfulColor, 0.8) // => '#8b7e91'

// 渐进式去饱和
const baseColor = '#f39c12'
desaturate(baseColor, 0.25) // => '#d7962e'
desaturate(baseColor, 0.5) // => '#bb8f4a'
desaturate(baseColor, 0.75) // => '#9f8966'
```

## 签名

```typescript
// 按比例/百分比去饱和化
export function desaturate(color: string | EsdoraColor, amount: number): string | null

// 使用自定义饱和度调整函数
export function desaturate(color: string | EsdoraColor, adjuster: SaturationAdjuster): string | null
```

## 参数

| 参数     | 类型                    | 描述                                                                  | 必需                     |
| -------- | ----------------------- | --------------------------------------------------------------------- | ------------------------ |
| color    | `string \| EsdoraColor` | 要操作的颜色，支持 Hex、RGB、HSL、颜色名称等格式，或 EsdoraColor 对象 | 是                       |
| amount   | `number`                | 去饱和化比例（0-1）。大于 1 时自动按百分比处理（如 `50` 表示 50%）    | 是（与 adjuster 二选一） |
| adjuster | `SaturationAdjuster`    | 自定义饱和度调整函数，接收当前饱和度 `s`（0-1），返回新的饱和度值     | 是（与 amount 二选一）   |

### SaturationAdjuster

```typescript
type SaturationAdjuster = (s: number) => number
```

- 参数 `s`：当前颜色的饱和度值，范围 0-1
- 返回值：新的饱和度值，内部会自动限制在 0-1 范围内

## 返回值

- **类型**: `string | null`
- **说明**: 返回十六进制颜色字符串。当输入颜色包含透明度（alpha < 1）时，返回 8 位小写 Hex 字符串（如 `#d92626cc`）；否则返回 6 位小写 Hex 字符串（如 `#bf4040`）。
- **特殊情况**:
  - 输入无效颜色时返回 `null`
  - 输入 `null` 或 `undefined` 时返回 `null`
  - 空字符串输入返回 `null`
  - 调整器返回负值时，饱和度会被限制为 0
  - 调整器返回超过 1 的值时，饱和度会被限制为 1

## 注意事项

### 输入边界

- `amount` 为 0 时，颜色完全不变
- `amount` 为 1 时，颜色完全去饱和化为灰色
- `amount` 大于 1 时自动除以 100 转换为百分比（如 `50` 等价于 `0.5`）
- 灰色、白色、黑色等本身饱和度为 0 的颜色，去饱和化后保持不变
- 自定义调整器返回的值会被自动限制在 0-1 范围内

### 错误处理

- 函数不会抛出异常，所有错误情况均返回 `null`
- 无效的颜色字符串（如 `'invalid-color'`）返回 `null`
- `null` 或 `undefined` 输入返回 `null`

## 相关链接

- [源码](https://github.com/kkfive/esdora/tree/main/packages/color/src/manipulation/desaturate/index.ts)
- [单元测试](https://github.com/kkfive/esdora/tree/main/packages/color/src/manipulation/desaturate/index.test.ts)
