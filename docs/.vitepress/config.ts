import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { getSidebarItem } from './libs/get-sidebar-item'
import vite from './vite.config'

export default defineConfig({
  title: 'esdora',
  description: '一个想要成为开发者的百宝袋的工具库',
  lang: 'zh-CN',
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    codeTransformers: [
      transformerTwoslash(),
    ],
    languages: ['js', 'jsx', 'ts', 'tsx'],
    config: (md) => {
      md.use(groupIconMdPlugin)
    },
  },
  cleanUrls: true,
  vite,
  themeConfig: {
    // logo: '/logo.svg',
    nav: [
      { text: '主页', link: '/' },
      { text: 'kit', link: '/kit' },
    ],
    sidebar: {

      'kit/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/kit/' },
            { text: '食用方法', link: '/kit/usage' },
          ],
        },
        {
          text: '参考',
          items: [
            {
              text: '验证类',
              items: getSidebarItem(__dirname, '../kit/reference/validate'),
            },
            {
              text: '浏览器类',
              items: getSidebarItem(__dirname, '../kit/reference/web'),
            },
            {
              text: 'Promise类',
              items: getSidebarItem(__dirname, '../kit/reference/promise'),
            },
            {
              text: '函数类',
              items: getSidebarItem(__dirname, '../kit/reference/function'),
            },
          ],
        },
      ],
    },
    editLink: {
      pattern: 'https://github.com/esdora-js/esdora/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },
    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/esdora-js/esdora' },
    ],

    footer: {
      // message: 'Released under the MIT License.',
      // copyright: 'Copyright © 2025-PRESENT Esdora.',
    },
  },

  head: [
    // ['meta', { name: 'theme-color', content: '#ffffff' }],
    // ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Esdora' }],
    // ['meta', { property: 'og:title', content: '' }],
    // ['meta', { property: 'og:image', content: '' }],
    // ['meta', { property: 'og:description', content: '_description_' }],
    // ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // ['meta', { name: 'twitter:image', content: '' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
