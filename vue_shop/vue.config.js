module.exports = {
  lintOnSave: false,
  /*先进入默认的打包入口[main.js][app], 清理一下，将自己的添加进入*/
  // 发布模式
  chainWebpack: config => {
    config.when(process.env.NODE_ENV ==='production',config=>{
      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 控制首页显示标识符
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV ==='development',config=>{
      config.entry('app').clear().add('./src/main-dev.js')
      // 控制首页显示标识符
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
