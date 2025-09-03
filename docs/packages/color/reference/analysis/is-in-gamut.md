---
title: isInGamut
description: isInGamut - 来自 Dora Pocket 的颜色“道具”，用于检查一个颜色是否在指定的色域（如 RGB 或 P3）范围内。
---

# isInGamut

<!-- 1. 简介：一句话核心功能描述 -->

检查一个颜色是否在指定的色域（如 RGB 或 P3）范围内。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 默认检查 sRGB 色域
isInGamut('#FF0000')
// => true

isInGamut('hsl(0, 100%, 50%)') // 同样是红色
// => true
```

### 检查 P3 色域

```typescript
// 红色在 P3 色域内
isInGamut('#FF0000', 'p3')
// => true

// 标准的 sRGB 蓝色实际上超出了 P3 色域
isInGamut('#0000FF', 'p3')
// => false
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 检查一个颜色是否在指定的色域范围内。
 * @param color 要检查的颜色字符串（如 'red', '#FF0000', 'rgb(255,0,0)'）或颜色对象
 * @param gamut 目标色域，支持 'rgb' 和 'p3'
 * @default
 * @returns 如果颜色在指定色域内，则返回 `true`；如果超出色域，则返回 `false`；如果输入无效，则返回 `null`
 */
export function isInGamut(color: string | EsdoraColor, gamut: 'rgb' | 'p3' = 'rgb'): boolean | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于无效输入**: 当 `color` 参数为无效的颜色字符串（如 `'invalid-color'`, `''`）、`null`、`undefined` 或无法解析的对象时，函数将返回 `null`。
- **关于内部转换失败**: 如果提供的颜色对象格式正确但内部无法执行色域检查（例如，一个虚构的颜色模式），函数也会稳健地返回 `null` 而不是抛出错误。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/packages/color/src/analysis/is-in-gamut/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/packages/color/src/analysis/is-in-gamut/index.ts)
