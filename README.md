<div align="center">
  <a name="readme-top"></a>
  <!-- 1. Logo -->
  <img src="./docs/public/logo-light.svg" alt="Dora Pocket Logo" width="150">

  <!-- 2. 项目名称 -->
  <h1>Dora Pocket</h1>

  <!-- 3. 品牌宣言 -->
  <p><strong>前端开发的四次元口袋</strong></p>

  <p>
    一个包罗万象的知识宝库，提供从 TypeScript/JavaScript 工具函数、Vue/React 组件到前端工程化最佳实践的各种“道具”，助你轻松解决开发难题。
  </p>

  <!-- 4. 徽章 -->
  <p>
    <a href="https://github.com/esdora-js/esdora/actions/workflows/ci.yml"><img src="https://github.com/esdora-js/esdora/actions/workflows/ci.yml/badge.svg" alt="CI Status"></a>
    <a href="https://codecov.io/gh/esdora-js/esdora/branch/main"><img src="https://img.shields.io/codecov/c/github/esdora-js/esdora/main.svg?style=flat-square" alt="Codecov"></a>
    <a href="https://npmjs.org/package/@esdora/kit"><img src="https://img.shields.io/npm/v/@esdora/kit.svg?style=flat-square" alt="NPM version for @esdora/kit"></a>
    <a href="https://npmjs.org/package/@esdora/kit"><img src="https://img.shields.io/npm/dm/@esdora/kit.svg?style=flat-square" alt="NPM downloads for @esdora/kit"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/npm/l/@esdora/kit.svg?style=flat-square" alt="License"></a>
  </p>

  <!-- 5. 核心链接 -->
  <p>
    <a href="https://esdora.js.org"><strong>阅读文档</strong></a>
    ·
    <a href="https://github.com/esdora-js/esdora/issues/new/choose">报告问题</a>
    ·
    <a href="https://github.com/esdora-js/esdora/issues/new/choose">功能请求</a>
  </p>

</div>

---

## 📖 简介

**Dora Pocket** 是一个由开发者为开发者共同构建的开源项目，旨在成为每一位前端工程师都想拥有的“四次元口袋”。

我们相信，最好的“道具”来自于真实的开发场景。因此，我们致力于将那些在实战中被证明行之有效的工具、模式和知识沉淀下来，并以最易于使用的方式分享给社区。

## 📦 口袋里有什么？

本项目是一个 **monorepo**，目前包含以下核心“道具箱”：

| 包名                                | 版本                                                                                                                        | 描述                                         |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [`esdora`](./packages/esdora)       | [![NPM version](https://img.shields.io/npm/v/esdora.svg?style=flat-square)](https://npmjs.org/package/esdora)               |                                              |
| [`@esdora/kit`](./packages/kit)     | [![NPM version](https://img.shields.io/npm/v/@esdora/kit.svg?style=flat-square)](https://npmjs.org/package/@esdora/kit)     | 🛠️ 一套零依赖、类型安全的 TS/JS 工具函数库。 |
| [`@esdora/color`](./packages/color) | [![NPM version](https://img.shields.io/npm/v/@esdora/color.svg?style=flat-square)](https://npmjs.org/package/@esdora/color) | 🎨 一个用于处理颜色相关的库                  |

## ✨ 核心理念

- **补充，而非替代**: 我们尊重社区中优秀的库（如 Lodash），我们的目标是填补它们未能覆盖的场景空白。
- **实用至上**: 我们只收录那些真正能解决实际问题的工具和知识。
- **开放与共建**: 我们相信社区的集体智慧，并欢迎每一位开发者的贡献。

## 🚀 快速开始

探索 `Dora Pocket` 的最佳方式就是从使用我们的第一个核心包 `@esdora/kit` 开始。

### 安装

```bash
# pnpm
pnpm add @esdora/kit

# npm
npm install @esdora/kit
```

### 使用

```typescript
import { checkCircularReference } from '@esdora/kit'

const obj = { a: 1 }
obj.self = obj

if (checkCircularReference(obj)) {
  console.log('检测到循环引用！')
  // => 检测到循环引用！
}
```

想要了解更多？请访问我们的 **[官方文档](https://esdora.js.org)**。

## 🤝 参与贡献

我们非常欢迎你的加入！无论是提交 Issue、发起 Pull Request，还是参与讨论，都是对 `Dora Pocket` 的宝贵贡献。

在开始之前，请花一点时间阅读我们的 **[贡献指南](https://esdora.js.org/contributing/)**，它将引导你完成整个流程。

## 💖 支持者

感谢所有已经为 `Dora Pocket` 做出贡献的人！

<a href="https://github.com/esdora-js/esdora/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=esdora-js/esdora" />
</a>

## 📜 许可证

本项目基于 [MIT](./LICENSE) 许可证发布。

[回到顶部](#readme-top)
