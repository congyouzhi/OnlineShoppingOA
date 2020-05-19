import Vue from "vue";
import Router from 'vue-router'
import Login from "./components/Login.vue";

Vue.use(Router)

export default new Router({
  // 存储路由规则
  routes:[
    // 重定向
    {path: '/',redirect:'/login'},
    { path:'/login',component : Login}
  ]
})

