# 为 Esdora-JS 贡献代码

欢迎你！👋

非常感谢你愿意花时间为 `esdora-js` 做出贡献。你的每一份力量，无论是修复一个拼写错误，还是增加一个全新功能，都对项目至关重要。

本指南将引导你完成整个贡献流程，别担心，我们会一步步地说明，确保你有一个顺畅的开发体验。

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

---

## 日常开发流程

1.  **同步最新代码**
    在开始任何新工作前，**务必**先拉取上游主仓库的最新代码。

    ```bash
    git checkout main
    git pull upstream main
    ```

2.  **创建功能分支**
    从最新的 `main` 分支上，创建一个描述清晰的新分支。

    ```bash
    git checkout -b feat/add-new-function
    ```

3.  **编码与提交**
    在新分支上进行编码和测试。

4.  **添加 Changeset (如果需要)**
    **如果你的改动会影响发布包（即修改了 `packages/` 目录下的代码），你需要添加一个 changeset 文件。** 这能帮助我们自动更新版本和生成 `CHANGELOG`。

    ```bash
    pnpm changeset
    ```

    然后，根据交互式提示选择受影响的包、变更级别（`Major`, `Minor`, `Patch`）并填写描述。最后，将生成的 `.md` 文件提交到你的 PR 中。

5.  **提交 Pull Request (PR)**
    将你的功能分支推送到你的 Fork 仓库，然后在 GitHub 上创建 PR。请确保 PR 标题遵循 **Conventional Commit** 规范（例如 `feat(kit): add deepClone function`）。

---

## 常见工作流问答 (FAQ)

### Q1: 我的 PR 存在合并冲突，或者需要更新分支，怎么办？

**现象:** PR 页面提示 "This branch has conflicts that must be resolved"。

**解决方法 (使用 `rebase`):**

1.  **获取最新的 `main` 分支代码：**
    ```bash
    git checkout main
    git pull upstream main
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

### Q4: 我在最近一次的 commit message 里写了错别字，如何修改？

如果你还没有推送到远程，或者你准备强制推送，可以使用 `amend` 命令：

```bash
git commit --amend
```

这会打开你的文本编辑器，让你修改最后一次的提交信息。修改后保存并关闭编辑器即可。之后推送需要使用 `--force-with-lease`。

### Q5: 我的 PR 太大了，包含了多个不相关的功能，怎么办？

一个大的 PR 很难被审查和合并。最好的做法是将其拆分成多个小的、独立的 PR。

你可以创建一个新的、干净的分支，然后使用 `git cherry-pick` 命令，从你那个大的分支里，一次只“摘取”一个功能相关的 commit 过来。

```bash
# 1. 创建一个新的、干净的分支
git checkout main
git pull upstream main
git checkout -b feat/one-small-feature

# 2. 从你的大分支里，把属于这个小功能的 commit “摘”过来
# <commit-hash> 是你大分支上那个 commit 的哈希值
git cherry-pick <commit-hash-1>
git cherry-pick <commit-hash-2>

# 3. 为这个小功能创建一个 PR，然后重复这个过程处理其他功能
```

---

再次感谢你的贡献！期待在 `esdora-js` 看到你的身影！
