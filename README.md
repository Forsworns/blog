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



`blog\zh\blogs` 下写作，把摘要信息写在目录下的`blog.json`中 （考虑自动从YAML中抽取？）

修改过`\node_modules\@vuepress\theme-default\components\Navbar.vue` 中改成了

```vue
<span
      ref="siteName"
      class="site-name"
      v-if="!$site.themeConfig.logo"
      :class="{ 'can-hide': $site.themeConfig.logo }"
      >{{ $siteTitle }}
</span>
```

