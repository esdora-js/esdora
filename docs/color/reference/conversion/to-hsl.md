---
title: toHsl
description: toHsl - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为 HSL 对象。
---

# toHsl

<!-- 1. 简介：一句话核心功能描述 -->

将任意合法的颜色字符串或颜色对象转换为一个简化的 HSL 对象。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
toHsl('#FF0000')
// => { h: 0, s: 100, l: 50 }

toHsl('rgb(0, 255, 0)')
// => { h: 120, s: 100, l: 50 }

// 对于灰度颜色，色相 (h) 和饱和度 (s) 均为 0
toHsl('#808080')
// => { h: 0, s: 0, l: 50 }
```

### 处理透明度

```typescript
// 当颜色包含透明度时，返回的对象会包含 'a' 属性
toHsl('rgba(255, 0, 0, 0.5)')
// => { h: 0, s: 100, l: 50, a: 0.5 }

// 当颜色完全不透明 (alpha = 1) 时，则不包含 'a' 属性
toHsl('rgba(255, 0, 0, 1)')
// => { h: 0, s: 100, l: 50 }
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 将任意合法的颜色字符串或颜色对象转换为 HSL 对象。
 *
 * 返回的对象包含 h (0-360)，s (0-100)，l (0-100) 属性。
 * 仅当输入颜色包含透明度 (alpha < 1) 时，返回的对象才会包含 `a` 属性。
 *
 * @param color 任意合法的颜色字符串（如 '#FF0000'）或颜色对象。
 * @returns 一个包含 h, s, l 属性的 HSL 颜色对象，如果输入无效则返回 `null`。
 */
export function toHsl(color: string | EsdoraColor): { h: number, s: number, l: number, a?: number } | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于输出格式**: 返回的对象中，`h` (色相) 的范围是 0-360，`s` (饱和度) 和 `l` (亮度) 的范围是 0-100。所有值都会被四舍五入为整数。
- **关于透明度**: 只有当颜色的 `alpha` 值小于 `1` 时，输出的对象才会包含 `a` 属性。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串、空字符串、`null`、`undefined` 或无法解析的对象时，函数将返回 `null`。
- **关于默认值**: 如果内部转换得到的 HSL 对象缺少某些值（如 `undefined`），它们将被视为 `0` 进行处理。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/color/src/conversion/to-hsl/index.ts`](hthttps://github.com/esdora-js/esdora/blob/main/packages/color/src/conversion/to-hsl/index.ts)
