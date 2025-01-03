import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Developer Guide",
  description: "Developer documentation for the WSO2 Identity Server Apps codebase",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/content/DEVELOPER' }
    ],

    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Developer Guide', link: '/content/DEVELOPER' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wso2/identity-apps' }
    ]
  }
})
