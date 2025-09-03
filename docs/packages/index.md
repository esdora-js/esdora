---
title: 模块总览
description: 探索 Dora Pocket 生态系统中的所有可用模块、它们的核心功能以及未来的发展路线图。
---

<script setup>
const publishedCards = [
  {
    icon: '🛠️',
    title: '@esdora/kit',
    details: '一套经过严格测试、类型安全且绝对零依赖的 TypeScript 工具函数，为你的项目提供最稳定可靠的基础“道具”。',
    link: '/packages/kit/'
  },
  {
    icon: '🎨',
    title: '@esdora/color',
    details: '由业界最快、最科学的 `culori` 引擎驱动，提供从颜色转换、操作到可访问性分析的全套工具。',
    link: '/packages/color/'
  }
];

const roadmapCards = [
  {
    icon: '📅',
    title: '@esdora/date',
    details: '基于一个高性能的日期时间处理库进行二次封装，提供一套更简洁、更符合直觉的 API。'
  },
  {
    icon: '🪝',
    title: '@esdora/hooks',
    details: '精心设计的 Vue 和 React Hooks，专注于解决特定场景下的复杂状态逻辑。'
  }
];
</script>

# 模块总览

`Dora Pocket` 由多个独立的、功能专注的 npm 包组成。你可以安装主包 `esdora` 来使用所有功能，也可以根据需要单独安装。

## ✅ 已发布 (Available)

这些是已经经过严格测试、可以立即在你的生产环境中使用的核心模块。

<CardGrid :cards="publishedCards" />

## 🧭 规划中 (Roadmap)

这些是我们正在积极规划和开发的下一批“道具”。我们相信它们将为前端生态带来巨大的价值，敬请期待！

<CardGrid :cards="roadmapCards" />
