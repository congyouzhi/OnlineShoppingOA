<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card>
        <!--添加角色按钮区域-->
        <el-row>
          <el-col>
            <el-button type="primary">添加角色</el-button>
          </el-col>
        </el-row>
        <!--角色列表区域-->
        <el-table :data="rolelist" border stripe>
          <!--展开列-->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <pre>
                {{scope.row}}
              </pre>
            </template>
          </el-table-column>
          <!--索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <!--修改按钮-->
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
              <!--删除按钮-->
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
              <!--分配权限按钮-->
              <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--编辑弹出框-->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
          <el-form-item label="活动名称">
            <el-input v-model="form.name"></el-input>
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
          return{
            // 所有角色列表数据
            rolelist:[],
            // 编辑角色信息
            editForm:{},
            // 控制修改角色对话框的显示与隐藏
            editDialogVisible:false,
            // 修改表单的验证对象
            editFormRules:{

            }
          }
        },
      created(){
          this.getRolesList()
      },
      methods:{
          // 获取所有角色列表
        async getRolesList(){
         const {data:res} =  await this.$http.get('roles')
          if (200!==res.meta.status){
            return this.$message.error('获取角色列表失败！')
          } else{
            this.rolelist = res.data
            console.log(this.rolelist)
          }
        },
        async showEditDialog(id){
          const {data:res} = await this.$http.get('roles/'+id)
          if (200!==res.meta.status){
            return
            this.$message.error('查询角色失败！')
          } else{
            this.editForm = res.data
          }
          this.editDialogVisible= true;
        },
        async removeRoleById(id){
          // 弹框询问用户是否删除数据
           const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(error=>{
            return error
          })
          // 如果用户确认删除，则返回值为字符串confirm
          // 如果用户取消删除，则返回值为字符串cancel
          console.log(confirmResult)
        },
        // 监听修改角色对话框的关闭事件
        editDialogClosed(){
          this.$refs.editFormRef.resetFields();
        }
      }
    }
</script>

<style scoped>

</style>
