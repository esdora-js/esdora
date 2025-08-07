---
title: 贡献指南：从这里开始
description: 欢迎加入 Dora Pocket 的建设！本指南将引导你了解我们的贡献原则，并完成首次环境设置。
---

# 从这里开始：贡献指南

欢迎你！👋

非常感谢你愿意花时间为 `Dora Pocket` 做出贡献。你的每一份力量，无论是修复一个拼写错误，还是增加一个全新功能，都对项目至关重要。

本系列指南将引导你完成整个贡献流程，别担心，我们会一步步地说明，确保你有一个顺畅的开发体验。

## 贡献黄金法则

在开始之前，请牢记几个简单的原则，它们会让整个过程更高效、更愉快：

- ✅ **一个 PR 解决一个问题**: 保持你的 Pull Request 小而专注。不要将多个不相关的功能或修复捆绑在一个 PR 中。
- ✅ **先同步，再开发**: 在创建新分支前，永远先确保你的 `main` 分支是最新版本。
- ✅ **沟通是关键**: 如果你不确定某个改动是否必要，或者想实现一个大的功能，请先创建一个 [Issue](https://github.com/esdora-js/esdora/issues) 进行讨论。
- ✅ **编写测试**: 如果你添加了新功能，请务必为其编写单元测试，确保其按预期工作。
- ✅ **保持 `main` 干净**: 永远不要在你本地的 `main` 分支上直接提交代码。

---

## 首次贡献：环境准备 (只需一次)

1.  **Fork 仓库**
    访问 `esdora-js/esdora` 的 GitHub 页面，点击右上角的 **"Fork"** 按钮，将项目 Fork 到你自己的账户下。

2.  **Clone 你的 Fork**
    在你的电脑上，打开终端，运行以下命令。记得将 `YOUR_USERNAME` 替换成你的 GitHub 用户名。

    ```bash
    git clone https://github.com/YOUR_USERNAME/esdora.git
    cd esdora
    ```

3.  **关联上游仓库 (`upstream`)**
    为了能方便地从官方仓库拉取最新的代码，你需要添加一个指向上游的远程地址。

    ```bash
    git remote add upstream https://github.com/esdora-js/esdora.git
    ```

4.  **安装依赖**
    本项目使用 `pnpm` 作为包管理器。
    ```bash
    pnpm install
    ```

好了，准备工作完成！🚀

## 下一步

环境设置好后，请继续阅读以下指南，了解我们的具体工作流程：

- **[Git 工作流与提交规范](./git-workflow)**: 学习如何创建分支、编写规范的 Commit Message 以及提交 Pull Request。
- **[测试指南](./testing-guide)**: 了解如何为你的代码编写和运行单元测试。
