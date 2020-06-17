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
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区域-->
      <el-table :data="rolelist" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for循环 嵌套渲染二级权限-->
                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3,i3) in item2.children"
                            :key="item3.id" type="warning" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
<!--              <pre>-->
<!--                {{scope.row}}-->
<!--              </pre>-->
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <!--删除按钮-->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除
            </el-button>
            <!--分配权限按钮-->
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--新增弹出框-->
    <el-dialog
      title="新增角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
    <!--编辑弹出框-->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
    <!--分配权限的对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed">
      <!--树形控件-->
      <el-tree
        :data="rightlist"
        :props="treeProps"
        node-key="id"
        :default-expand-all=true
        :default-checked-keys="defKeys"
        ref="treeRef"
         show-checkbox></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights" >确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 所有角色列表数据
        rolelist: [],
        // 新增角色信息
        addForm:{
          roleName: '',
          roleDesc: ''
        },
        // 编辑角色信息
        editForm: {
          roleName: '',
          roleDesc: ''
        },
        // 控制新增角色对话框的显示与隐藏
        addDialogVisible :false,
        // 新增表单校验规则
        addFormRules: {},
        // 控制修改角色对话框的显示与隐藏
        editDialogVisible: false,
        // 修改表单的验证对象
        editFormRules: {},
        // 控制分配权限弹出框显示与隐藏
        setRightDialogVisible:false,
        // 所有权限的数据
        rightlist:[],
        // 树形控件的属性绑定对象
        treeProps:{
          // 绑定显示的名称
          label:'authName',
          // 绑定的子数组
          children:'children'
        },
        // 默认选中的节点Id值数组
        defKeys:[],
        // 当前即将分配权限的角色id
        roleId:''
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      // 获取所有角色列表
      async getRolesList() {
        const {data: res} = await this.$http.get('roles')
        if (200 !== res.meta.status) {
          return this.$message.error('获取角色列表失败！')
        } else {
          this.rolelist = res.data
        }
      },
      // 根据Id删除对应的权限
       async removeRightById(role,rightId){
        // 弹框提示用户是否要删除
         const confirmResult = await this.$confirm('此操作将永久删除该角色','是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type:'warning'
        }).catch(err=>err)

         if (confirmResult!=='confirm'){
           return this.$message.info('取消了删除！')
         }
         const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
         if (200!==res.meta.status){
           return this.$message.error('删除权限失败！')
         }
         // 这里不应该刷新列表，因为刷新列表后会合上，因此可以将删除后data的数据装载到list中
         role.children = res.data
      },
      // 展示编辑用户的对话框
      async showEditDialog(id) {
        const {data: res} = await this.$http.get('roles/' + id)
        if (200 !== res.meta.status) {
          return
          this.$message.error('查询角色失败！')
        } else {
          this.editForm = res.data
        }
        this.editDialogVisible = true;
      },
      // 更加id删除角色信息
      async removeRoleById(id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => {
          return error
        })
        // 如果用户确认删除，则返回值为字符串confirm
        // 如果用户取消删除，则返回值为字符串cancel
        if ('confirm' === confirmResult) {
          const {data: res} = await this.$http.delete('roles/' + id)
          if (200 !== res.meta.status) {
            this.$message.error('删除角色失败！')
          } else {
            this.$message.success('删除角色成功!')
            this.getRolesList()
          }
        } else {
          return this.$message.info('已经取消删除！')
        }
      },
      // 监听新增角色对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      // 监听修改角色对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
      },
      // 新增角色信息并提交
      async addRoleInfo() {
        this.$refs.addFormRef.validate(async valid=>{
          if (!valid){
            return
          } else{
            const {data:res} = await this.$http.post('roles',this.addForm)
            if (201!==res.meta.status){
              this.$message.error('添加角色失败！');
            } else{
              this.$message.success('添加角色成功！')
              // 隐藏添加用
              this.addDialogVisible = false
              // 重新获取角色信息
              this.getRolesList()
            }
          }
        })
      },
      // 修改角色信息并提交
       editRoleInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) {
            return
          } else {
            // 发起修改角色信息的数据请求
            const {data: res} = await this.$http.put('roles/' + this.editForm.roleId, {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc
            })
            if (200 !== res.meta.status) {
              return this.$message.error('更新角色信息失败!')
            } else {
              // 关闭对话框
              this.editDialogVisible = false
              // 刷新数据列表
              this.getRolesList()
              // 提示修改成功
              this.$message.success('更新角色信息成功!')
            }
          }
        })
      },
      // 展示分配权限的对话框
      async showSetRightDialog(role){
        this.roleId = role.id
        // 获取所有权限数据
        const {data:res} = await this.$http.get(`rights/tree`)
        if (200!==res.meta.status) {
          return this.$message.error('获取权限数据失败！')
        } else{
          // 获取到的权限数据,保存到data中
          this.rightlist = res.data;
          console.log(this.rightlist)
        // 递归获取三级节点的id
        this.getLeafKeys(role,this.defKeys)
        this.setRightDialogVisible = true;
        }
      },
      // 通过递归的形式,获取角色下所有三级权限的id，并保存到数组中
      getLeafKeys(node,arr){
        // 判断是否包含子节点
        if (!node.children){
          // 如果当前node节点不包含children属性,则是三级节点
          return arr.push(node.id)
        }
        // 循环三级节点,然后再通过将三级节点传递进去进行递归循环
        node.children.forEach(item=>this.getLeafKeys(item,arr))
      },
      // 监听分配权限对话框的关闭事件
      setRightDialogClosed(){
        this.defKeys = []
      },
      // 点击为角色分配权限
      async allotRights(){
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        // 将数值根据逗号进行分割
        const idStr = keys.join(',')
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        if (200!==res.meta.status){
          return this.$message.error('分配权限失败！')
        } else{
          // 刷新列表
          this.getRolesList()
          // 隐藏弹出框
          this.setRightDialogVisible = false
          return this.$message.success('分配权限成功！')
        }
      }
    }
  }
</script>

<style scoped>
  .el-tag{
    margin: 7px;
  }

  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
  /*纵向居中对齐*/
  .vcenter{
    display: flex;
    align-items: center;
  }

</style>
