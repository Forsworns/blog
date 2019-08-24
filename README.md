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





修改过`\node_modules\@vuepress\theme-default\components\Navbar.vue` 中删掉了

```vue
<span
    ref="siteName"
    class="site-name"
    v-if="$siteTitle"
    :class="{ 'can-hide': $site.themeConfig.logo }"
	>{{ $siteTitle }}
</span>
```

