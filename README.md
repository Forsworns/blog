# blog
My blog based on [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)+[Vuepress](https://vuepress.vuejs.org/guide/#how-it-works).

Testing:

```shell
npm install
npm run dev
```

Building:

```shell
npm build
```

Deploying:

```shell
./deploy.sh
```



`blog\zh\blogs` 下写作，把摘要信息写在目录下的`blog.json`中 

---

博客基于原生的Vuepress，做了如下改动：

- 修改过`\node_modules\@vuepress\theme-default\components\Navbar.vue` 中改成了

    ```vue
    <span
          ref="siteName"
          class="site-name"
          v-if="!$site.themeConfig.logo"
          :class="{ 'can-hide': $site.themeConfig.logo }"
          >{{ $siteTitle }}
    </span>
    ```
    
	将左上角默认文字改成了logo图片。

- 自定义了“所有博客”列表，可在`blog/.vuepress/components/BlogTimeLine.vue`中修改。

- 自定义了个人页面，在`blog/.vuepress/components/AboutMe.vue`及其所导入的组件中修改。

- 添加了评论区，基于GitTalk。

- 安装了`Vue-highlight`调整代码高亮。

- 安装了`markdown-it-katex`支持博客中的`Latex`语法。

- 安装了`@vuepress/plugin-back-to-top`支持在博客中回到最上方。

- 安装了`@vuepress/last-updated`记录更新日期。

- 借助[Live2D Widget](https://github.com/stevenjoezhang/live2d-widget)，在博文页面内添加看板娘。

- 自动抽取最新两篇博客到首页。

- 添加了`google-analytics`，需要在`blog/.vuepress/`下新建`secret.js`。

    ```javascript
    // blog/.vuepress/secret.js
    module.exports = {
        GA: 'your GA',
        CLIENT_ID: "your client id",
        CLIENT_SECRET: "your client secret",
    }
    ```

---

Todo（遥遥无期）

- 自动从YAML中抽取摘要信息
- Vue 3.0



