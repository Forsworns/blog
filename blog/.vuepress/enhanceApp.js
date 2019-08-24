import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueHighlightJS from 'vue-highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

export default ({
    Vue, // the version of Vue being used in the VuePress app
    options, // the options for the root Vue instance
    router, // the router instance for the app
    siteData // site metadata
}) => {
    // ...apply enhancements to the app
    Vue.use(ElementUI)
    Vue.use(VueHighlightJS)
}