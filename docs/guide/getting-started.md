---
title: 快速上手
description: Dora Pocket - 前端开发的四次元口袋的入门指南。了解如何安装和使用 Dora Pocket 的核心模块。
---

# 快速上手

欢迎来到 **Dora Pocket**！🎉

本指南将带你完成项目的安装，并展示如何使用我们最核心的“道具”。

## 安装

我们推荐安装主包 `esdora`，它整合了所有模块的功能，并能被现代打包工具完美地进行 Tree-shaking，确保最终产物体积最小。

```bash
# 使用 pnpm (推荐)
pnpm add esdora

# 使用 npm
npm install esdora

# 使用 yarn
yarn add esdora
```

如果你只想使用某个特定的功能包，也可以按需安装。
例如，只安装零依赖的工具集：
`pnpm add @esdora/kit`

## 使用示例

下面，我们将展示两个最能体现 `Dora Pocket` 价值的例子。

### 示例 1: 你的零依赖工具箱

`@esdora/kit` 专注于提供那些原生 JavaScript 没有、但在日常开发中极其有用的工具函数。

**场景：安全地执行一个可能会因为无效输入而崩溃的函数。**

```typescript
import { safe } from 'esdora'

// 一个可能会抛出错误的函数
const unsafeParse = (json: string) => JSON.parse(json)

// 使用 safe() 进行包装，提供一个错误处理器
const safeParse = safe(unsafeParse, (err) => {
  console.error('解析失败:', err.message)
})

const result = safeParse('{invalid json}')
// => undefined, 并在控制台打印错误信息
```

### 示例 2: 你的专业色彩处理引擎

`@esdora/color` 基于业界最快、最科学的 `culori` 引擎，让你能轻松处理所有颜色。

**场景：为一个按钮的主题色，生成一个视觉上更自然的悬浮 (hover) 颜色。**

```typescript
import { darken } from 'esdora'

const primaryColor = '#3498db' // 我们的主题蓝

// darken 会在 OKLCH 色彩空间中进行计算，
// 生成一个比简单地在 HSL 中降低亮度更符合视觉感知的深色。
// 它还能智能地处理百分比。
const hoverColor = darken(primaryColor, 10)
// => '#2378b2'

// 现在你可以将 hoverColor 直接应用到你的 CSS 中
// element.style.setProperty('--hover-color', hoverColor);
```

## 下一步

现在你已经感受到了 `Dora Pocket` 的威力。我们邀请你：

- 前往 **[模块总览](/packages/)** 页面，深入探索我们提供的所有“道具”。
- 阅读我们的 **[贡献指南](/contributing/)**，一起参与建设，为这个“四次元口袋”添加你自己的“道具”。
