<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--头部警告区-->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning" show-icon :closable = false>
      </el-alert>
      <!--选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!--选择商品分类的级联-->
        </el-col>
      </el-row>
    </el-card>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        // 商品分类列表
        cateList:[]
      }
    },
    created() {
      // 获取所有的商品分类列表
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {data:res} = await this.$http.get(`categories`)
        if (200!==res.meta.status){
          return this.$message.error('获取所有的商品分类列表失败！')
        } else {

        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0 0;
  }

</style>
