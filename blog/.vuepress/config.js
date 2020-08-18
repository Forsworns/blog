SECRET = require('./secret.js')

module.exports = {
    title: 'Blog', // 这里改了vuepress默认主题的NavBar，取消了左上角的显示。更新后也要记得修改
    locales: {
        // 键名是该语言所属的子路径
        '/': {
            lang: 'en-US',
        },
        '/zh/': {
            lang: 'zh-CN',
        }
    },
    head: [
        ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css' }],
        ['link', { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" }],
        ['link', { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css" }],
        ['script', { src: "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js" }],
    ],
    // blog
    themeConfig: {
        logo: '/title.png',
        repo: 'Forsworns/blog',
        repoLabel: 'GitHub',
        // sideBar: 'auto',
        locales: {
            '/': {
                selectText: 'Languages',
                label: 'English',
                serviceWorker: {
                    updatePopup: {
                        message: "New content is available.",
                        buttonText: "Refresh"
                    }
                },
                lastUpdated: 'Last Updated',
                nav: [
                    { text: 'Homepage', link: '/' },
                    { text: 'About Me', link: '/about-me/' },
                    { text: 'Blogs', link: '/zh/blogs/' },
                ],
            },
            '/zh/': {
                selectText: '选择语言',
                label: '简体中文',
                serviceWorker: {
                    updatePopup: {
                        message: "发现新内容可用.",
                        buttonText: "刷新"
                    }
                },
                lastUpdated: '上次更新',
                nav: [
                    { text: '主页', link: '/zh/' },
                    { text: '关于我', link: '/zh/about-me/' },
                    { text: '博客', link: '/zh/blogs/' },
                ],
            }
        }

    },
    // vuepress
    serviceWorker: true,
    evergreen: true,
    plugins: [
        '@vuepress/back-to-top',
        '@vuepress/active-header-links', ['@vuepress/google-analytics',
            { 'ga': SECRET.GA }
        ]
    ],
    markdown: {
        extendMarkdown: md => {
            md.set({ html: true })
            md.use(require('markdown-it-katex'));
        },
    },
}