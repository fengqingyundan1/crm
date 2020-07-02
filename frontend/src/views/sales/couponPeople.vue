<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <el-form v-model="searchForm" :inline="true">
      <el-form-item label="">
        <el-input v-model="searchForm.activity_name" placeholder="请输入优惠券名称" />
      </el-form-item>
      <el-form-item label="">
          <el-date-picker
            v-model="searchForm.time"
            unlink-panels
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
      </el-form-item>    
      <el-button type="primary" @click="searchButton">搜索</el-button>
    </el-form>
    <el-table v-loading="tableData.loading" border :data="tableData.data">
      <el-table-column label="客户" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.head_url" alt="" class="head_url">
          <p>{{scope.row.nick_name}}</p>
        </template>
      </el-table-column>
      <el-table-column label="领取时间" align="center" prop="addtime"/>
      <el-table-column label="用券时间" align="center" prop="use_card_time"/>
      <el-table-column label="券名称" align="center" prop="title"/>
      <el-table-column label="券码" align="center" prop="coupon">        
        <template slot-scope="scope">
          <p v-if="scope.row.card_type === '1'">优惠券</p>
          <p v-else>特权码</p>
        </template>
      </el-table-column>
      <el-table-column label="优惠" align="center" prop="value"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <!-- 0：全部 1：上线 2：下线 -->
          <el-tag v-if="scope.row.is_used === '1'">未使用</el-tag>
          <el-tag v-else type="success">使用</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination
      background
      :current-page="searchForm.page_number"
      :total="tableData.count"
      :page-size="searchForm.page_size"
      :page-sizes="tableData.sizes"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  
  </div>
</template>

<script>
import { tableData } from '@/utils/home.js'
import { userCoupon } from '@/api/sales.js'
const typeArr=[
  { 'value': '', 'label': '全部类型' },
  { 'value': '0', 'label': '满减券' },
  { 'value': '1', 'label': '折扣券' },
  { 'value': '2', 'label': '现金券' }
]
export default {
  data() {
    return {
      tableData,
      searchForm: {
        page: tableData.page_number,
        limit:tableData.page_size,
        status: '0',
        activity_name: ''
      },
      statusArr:[
        { 'value': '', 'label': '全部状态' },
        { 'value': '0', 'label': '未开始' },
        { 'value': '1', 'label': '进行中' },
        { 'value': '2', 'label': '已结束' }
      ],
      typeArr,
    }
  },
  created() {
    this.searchButton()   
  },
  methods: {
    handleSizeChange(val) {
      this.searchForm.limit = val
      this.searchButton()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.searchButton()
    },
    //  初始化搜索表单
    searchButton() {
      this.tableData.loading = true
      userCoupon(this.searchForm).then((res) => {
        this.tableData.loading = false
        if (res.code) {
          this.tableData.data = res.data.data
          this.tableData.count = res.data.count
        }
      })
    },   
  }
}
</script>
<style lang="scss">
.el-dialog__body{
  .el-input__inner{
    // width: 350px;
  }
  .tips{
      font-size: 12px;
      color: #B0C2D1
  }
}
.head_url{
  width: 50px;
  height: 50px;
}
.pagination{
  margin-top: 20px;
}
</style>
