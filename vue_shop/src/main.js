import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'
// 导入axios配置
import axios from 'axios'
// 设置axios请求根路径
axios.defaults.baseURL= 'http://127.0.0.1:8888/api/private/v1/'
// axios设置连接器
axios.interceptors.request.use(config=>{
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
// 将包挂载到vue原型对象上-目的:每个Vue组件可以通过this直接访问http-从而发送请求
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
