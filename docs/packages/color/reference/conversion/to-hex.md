---
title: toHex
description: toHex - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为十六进制 (HEX) 字符串。
---

# toHex

将任意合法的颜色字符串或颜色对象转换为标准的十六进制 (HEX) 颜色字符串。

## 示例

### 基本用法

```typescript
import { toHex } from '@esdora/color'

toHex('rgb(255, 0, 0)') // => '#ff0000'
toHex('#00ff00') // => '#00ff00'
toHex({ r: 0, g: 0, b: 255, mode: 'rgb' }) // => '#0000ff'
```

### 处理透明度

```typescript
import { toHex } from '@esdora/color'

// 当颜色包含透明度时，会自动输出 8 位的十六进制字符串 (HEXA)
toHex('rgba(255, 0, 0, 0.5)') // => '#ff000080'

// 完全不透明时，则输出标准的 6 位十六进制
toHex('rgba(0, 0, 255, 1)') // => '#0000ff'
```

### 处理无效输入

```typescript
import { toHex } from '@esdora/color'

toHex('invalid-color') // => null
toHex('') // => null
```

## 签名与说明

### 类型签名

```typescript
export function toHex(color: string | EsdoraColor): string | null
```

### 参数说明

| 参数  | 类型                    | 描述                                                                                 | 必需 |
| ----- | ----------------------- | ------------------------------------------------------------------------------------ | ---- |
| color | `string \| EsdoraColor` | 任意合法的颜色表示，可以是 HEX/RGB/HSL 等 CSS 颜色字符串，或 Culori 支持的颜色对象。 | 是   |

### 返回值

- **类型**: `string | null`
- **说明**: 当解析成功时，返回以 `#` 开头的小写十六进制颜色字符串；根据透明度不同，可能为 6 位或 8 位。
- **特殊情况**: 当颜色无法解析或输入不合法（如无效字符串、`null`、`undefined` 等）时，返回 `null`，而不是抛出异常。

### 泛型约束（如适用）

本函数不使用泛型参数。

## 注意事项与边界情况

### 输入边界

- 支持 HEX 短格式（如 `#f00`）和长格式（如 `#ff0000`），短格式会自动展开为 6 位。
- 可以接受多种颜色表示形式，包括 HEX、RGB、HSL 字符串以及相应的颜色对象。
- 在未开启类型检查的运行环境中，如果传入 `null` 或 `undefined` 等非字符串值，函数会返回 `null`。

### 错误处理

- **异常类型**: 函数本身不会主动抛出异常，解析失败时通过返回值 `null` 表达错误。
- **处理建议**: 调用方应在使用前判断返回值是否为 `null`，例如在 UI 层回退到默认颜色或提示用户输入不合法。

### 性能考虑

- **时间复杂度**: O(1) —— 每次调用只对单个颜色值进行解析和格式化。
- **空间复杂度**: O(1) —— 仅创建少量中间对象，不随输入大小线性增长。
- **优化建议**: 适合在渲染流程中高频调用；如果需要对大量固定颜色重复转换，可以在业务层做简单缓存以减少重复解析。

## 相关链接

- [源码](https://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-hex/index.ts)
