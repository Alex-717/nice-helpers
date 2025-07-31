import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Nice Helpers',
  description: 'A collection of useful JavaScript helper functions',
  base: '/nice-helpers/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API 参考', link: '/api/' }
    ],
    outline: {
      level: 'deep',
      label: 'On this page'
    },
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: 'API 介绍', link: '/api/' },
            { text: 'is', link: '/api/is' },
            { text: 'urlParams', link: '/api/urlParams' },
            { text: 'runMicroTask', link: '/api/runMicroTask' },
            { text: 'deepClone', link: '/api/deepClone' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-username/nice-helpers' }
    ]
  }
})