module.exports = {
    locales: {
        // 键名是该语言所属的子路径
        '/': {
            lang: 'en-US',
        },
        '/zh/': {
            lang: 'zh-CN',
        }
    },
    // blog
    themeConfig: {
        logo: '/title.png',
        repo: 'Forsworns/blog',
        repoLabel: 'GitHub',
        sideBar: {
            '/blogs/': [
                '/',
                '/20190721/first.md'
            ]
        },
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
                    { text: 'Blogs', link: '/blogs/' },
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
                    { text: '博客', link: '/blogs/' },
                ],
            }
        }

    },
    // vuepress
    serviceWorker: true,
    evergreen: true,
}