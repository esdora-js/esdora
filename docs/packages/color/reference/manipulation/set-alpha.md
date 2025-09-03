---
title: setAlpha
description: setAlpha - 来自 Dora Pocket 的颜色“道具”，用于设置颜色的透明度（alpha 通道）到指定值。
---

# setAlpha

<!-- 1. 简介：一句话核心功能描述 -->

设置颜色的透明度，返回一个包含新 Alpha 通道的十六进制颜色字符串。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 为红色设置 50% 的透明度
setAlpha('#ff0000', 0.5)
// => '#ff000080'

// 当透明度设置为 1 时，返回标准的 6 位十六进制颜色
setAlpha('#ff000080', 1)
// => '#ff0000'
```

### 更新已有透明度

```typescript
// 此函数会覆盖颜色原有的透明度
const semiTransparent = 'rgba(52, 152, 219, 0.3)' // 30% 透明度
setAlpha(semiTransparent, 0.8) // 更新为 80%
// => '#3498dbcc'
```

### 创建遮罩层效果

```typescript
// 为黑色设置半透明，常用于创建遮罩层
setAlpha('#000000', 0.5)
// => '#00000080'
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 设置颜色的透明度（alpha 通道）到指定值。
 *
 * 此函数会将颜色的透明度设置为指定的值，而不改变颜色的其他属性（色相、饱和度、亮度）。
 * 返回十六进制格式的颜色字符串。
 *
 * @param color 基础颜色字符串或颜色对象，支持 hex、rgb、hsl 等格式。
 * @param alpha 新的透明度值，取值范围 0-1（0 为完全透明，1 为完全不透明）。超出范围的值将被限制在 0 和 1 之间。
 * @returns 设置透明度后的十六进制颜色字符串。如果输入颜色无效，则返回 `null`。
 */
export function setAlpha(color: string | EsdoraColor, alpha: number): string | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于 `alpha` 参数**: `alpha` 的值会被严格限制在 `0` 到 `1` 的范围内。例如，输入 `-0.5` 会被当作 `0` 处理，输入 `1.5` 会被当作 `1` 处理。
- **关于输出格式**:
  - 当 `alpha` 值为 `1` 时，函数返回标准的 6 位十六进制颜色字符串（如 `#ff0000`）。
  - 当 `alpha` 值小于 `1` 时，函数返回 8 位的十六进制颜色字符串，包含透明度通道（如 `#ff000080`）。
- **关于无效输入**: 如果 `color` 参数是无效的颜色字符串、`null` 或 `undefined`，函数将返回 `null`。
- **关于输入格式**: 无论输入颜色格式是什么（如 `rgb` 或 `hsla`），`setAlpha` 函数的输出始终是十六进制字符串。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/manipulation/set-alpha/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/manipulation/set-alpha/index.ts)
