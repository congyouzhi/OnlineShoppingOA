import Vue from 'vue'

// 合并重复的element-ui
import {Button, Form, FormItem, Input, Message,Container,Header,Aside,Main} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.prototype.$message = Message

