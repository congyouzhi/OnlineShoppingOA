import Vue from 'vue'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'[因为使用CDN导入所以这段代码可以删除或注释掉]
// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入axios配置
import axios from 'axios'
// 设置axios请求根路径
axios.defaults.baseURL= 'http://39.105.42.229:8888/api/private/v1/'
// axios设置连接器
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
// 将包挂载到vue原型对象上-目的:每个Vue组件可以通过this直接访问http-从而发送请求
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */)

// 定义全局时间格式化，过滤器
// originVal:传过来的时间-时间戳
// 定义方法名为:dataFormat,跟一个函数-函数对时间进行处理
Vue.filter('dataFormat',function (originVal) {
  // 将传过来的时间戳进行格式化成时间
  const dt =  new Date(originVal)
  // 获取年份
  const y = dt.getFullYear()
  // 获取月份
  // 这里由于月份从0开始所以+1
  // 同时先将月份转换成字符串通过+''
  // padStart将字符串补充，若不满2位通过0补位

  const m = (dt.getMonth() +1+'').padStart(2,'0')
  // 获取日
  const d = (dt.getDate() +'').padStart(2,'0')
  // 获取小时
  const hh = (dt.getHours() +'').padStart(2,'0')
  // 获取分钟
  const mm =(dt.getMinutes() + '').padStart(2,'0')
  // 获取秒
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  // 返回拼接好的时间
  return`${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
