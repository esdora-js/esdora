<div align="center">
  <a name="readme-top"></a>

  <!-- 1. 包名 -->
  <h1>@esdora/kit</h1>

  <!-- 2. 简短描述，连接到主品牌 -->
  <p><strong>Dora Pocket 的核心工具函数集</strong></p>

  <!-- 3. 徽章，聚焦于本包 -->
  <p>
    <a href="https://npmjs.org/package/@esdora/kit"><img src="https://img.shields.io/npm/v/@esdora/kit.svg?style=flat-square" alt="NPM Version"></a>
    <a href="https://npmjs.org/package/@esdora/kit"><img src="https://img.shields.io/npm/dm/@esdora/kit.svg?style=flat-square" alt="NPM Downloads"></a>
    <a href="https://github.com/esdora-js/esdora/blob/main/LICENSE.md"><img src="https://img.shields.io/npm/l/@esdora/kit.svg?style=flat-square" alt="License"></a>
    <a href="https://codecov.io/gh/esdora-js/esdora/branch/main"><img src="https://img.shields.io/codecov/c/github/esdora-js/esdora.svg?style=flat-square&flag=kit" alt="Codecov for kit"></a>
  </p>

</div>

---

`@esdora/kit` 是 [Dora Pocket](https://github.com/esdora-js/esdora) 项目中提供的第一个核心“道具箱”。它是一套经过严格测试、类型安全且零依赖的 TypeScript/JavaScript 工具函数库。

## ✨ 理念

我们的核心理念是 **补充，而非替代**。

我们尊重并推荐像 [Lodash](https://lodash.com/) 或 [ES-Toolkit](https://es-toolkit.dev/) 这样优秀的、久经考验的基础工具库。因此，`@esdora/kit` **不会重复造轮子**去实现它们已经做得足够好的功能。

我们专注于提供那些在特定场景下极具价值、能够解决具体痛点，或是对现有原生 API 进行更友好封装的函数。

## 🚀 安装

通过你喜欢的包管理器来安装它：

```bash
# pnpm
pnpm add @esdora/kit

# npm
npm install @esdora/kit

# yarn
yarn add @esdora/kit
```

## 💡 使用

在你的项目中，直接从 `@esdora/kit` 导入你需要的函数即可。

```typescript
import { checkCircularReference } from '@esdora/kit'

const userProfile = { name: 'Alice' }
userProfile.self = userProfile

if (checkCircularReference(userProfile)) {
  console.log('检测到循环引用！')
  // => 检测到循环引用！
}
```

## 📖 完整文档

想要了解所有可用的函数、详细的 API 和更多示例吗？

👉 **[请访问我们的官方文档网站](https://esdora.js.org/kit/)**

## 🤝 参与贡献

`@esdora/kit` 是一个开放且由社区驱动的模块。如果你有好的想法或想要修复一个 Bug，我们非常欢迎！

请参考主仓库的 **[贡献指南](https://github.com/esdora-js/esdora/blob/main/CONTRIBUTING.md)** 来了解如何参与。

## 📜 许可证

[MIT](https://github.com/esdora-js/esdora/blob/main/LICENSE.md) &copy; Esdora
