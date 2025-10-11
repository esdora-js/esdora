# 函数设计与实现指南

欢迎参与 `Dora Pocket` 的代码贡献！本指南旨在为所有函数的设计与实现提供一套统一的、高质量的标准。遵循这些规范，将有助于我们共同维护一个稳定、可预测且易于维护的代码库。

## 核心设计哲学

在编写任何代码之前，请理解并遵循以下核心哲学：

- **`@esdora/kit` 的纯粹性：** `kit` 包是整个生态的基石，必须严格遵守**零依赖**原则。任何需要外部依赖的功能，都应考虑创建一个新的独立包。
- **不重复造轮子（但有例外）：** 优先考虑社区中经过战斗考验的优秀库。但如果所需功能非常小且稳定，可以考虑“供应商化 (Vendoring)”以保持 `kit` 的纯粹性。
- **用户体验优先：** API 的设计应力求直观、易用，并提供清晰的错误提示。

## 目录结构规范

函数的存放位置取决于其**稳定性**和**功能分类**。

- **稳定函数：** 存放于 `src/<category>/` 目录下。例如，一个稳定的函数工具应放在 `src/function/`。
- **实验性函数：** 必须存放于顶级的 `src/experimental/` 目录下。这能从物理上将它们与稳定代码隔离。

## API 稳定性与生命周期管理

我们通过一套明确的机制来管理 API 的稳定性。

#### 1. 实验性 API (`@experimental`)

对于任何不确定或未来可能变更的 API，必须遵循以下所有规则：

- **存放位置：** 必须位于 `src/experimental/` 目录下。
- **命名约定：** 函数名必须加上 `_unstable_` 前缀，例如 `_unstable_deepSort`。
- **TSDoc 注释：** 必须在 TSDoc 中添加 `@experimental` 标签，并明确说明其不稳定性。
- **导出方式：** 只能从专门的实验性入口（如 `@esdora/packages/kit/experimental`）导出。

#### 2. API 的“毕业”

当一个实验性 API 经过充分测试和社区反馈，准备成为稳定版时，需要执行以下步骤：

1.  **移动目录：** 将其从 `src/experimental/` 移动到合适的稳定分类目录。
2.  **重构代码：** 移除函数名的 `_unstable_` 前缀。
3.  **更新注释：** 移除 `@experimental` 标签，并更新 TSDoc 为正式文档。
4.  **更新导出：** 将其从稳定入口（如 `@esdora/kit`）导出。
5.  **记录变更：** 在 `CHANGELOG` 中将此变动标记为新功能 (`feat`)。

## TSDoc 注释规范

高质量的 TSDoc 注释是代码不可或缺的一部分。

- **职责分离原则：**
  - **简单函数：** 在函数声明上方编写一个完整的、详尽的注释块。
  - **带重载的函数：**
    - 在**每个重载签名**上方，编写**简洁**的注释（摘要、`@param`, `@returns`），服务于 IDE 的智能提示。
    - 在**实现签名**上方，编写**最详尽**的注释（`@remarks`, `@example` 等），作为技术底稿和文档源。
- **语言：** 所有 TSDoc 注释都推荐使用**中文**编写。
- **示例为王 (`@example`)：** 必须为公开的 API 提供清晰、可运行的示例。

## 依赖管理策略

- **`@esdora/kit`:** 严禁添加任何 `dependencies`。
- **功能扩展：** 当需要集成第三方库时（如颜色转换库 `color`），应创建一个新的、专注的独立包（如 `@esdora/color`），并在其中管理依赖。
- **元包 `esdora`:**
  - `esdora` 包作为所有功能的统一入口。
  - 它通过**命名空间导出**的方式 (`import * as kit from '@esdora/kit'`) 来聚合所有子包，以避免命名冲突并保持 API 结构清晰。

## 新包的创建与发布

当一个新功能需要引入第三方依赖时，或者它本身是一个相对独立的功能集合，就应该创建一个新的包。以下是将一个新包从创建到实现自动化发布的完整流程。

### 1. 创建与初始化

1.  **创建目录**: 在 `packages/` 目录下，以新包的名称创建一个新的文件夹。
2.  **初始化 `package.json`**: 在新目录中，创建一个标准的 `package.json` 文件，确保包含 `name` (例如 `@esdora/new-package`), `version`, `description` 等关键字段。
3.  **配置构建与测试**: 参照现有包（如 `@esdora/color`）的结构，添加 `tsconfig.json`, `vitest.config.ts` 等构建和测试配置文件。

### 2. 首次发布：引导流程

由于 npm 不允许为一个不存在的包预先配置 OIDC 可信发布，因此新包的**首次发布**需要一个手动的引导过程。

**核心思路：** 使用一个临时的 `NPM_TOKEN` 进行第一次发布，然后在 npm 上为这个已存在的包配置 OIDC，最后立即销毁该临时 Token。

**操作步骤：**

1.  **生成临时 Token**:
    - 访问 [npmjs.com](https://www.npmjs.com/)，登录您的账户。
    - 进入 **Access Tokens** 页面，选择 **Generate New Token** -> **Granular Access Token**。
    - **权限 (Permissions)**: 选择 `Read and Write`。
    - **适用范围 (Scope)**: 限制此 Token 仅对您所在的 `@esdora` 组织生效。
    - **安全 (Security)**: 为了安全，建议开启双因素认证 (2FA)。
    - 生成后，**立即复制这个 Token**，因为页面刷新后将无法再次看到。

2.  **配置 GitHub Secret**:
    - 在 `esdora-js/esdora` 仓库的 **Settings** -> **Secrets and variables** -> **Actions** 页面。
    - 创建一个名为 `NPM_TOKEN` 的新的仓库 Secret，并将上一步生成的 Token 粘贴进去。

3.  **触发发布**:
    - 此时，`release.yml` 工作流在发布步骤中如果检测到 `NPM_TOKEN`，会优先使用它来发布。
    - **注意**: 如果您的 npm 组织开启了发布保护，请确保在首次发布前，暂时将包的发布权限设置为 `Require two-factor authentication or an automation or granular access token`，以允许临时令牌生效。
    - 按照正常的 `changeset` 流程，创建一个包含新包的版本变更，然后合并到 `main` 分支，这将触发发布流程，并将您的新包首次推送到 npm。

### 3. 配置 OIDC 可信发布

首次发布成功后，您的包就已经存在于 npm 注册表上。现在，我们可以为其配置 OIDC。

1.  **登录 npm**: 访问 [npmjs.com](https://www.npmjs.com/) 并登录。
2.  **找到新包**: 在您的包列表中，找到刚刚发布的新包，并进入其管理页面。
3.  **进入设置**: 点击 **Settings** 标签页。
4.  **提升安全级别**: 在 **Publishing access** 部分，选择最严格的 **`Require two-factor authentication and disallow tokens (recommended)`** 选项。
    - **重要提示**: 根据 npm 官方说明，此选项与 OIDC 可信发布者完全兼容。启用后，将禁止使用传统的 `NPM_TOKEN` 进行发布，从而极大地提升了账户安全性。
5.  **配置可信发布者**:
    - 在页面左侧找到 **Trusted Publisher** 菜单。
    - **发布者 (Publisher)**: 选择 `GitHub Actions`。
    - **GitHub 组织 (Organization)**: 填写 `esdora-js`。
    - **GitHub 仓库 (Repository)**: 填写 `esdora`。
    - **工作流文件名 (Workflow filename)**: 填写 `release.yml`。
    - **环境名 (Environment name)**: (可选) 填写用于发布的 GitHub Actions 环境名。这是一个高级安全选项，用于在发布前引入人工审批流程。对于大多数项目，可以留空。
    - 保存配置。

### 4. 清理工作：移除临时 Token

在 OIDC 配置完成并确认可以正常工作后（例如，在下一次发布中），**必须立即执行以下清理操作**：

- 回到 GitHub 仓库的 **Secrets** 设置页面。
- **彻底删除**之前创建的 `NPM_TOKEN`。

至此，您的新包已经完全接入了安全、无密码的 OIDC 发布流程。后续的所有发布都将由 GitHub Actions 自动完成，无需任何手动干预。
