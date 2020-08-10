<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <!--头部警告区-->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning" show-icon :closable=false>
      </el-alert>
      <!--选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!--选择商品分类的级联-->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            expand-trigger="hover"
            :props="cateProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

      <!--tab 页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <!--添加参数的按钮-->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加参数
          </el-button>
          <!--动态参数表格-->
          <el-table :data="manTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand"></el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" prop="">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <!--添加属性的按钮-->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加属性
          </el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand"></el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" prop="">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加参数的对话框-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--添加参数对话框-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>

    <!--修改参数的对话框-->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--修改参数对话框-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        // 商品分类列表
        cateList: [],
        // 级联选择框的配置对象
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 级联选择框双向绑定到的数组
        selectedCateKeys: [],
        // 被激活的页签名称
        activeName: 'many',
        // 动态参数的数据
        manTableData: [],
        // 静态属性的数据
        onlyTableData: [],
        // 控制添加对话框的显示与隐藏
        addDialogVisible: false,
        // 添加参数的表单数据对象
        addForm: {
          attr_name:''
        },
        // 添加表单的验证规则
        addFormRules: {
          attr_name: [
            {required: true, message: '请输入参数名称', trigger: 'blur'}
          ]
        },
        // 控制修改对话框的显示与隐藏
        editDialogVisible:false,
        // xiugia de
        editForm:{}
      }
    },
    created() {
      // 获取所有的商品分类列表
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {data: res} = await this.$http.get(`categories`)
        if (200 !== res.meta.status) {
          return this.$message.error('获取所有的商品分类列表失败！')
        } else {
          this.cateList = res.data
        }
      },
      // 级联选择框选中变化,会触发这个函数
      handleChange() {
        this.getParamsData()
      },
      // tab页签点击事件的处理函数
      handleTabClick() {
        console.log(this.activeName)
        this.getParamsData()
      },
      async getParamsData() {
        // 证明选中的不是三级分类
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          return
        }
        // 证明选中的是三级分类
        // 根据所选分类的id,和当前所处的面板，获取对应的参数
        // cateId通过计算函数直接传
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
        if (200 !== res.meta.status) {
          return this.$message.error('获取参数；列表失败！')
        }

        if (this.activeName === 'many') {
          this.manTableData = res.data
        } else {
          this.onlyTableData = res.data
        }

      },
      // 监听添加对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      // 点击按钮，添加参数
      addParams() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return
          }
          const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (201 !== res.meta.status) {
            return this.$message.error('添加参数失败！')
          } else {
            this.$message.success('添加参数成功！')
            this.addDialogVisible = false
            this.getParamsData()
          }
        })
      },
      // 点击按钮，展示修改的对话框
      showEditDialog() {

      },
      // 重置修改的表单
      editDialogClosed(){
        this.$refs.editFormRef.resetFields()
      },
    },
    computed: {
      // 如果按钮需要被禁用，则返回true，否则返回false
      isBtnDisabled() {
        if (this.selectedCateKeys.length !== 3) {
          return true
        }
        return false
      },
      // 当前选中的三级分类的Id
      cateId() {
        if (this.selectedCateKeys.length === 3) {
          return this.selectedCateKeys[2]
        }
        return null
      },
      // 动态计算标题的文本
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }
        return '静态属性'
      }
    }
  }
</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0 0;
  }

</style>
