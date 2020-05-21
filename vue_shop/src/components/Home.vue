<template>
<!--  Element-ui代码开始-->
  <el-container class="home-container">
<!--头部区域-->
    <el-header>
      <div>
        <img src="" alt=""/>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header>
<!--页面主体区域-->
    <el-container>
<!--侧边栏-->
      <el-aside width="200px">Aside</el-aside>
<!--右侧内容主体-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
<!--  Element-ui代码结束-->
</template>

<script>
  export default {
    methods: {
      logout() {
        // 清除session
        window.sessionStorage.clear();
        this.$router.push('/login');
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373D41;
  }
  .el-aside{
    background-color: #333744;

  }
  .el-main{
    background-color: #EAEDF1;
  }

</style>
