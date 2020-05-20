import Vue from 'vue'

// 合并重复的element-ui
import {Button, Form, FormItem, Input, Message} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message

