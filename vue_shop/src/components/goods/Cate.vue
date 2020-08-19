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
                  :data="cateList"
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
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!--操作-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
                     @click="showEditCateDialogVisible(scope.row.cat_id)">编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCateInfo(scope.row.cat_id)">删除
          </el-button>
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
      width="50%"
      @close="addCateDialogClosed">
      <!--添加分类的表单-->
      <el-form :model="addCateForm"
               :rules="addCateFormRules"
               ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" prop="cat_name">
          <!--options用来指定数据源-->
          <!--props用来指定配置对象-->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogClosed">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>

    <!--编辑分类信息-->
    <el-dialog
      title="提示"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed">
      <el-form ref="editCateFormRef" :model="editCateForm" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCateInfo">确 定</el-button>
  </span>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        // 商品分类的数据列表，默认为空
        cateList: [],
        // 总数据条数
        total: 0,
        // 为table指定列的定义
        columns: [{
          label: '分类名称',
          prop: 'cat_name'
        },
          {
            label: '是否有效',
            // 表示将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'isok'
          },
          {
            label: '排序',
            // 表示将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'order'
          },
          {
            label: '操作',
            // 表示将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'opt'
          }
        ],
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        // 控制编辑分类对话框的显示与隐藏
        editCateDialogVisible: false,
        // 添加分类的表单数据对象
        addCateForm: {
          // 将要添加的分类名称
          cat_name: '',
          // 父级分类的Id
          cat_pid: 0,
          // 分类的等级，默认添加的是1级分类
          cat_level: 0
        },
        // 添加分类表单的验证规则对象
        addCateFormRules: {
          cat_name: [{require: true, message: '请输入分类名称', trigger: 'blur'}]
        },
        // 编辑分类的表单数据对象
        editCateForm: {
          // 分类Id
          cat_id: null,
          // 分类名称
          cat_name: ""
        },
        // 父级分类的列表
        parentCateList: [],
        // 指定级联选择器的配置对象
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 选中的父级分类的ID数组
        selectedKeys: []
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 获取商品分类数据
      async getCateList() {
        const {data: res} = await this.$http.get(`categories`, {params: this.queryInfo})
        if (200 !== res.meta.status) {
          this.$message.error('获取商品分类失败!')
        } else {
          // 把数据列表赋值给cateList
          this.cateList = res.data.result
          // 为总数据条数赋值
          this.total = res.data.total
        }
      },
      // 退出登录
      logout() {

      },
      // 监听pageSize改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      // 监听pageNum的改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      // 点击按钮,展示添加分类的对话框
      showAddCateDialog() {
        // 先获取父级分类的列表
        this.getParentCateList()
        // 展示出对话框
        this.addCateDialogVisible = true
      },
      // 获取父级分类的数据列表
      async getParentCateList() {
        const {data: res} = await this.$http.get(`categories`, {params: {type: 2}})
        if (200 !== res.meta.status) {
          this.$message.error('获取父级分类数据失败!')
        } else {
          this.parentCateList = res.data
        }
      },
      // 选择项发生变化触发这个函数
      parentCateChanged() {
        // 如果 selectedKeys数组中的length大于0，证明选中的父级分类
        //反之，就说明没有选中任何父级分类
        if (this.selectedKeys > 0) {
          // 父级分类的Id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          // 为当前的分类的等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length
        } else {
          // 父级分类的ID
          this.addCateForm.cat_pid = 0
          // 为当前分类的等级赋值
          this.addCateForm.cat_level = 0
        }
      },
      // 点击按钮，添加新的分类
      addCate() {
        // 点击按钮，添加新的分类
        this.$refs.addCateFormRef.validate(async valid => {
          if (!valid) {
            return
          } else {
            const {data: res} = await this.$http.post('categories', this.addCateForm)
            if (201 !== res.meta.status) {
              this.$message.error('添加分类失败！')
            } else {
              this.$message.success('添加分类成功！')
              // 隐藏弹出框
              this.addCateDialogVisible = false
              // 查询列表
              this.getCateList()
            }
          }
        })
      },
      // 监听对话框的关闭事件，重置表单数据
      addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
        this.addCateDialogVisible = false
      },
      // 展示编辑Dialog
      showEditCateDialogVisible(catId) {
        this.editCateDialogVisible = true
        // 根据分类Id查询分类详细信息
        this.getCateDetailInfo(catId)
      },
      // 编辑分离弹出框关闭
      editCateDialogClosed() {
        // 隐藏弹出框
        this.editCateDialogVisible = false
      },
      //  编辑提交分类
      async editCateInfo() {
        this.$refs.editCateFormRef.validate(async valid => {
          if (!valid) {
            return
          } else {
            const {data: res} = await this.$http.put('categories/' + this.editCateForm.cat_id, {cat_name: this.editCateForm.cat_name})
            if (200 !== res.meta.status) {
              return this.$message.error('更新分类信息失败!')
            } else {
              // 关闭对话框
              this.editCateDialogVisible = false;
              // 刷新数据列表
              this.getCateList()
              // 提示修改成功
              this.$message.success('更新分类信息成功！')
            }
          }
        })
      },
      // 查询分类详细信息
      async getCateDetailInfo(cateId) {
        const {data: res} = await this.$http.get('categories/' + cateId)
        if (200 !== res.meta.status) {
          return this.$message.error('分类信息查询失败！')
        } else {
          this.editCateForm = res.data
        }


      },
      // 删除分类信息
      async deleteCateInfo(cateId) {
        const {data: res} = await this.$http.delete('categories/' + cateId)
        if (200 !== res.meta.status) {
          return this.$message.error('分类信息删除失败！')
        } else {
          // 刷新列表
          this.getCateList()
          this.$message.success('分类信息删除成功！')

        }

      }
    }
  }
</script>

<style scoped>
  .home-container {
    height: 100%;
  }

  .treeTable {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }

</style>
