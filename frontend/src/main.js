import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import VueParticles from 'vue-particles' //登录粒子特效

// import moment from 'moment' //时间格式化工具
// // 全局过滤器
// Vue.filter('formatDate', function (str, pattern = 'YYYY-MM-DD HH:mm:ss'){
//   //服务器为10为时间戳则用unix
//   return moment.unix(str).format(pattern)
// })

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.use(VueParticles)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
