---
title: Git 工作流与提交规范
description: 了解 Dora Pocket 项目的代码提交工作流，包括如何同步、创建分支、使用 Changesets 以及发起 Pull Request 的完整流程。
---

# Git 工作流与提交规范

本指南详细介绍了 `Dora Pocket` 项目的日常开发流程和 Git 使用规范。我们致力于维护一个清晰、可追溯且高质量的 Git 历史，这需要每位贡献者的共同努力。

## 日常开发流程

1.  **同步最新代码**
    在开始任何新工作前，**务必**先拉取上游主仓库的最新代码。

    ```bash
    git checkout main
    git pull upstream main --ff-only
    ```

2.  **创建功能分支**
    从最新的 `main` 分支上，创建一个描述清晰的新分支。分支名应遵循约定（如 `feat/add-new-function`, `fix/docs-typo`）。

    ```bash
    git checkout -b feat/add-new-function
    ```

3.  **编码与测试**
    在新分支上进行编码和测试。关于如何编写测试，请参考 [测试指南](./testing-guide)。

4.  **提交 Pull Request (PR)**
    将你的功能分支推送到你的 Fork 仓库，然后在 GitHub 上创建 PR。请确保 PR 标题遵循 **Conventional Commit** 规范（例如 `feat(kit): add deepClone function`）。

---

## 常见工作流问答 (FAQ)

### Q1: 我的 PR 存在合并冲突，怎么办？

**现象:** PR 页面提示 "This branch has conflicts that must be resolved"。

**解决方法 (使用 `rebase`):**

1.  **获取最新的 `main` 分支代码：**
    ```bash
    git checkout main
    git pull upstream main --ff-only
    ```
2.  **切换回你的功能分支，并执行 Rebase：**
    ```bash
    git checkout feat/add-new-function
    git rebase main
    ```
3.  **手动解决冲突 (如果发生):**
    - 打开冲突文件，手动编辑，保留最终想要的代码。
    - 解决完一个文件后，运行 `git add <filename>`。
    - 当所有冲突都解决后，运行 `git rebase --continue`。
4.  **强制推送到你的 Fork 以更新 PR：**
    ```bash
    git push --force-with-lease origin feat/add-new-function
    ```

### Q2: 我已经提交了 PR，但想再做一些小的修改，该怎么办？

**很简单！** 你不需要创建一个新的 PR。

1.  在你本地的同一个功能分支上，继续进行修改。
2.  像平常一样提交你的新改动：`git add .` -> `git commit -m "feat: add more details"`。
3.  再次推送到你的 Fork：`git push`。

GitHub 会自动将你的新提交添加到现有的 Pull Request 中。

### Q3: 我不小心在 `main` 分支上直接写了代码并提交了，怎么办？

> 目前已添加hooks限制，正常情况下在main分支上是不允许提交的。

**别慌，这是一个常见的错误！** 按照以下“四步救援法”操作：

1.  **创建新分支来保存你的工作：**
    ```bash
    # 确保在 main 分支上
    git checkout main
    # 基于当前 main 创建新分支，你的提交就被“搬”过去了
    git checkout -b my-rescued-branch
    ```
2.  **重置你本地的 `main` 分支：**
    ```bash
    git checkout main
    git fetch upstream
    # 硬重置！这将丢弃你本地 main 上的错误提交，并强制与官方 main 保持一致。
    git reset --hard upstream/main
    ```
3.  **更新你“救援”出来的分支：**
    ```bash
    git checkout my-rescued-branch
    git rebase main
    ```
4.  **现在，你可以正常推送这个被救援的分支并创建 PR 了。**

### Q4: 我的功能分支开发了很久，在提交PR前是否需要与 `main` 同步？

**回答：是的，这不仅是需要，而且是一个必须执行的最佳实践。**

**为什么必须这样做？**

- **尽早发现并解决冲突：** 在自己的本地环境提前解决冲突，远比在 PR 页面上看到一堆冲突更高效、更专业。
- **确保功能兼容：** `main` 分支上的新代码可能已经改变了你所依赖的函数。提前同步并测试，可以确保你的新功能在当前的代码库中能正常工作。
- **简化代码审查：** 审查者可以确信他们审查的代码是基于最新版本的，这为所有人节省了时间。

**操作方法：** 这个流程与解决冲突的流程完全相同，请参考 **Q1** 中的 `rebase` 步骤，将你的分支更新到最新的 `main` 分支之上。

**建议频率：** 对于开发超过一天的分支，**建议每天开始工作前都同步一次**，以避免在最后阶段面对难以解决的巨大冲突。

### Q5: 我可以用 `git merge` 来同步 `main` 分支以避免强制推送吗？

**回答：** 技术上可以，但我们**强烈不推荐**。

使用 `git merge` 会在你的功能分支中产生许多不必要的“合并提交”（例如 `Merge branch 'main' into ...`），这会严重污染 Pull Request 的历史记录，给代码审查带来巨大困难。

我们采用 `rebase` 方案的核心目的，就是为了保持一个线性的、清晰的提交历史，这与项目最终 `Squash and Merge` 的目标完全一致。虽然 `rebase` 需要使用 `--force-with-lease`，但请放心，这仅限于你自己的功能分支，是完全安全且标准的操作。

**请始终使用 `rebase` 来同步你的分支，以保证协作的高效和历史的纯净。**

---

再次感谢你的贡献！期待在 `Dora Pocket` 看到你的身影！
