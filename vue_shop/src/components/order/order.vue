<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--表格区域-->
      <el-table
        :data="orderList"
        border
        stripe
        style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status ==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location-outline" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
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

    <!--修改地址的对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata"
                       v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressDialogClosed">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>

    <!--展示物流进度的对话框-->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
      <!--时间线-->
      <!--progressInfo物流信息-->
      <!--timestamp是时间信息-->
      <!--activity.context指的是显示出来的文字信息-->
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>

  import citydata from "./citydata";

  export default {
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        total: 0,
        // 订单列表数据
        orderList: [],
        // 修改地址对话框
        addressVisible: false,
        addressForm: {
          address1: [],
          address2: ''
        },
        addressFormRules: {
          address1: [
            {required: true, message: '请选择省市区县', trigger: 'blur'}
          ],
          address2: [
            {required: true, message: '请填写详细地址', trigger: 'blur'}
          ]
        },
        citydata: citydata,
        progressVisible: false,
        // 物流信息
        progressInfo:[]
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      async getOrderList() {
        const {data: res} = await this.$http.get(`orders`, {params: this.queryInfo})
        console.log('res:', res)
        if (200 !== res.meta.status) {
          return this.$message.error('查询订单列表失败！')
        } else {
          this.$message.success('查询订单；列表成功！')
          this.orderList = res.data.goods
          this.total = res.data.total
        }
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()

      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      // 展示修改地址的对话框
      showBox() {
        this.addressVisible = true
      },
      addressDialogClosed() {
        this.addressVisible = false
        this.addressForm.address1 = []
        this.$refs.addressFormRef.resetFields()
      },
      async showProgressBox() {
        const {data: res} = await this.$http.get(`/kuaidi/1106975712662`)
        if (200!== res.meta.status) {
          return this.$message.error('获取商品物流失败！')
        } else{
          this.$message.success('获取商品物流成功！')
          this.progressInfo= res.data
          this.progressVisible = true
          console.log('progressInfo:',this.progressInfo)
        }
      }
    },
    computed: {},
    name: "order"
  }
</script>


<style lang="less" scoped>

  .el-cascader {
    width: 100%;
  }

</style>
