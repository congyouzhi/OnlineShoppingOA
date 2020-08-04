import Vue from "vue";
import Router from 'vue-router'
import Login from "./components/Login.vue";
import Home from './components/Home';
import Welcome from "./components/Welcome";
import Users from './components/user/Users';
import Rights from "./components/power/Rights";
import Roles from "./components/power/Roles";
import Cate from "./components/goods/Cate";
import Params from "./components/goods/Params";


Vue.use(Router)

const router =  new Router({
  // 存储路由规则
  routes:[
    // 重定向
    {path: '/',redirect:'/login'},
    { path:'/login',component : Login},
    { path:'/home',component : Home,redirect:'/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path: '/users',component:Users},
        {path: '/rights',component: Rights},
        {path: '/roles',component: Roles},
        {path: '/categories',component: Cate},
        {path: '/params',component: Params}
        ]}
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next)=>{
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行 next('/login') [注]若next中带有参数表示强制跳转
  // 判断地址是否为登录页面
  if (to.path==='/login'){
    // 放行
    return next();
  } else{
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    // 判断token是否存在
    if (!tokenStr){
      // 若为空则跳转到登录页面
      return next('/login')
    } else{
      // 否则不为空则直接通过
      next();
    }
  }
})

// 【注】定义router为对象后要添加导出，才能使用路由
export default router
