---
title: isDark
description: isDark - 来自 Dora Pocket 的颜色“道具”，用于判断一个颜色是亮色还是暗色。
---

# isDark

<!-- 1. 简介：一句话核心功能描述 -->

基于 OKLCH 颜色空间的感知亮度，判断一个颜色是亮色还是暗色。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 亮色
isDark('#FFFFFF') // => false
isDark('yellow') // => false

// 暗色
isDark('#000000') // => true
isDark('#000080') // => true
```

### 多种颜色格式支持

函数可以处理多种常见的颜色格式输入。

```typescript
// HSL 字符串
isDark('hsl(0, 0%, 0%)')
// => true

// 颜色对象
isDark({ mode: 'rgb', r: 255, g: 255, b: 255 })
// => false
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 检查一个颜色是否是“暗色”。
 *
 * 该函数通过将颜色转换为 OKLCH 颜色空间并检查其亮度（L）通道来实现。
 * 当亮度值小于 0.5 时，颜色被认为是暗色。
 *
 * @param color 要检查的颜色。支持 Hex, RGB, HSL 等格式的字符串或 EsdoraColor 对象。
 * @returns 如果颜色被认为是暗色，则返回 `true`；如果是亮色，则返回 `false`。如果输入是无效的颜色，则返回 `null`。
 */
export function isDark(color: string | EsdoraColor): boolean | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **判断依据**: 本函数使用 OKLCH 颜色空间的亮度通道作为判断标准，阈值为 `0.5`。亮度值小于 `0.5` 被视为暗色，等于或大于 `0.5` 则被视为亮色。
- **关于无效输入**: 当传入无法解析的颜色字符串（如 `'invalid'`）、`null`、`undefined` 或无效的颜色对象时，函数将返回 `null`。
- **关于转换失败**: 即使颜色可以被初步解析，但如果无法成功转换为 OKLCH 格式，函数同样会返回 `null` 以表示操作失败。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/analysis/is-dark/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/analysis/is-dark/index.ts)
