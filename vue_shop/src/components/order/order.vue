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
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间">
          <template slot-scope="scope">
            {{scope.create_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button type="success" size="mini" icon="el-icon-location-outline"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="total"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        queryInfo: {
          query:'',
          pagenum:1,
          pagesize:10
        },
        total:0,
        // 订单列表数据
        orderList:[]
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      async getOrderList(){
        const {data:res} = await this.$http.get(`orders`, {params:this.queryInfo})
        console.log('res:',res)
        if(200!==res.meta.status) {
          return this.$message.error('查询订单列表失败！')
        } else {
          this.$message.success('查询订单；列表成功！')
          this.orderList = res.data.goods
          this.total = res.data.total
        }
      },
      handleSizeChange() {

      },
      handleCurrentChange() {

      }
    },
    computed: {},
    name: "order"
  }
</script>

<style lang="less" scoped>

</style>
