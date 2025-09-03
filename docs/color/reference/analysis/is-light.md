---
title: isLight
description: isLight - 来自 Dora Pocket 的颜色“道具”，用于检查一个颜色是否是“亮色”。
---

# isLight

<!-- 1. 简介：一句话核心功能描述 -->

检查一个颜色是否是“亮色”。

<!-- 2. 示例：由核心功能和从测试用例中提炼的场景组成 -->

## 示例

### 基本用法

```typescript
// 判断亮色
isLight('#FFFFFF') // 白色
// => true

isLight('yellow') // 亮黄色
// => true

// 判断暗色
isLight('#000000') // 黑色
// => false

isLight('#000080') // 深蓝色
// => false
```

### 支持多种颜色格式

```typescript
isLight('hsl(0, 0%, 100%)') // HSL 格式的白色
// => true

isLight({ mode: 'rgb', r: 0, g: 0, b: 0 }) // culori 对象格式的黑色
// => false
```

<!-- 3. 签名与说明：合并了签名、参数、返回值的唯一技术核心 -->

## 签名与说明

```typescript
/**
 * 检查一个颜色是否是“亮色”。
 * @param color 要检查的颜色字符串（如 'yellow', '#FFF', 'rgb(255,255,255)'）或颜色对象
 * @returns 如果颜色被认为是亮色，则返回 `true`；如果是暗色，则返回 `false`；如果输入无效，则返回 `null`
 */
export function isLight(color: string | EsdoraColor): boolean | null
```

<!-- 4. 注意事项与边界情况：建立用户信任 -->

## 注意事项与边界情况

- **关于无效输入**: 当 `color` 参数为无效的颜色字符串（如 `'invalid-color'`）、空字符串、`null`、`undefined` 或无法解析的对象时，函数将返回 `null`。
- **关于判断逻辑**: `isLight` 是 `isDark` 函数的逻辑反转。如果一个颜色不是暗色（并且是有效的），它就被认为是亮色。例如，中灰色 `#808080` 不被视为暗色，因此被判断为亮色。

<!-- 5. 相关链接：提供相关函数及源码的链接 -->

## 相关链接

- **源码**: [`packages/color/src/analysis/is-light/index.ts`](https://github.com/esdora-js/esdora/blob/main/packages/color/src/analysis/is-light/index.ts)
- **相关函数**: `isDark`
