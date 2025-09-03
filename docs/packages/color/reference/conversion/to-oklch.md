---
title: toOklch
description: toOklch - 来自 Dora Pocket 的颜色“道具”，用于将任意颜色格式转换为 OKLCH 对象。
---

# toOklch

<!-- 1. 简介：一句话核心功能描述 -->

将任意合法的颜色字符串或颜色对象转换为一个简化的 OKLCH 对象。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
toOklch('#FF0000')
// => { l: 0.628, c: 0.258, h: 29.234 }

toOklch('hsl(0, 100%, 50%)')
// => { l: 0.628, c: 0.258, h: 29.234 }

// 对于灰度颜色，色度 (c) 和色相 (h) 均为 0
toOklch('#808080')
// => { l: 0.6, c: 0, h: 0 }
```

### 处理透明度

```typescript
// 当颜色包含透明度时，返回的对象会包含 'a' 属性
toOklch('rgba(255, 0, 0, 0.5)')
// => { l: 0.628, c: 0.258, h: 29.234, a: 0.5 }

// 当颜色完全不透明 (alpha = 1) 时，则不包含 'a' 属性
toOklch('rgba(255, 0, 0, 1)')
// => { l: 0.628, c: 0.258, h: 29.234 }
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 将任意合法的颜色字符串或颜色对象转换为 OKLCH 对象。
 *
 * OKLCH 是一种感知上更均匀的颜色空间，特别适合颜色操作和生成色阶。
 * 返回的对象包含 `l` (感知亮度, 0-1)，`c` (色度)，`h` (色相, 0-360) 属性。
 * 仅当输入颜色包含透明度 (alpha < 1) 时，返回的对象才会包含 `a` 属性。
 *
 * @param color 任意合法的颜色字符串（如 '#FF0000'）或颜色对象。
 * @returns 一个包含 l, c, h 属性的 OKLCH 颜色对象，如果输入无效则返回 `null`。
 */
export function toOklch(color: string | EsdoraColor): { l: number, c: number, h: number, a?: number } | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于输出精度**: 返回的对象中，`l`, `c`, `h` 的值均被四舍五入保留 3 位小数。
- **关于透明度**: 只有当颜色的 `alpha` 值小于 `1` 时，输出的对象才会包含 `a` 属性。
- **关于无效输入**: 当 `color` 参数为无效颜色字符串、空字符串、`null` 或无法解析的对象时，函数将返回 `null`。
- **关于灰度色**: 对于没有色相的颜色（如黑、白、灰），其色度 `c` 和色相 `h` 值均为 `0`。
- **关于默认值**: 如果内部转换得到的 OKLCH 对象缺少某些值（如 `undefined`），它们将被视为 `0` 进行处理。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/conversion/to-oklch/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/conversion/to-oklch/index.ts)
