import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { createDynamicSidebar } from './libs/dynamic-sidebar'
import vite from './vite.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  title: 'Dora Pocket',
  titleTemplate: ':title | Dora Pocket',
  description: 'Dora Pocket - 前端开发的四次元口袋。一个包罗万象的知识宝库，提供从 TypeScript/JavaScript 工具函数、Vue/React 组件到前端工程化最佳实践的各种“道具”，助你轻松解决开发难题。',

  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    // 基础 meta
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#5585EE' }],
    ['meta', { name: 'author', content: 'Esdora' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Dora Pocket - 前端开发的四次元口袋' }],
    ['meta', { property: 'og:description', content: '一个包罗万象的知识宝库，提供从工具函数、组件到最佳实践的各种前端“道具”。' }], // 稍微精简
    ['meta', { property: 'og:image', content: 'https://esdora.js.org/og-image.png' }], // 替换为你的域名和图片路径
    ['meta', { property: 'og:url', content: 'https://esdora.js.org' }], // 替换为你的域名

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Dora Pocket - 前端开发的四次元口袋' }],
    ['meta', { name: 'twitter:description', content: '一个包罗万象的知识宝库，提供从工具函数、组件到最佳实践的各种前端“道具”。' }],
    ['meta', { name: 'twitter:image', content: 'https://esdora.js.org/og-image.png' }],
  ],

  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    codeTransformers: [transformerTwoslash()],
    languages: ['js', 'jsx', 'ts', 'tsx'],
    config: (md) => { md.use(groupIconMdPlugin) },
  },

  vite,

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Dora Pocket',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '工具函数 (Kit)', link: '/kit/' },
      // {
      //   text: '百宝箱',
      //   items: [
      //     { text: '工具函数 (Kit)', link: '/kit/' },
      //     { text: 'Vue 组件', link: '/vue/' },
      //     { text: 'React 组件', link: '/react/' },
      //   ],
      // },
      // { text: '最佳实践', link: '/practices/coming-soon' },
      { text: '参与贡献', link: '/contributing/' },
      { text: '关于我们', link: '/about' },
    ],

    sidebar: createDynamicSidebar(__dirname),

    editLink: {
      pattern: 'https://github.com/esdora-js/esdora/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/esdora-js/esdora' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: '基于 MIT 许可证发布',
      copyright: `版权所有 © 2024-${new Date().getFullYear()} Esdora`,
    },
  },
})
