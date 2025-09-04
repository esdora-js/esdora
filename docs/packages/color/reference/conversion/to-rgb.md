---
title: toRgb
description: toRgb - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为 RGB 对象。
---

# toRgb

<!-- 1. 简介：一句话核心功能描述 -->

将任意合法的颜色字符串或颜色对象转换为一个简化的 RGB 对象。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 函数可以接受多种颜色格式
toRgb('#FF0000')
// => { r: 255, g: 0, b: 0 }

toRgb('hsl(120, 100%, 50%)')
// => { r: 0, g: 255, b: 0 }

toRgb('#808080')
// => { r: 128, g: 128, b: 128 }
```

### 处理透明度

```typescript
// 当颜色包含透明度时，返回的对象会包含 'a' 属性
toRgb('rgba(255, 0, 0, 0.5)')
// => { r: 255, g: 0, b: 0, a: 0.5 }

// 当颜色完全不透明 (alpha = 1) 时，则不包含 'a' 属性
toRgb('rgba(0, 0, 255, 1)')
// => { r: 0, g: 0, b: 255 }
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 将任意合法的颜色字符串或颜色对象转换为 RGB 对象。
 *
 * 返回的对象包含 `r`, `g`, `b` 属性，其值的范围是 0 到 255。
 * 仅当输入颜色包含透明度 (alpha < 1) 时，返回的对象才会包含 `a` 属性，其
 * 值的范围是 0 到 1。
 *
 * @param color 任意合法的颜色字符串（如 '#FF0000'）或颜色对象。
 * @returns 一个包含 r, g, b 属性的 RGB 颜色对象，如果输入无效则返回 `null`。
 */
export function toRgb(color: string | EsdoraColor): { r: number, g: number, b: number, a?: number } | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于输出范围**: 返回对象中的 `r`, `g`, `b` 值均被四舍五入为 0-255 范围内的整数。`a` 值为 0-1 范围内的浮点数。
- **关于透明度**: 只有当颜色的 `alpha` 值小于 `1` 时，输出的对象才会包含 `a` 属性。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串（如 `'invalid-color'`）、空字符串、`null` 或无法解析的对象时，函数将返回 `null`。
- **关于默认值**: 如果内部转换得到的 RGB 对象缺少某些值（如 `undefined`），它们将被视为 `0` 进行处理，最终输出 `{ r: 0, g: 0, b: 0 }`。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/conversion/to-rgb/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/conversion/to-rgb/index.ts)
