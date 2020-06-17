<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <tree-table class="treeTable"
        :data = "cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :show-row-hover="true"
        border>
        <!--是否有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1" >二级</el-tag>
          <el-tag size="mini" type="warning" v-else="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!--操作-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--添加分类的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%">
      <!--添加分类的表单-->
      <el-form :model="addCateForm"
               :rules="addCateFormRules"
               ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" prop="cat_name">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        // 查询条件
        queryInfo:{
          type:3,
          pagenum:1,
          pagesize:5
      },
        // 商品分类的数据列表，默认为空
        cateList:[],
        // 总数据条数
        total:0,
        // 为table指定列的定义
        columns:[{
          label:'分类名称',
          prop:'cat_name'
        },
          {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type:'template',
          // 表示当前这一列使用模板名称
          template:'isok'
        },
          {
            label: '排序',
            // 表示将当前列定义为模板列
            type:'template',
            // 表示当前这一列使用模板名称
            template:'order'
          },
          {
            label: '操作',
            // 表示将当前列定义为模板列
            type:'template',
            // 表示当前这一列使用模板名称
            template:'opt'
          }
        ],
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible:false,
        // 添加分类的表单数据对象
        addCateForm:{
          // 将要添加的分类名称
          cat_name:'',
          // 父级分类的Id
          cat_pid:0,
          // 分类的等级，默认添加的是1级分类
          cat_level:0
        },
        // 添加分类表单的验证规则对象
        addCateFormRules:{
          cat_name:[{require:true,message:'请输入分类名称',trigger:'blur'}]
        }
      }
    },
    created() {
      this.getCateList()
    },
    methods:{
      // 获取商品分类数据
      async getCateList(){
        const {data:res} = await this.$http.get(`categories`,{params:this.queryInfo})
        if (200!==res.meta.status){
          this.$message.error('获取商品分类失败!')
        } else{
          // 把数据列表赋值给cateList
          this.cateList = res.data.result
          // 为总数据条数赋值
          this.total = res.data.total
          console.log('商品分类:',res.data)
        }
      },
      // 退出登录
      logout(){

      },
      // 监听pageSize改变
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      // 监听pageNum的改变
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      // 点击按钮,展示添加分类的对话框
      showAddCateDialog(){
        this.addCateDialogVisible = true
      },
      // 获取父级分类的数据列表
      getParentCateList(){
      }
    }
  }
</script>

<style scoped>
  .home-container{
    height: 100%;
  }
  .treeTable{
    margin-top: 15px;
  }

</style>
