// 导入express
const express = require('express')
// 导入compression
const compression = require('compression');
// 创建web服务器
const app =express()
// 一定要把这一行代码，写到静态资源托管之前，否则压缩不生效
// gzip中间件
app.use(compression())
// 中间件，托管静态资源
// express.static('') 将指定目录托管为静态资源
app.use(express.static('./dist'))
// 启动web服务器，在82端口,回调函数输出信息127
// 启动Ip:http://127.0.0.1:82/#/params
app.listen(82,()=>{
  console.log('server running at http://127.0.0.1')
})