---
title: toHex
description: toHex - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为十六进制 (HEX) 字符串。
---

# toHex

<!-- 1. 简介：一句话核心功能描述 -->

将任意合法的颜色字符串或颜色对象转换为十六进制 (HEX) 字符串。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
toHex('rgb(255, 0, 0)')
// => '#ff0000'

toHex({ h: 0, s: 100, l: 50, mode: 'hsl' })
// => '#ff0000'

// 能够解析并格式化短格式的十六进制
toHex('#f00')
// => '#ff0000'
```

### 处理透明度

```typescript
// 当颜色包含透明度时，会自动输出 8 位的十六进制字符串 (HEXA)
toHex('rgba(255, 0, 0, 0.5)')
// => '#ff000080'

// 完全不透明时，则输出标准的 6 位十六进制
toHex('rgba(0, 0, 255, 1)')
// => '#0000ff'
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 将任意合法的颜色字符串或颜色对象转换为十六进制 (HEX) 颜色字符串。
 *
 * 如果输入颜色包含透明度（alpha < 1），函数会自动返回一个 8 位的
 * 十六进制字符串（HEXA）；否则，返回标准的 6 位字符串。
 *
 * @param color 任意合法的颜色字符串（如 'rgb(255,0,0)', '#f00'）或颜色对象。
 * @returns 一个以 '#' 开头的 6 位或 8 位十六进制颜色字符串，如果输入无效则返回 null。
 */
export function toHex(color: string | EsdoraColor): string | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **自动格式选择**: 函数会根据颜色的 `alpha` (透明度) 值自动决定输出格式。如果 `alpha` 小于 `1`，则输出 `#rrggbbaa` 格式；否则输出 `#rrggbb` 格式。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串（如 `'invalid-color'`）、空字符串、`null` 或 `undefined` 时，函数将返回 `null`。
- **输入灵活性**: 函数内部使用强大的颜色解析器，可以接受多种格式的输入，包括但不限于 HEX、RGB、HSL、颜色名称以及各类颜色对象。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/conversion/to-hex/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/conversion/to-hex/index.ts)
