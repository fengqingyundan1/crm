<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <ActionBar :order-status="reStatusArr"></ActionBar>

    <!-- 数据表格 -->        
    <el-table border :data="tableData.data" v-loading="tableData.loading">
        <el-table-column label="ID" align="center"  type="index"></el-table-column>
        <el-table-column label="订单编号" align="center" prop="title"></el-table-column>        
        <el-table-column label="商品/商品编号/型号" align="center"  prop="promotetype"></el-table-column>
        <el-table-column label="收货人" align="center"  prop="position"></el-table-column>
        <el-table-column label="单价(元) / 退款数量" align="center" prop="file_url">
          <template slot-scope="scope">
              <img :src="scope.row.file_url" width="100px">
          </template>
        </el-table-column>
        <el-table-column label="退款金额" align="center" prop="linkurl"></el-table-column>
        <el-table-column label="退款申请时间" align="center" prop="created"></el-table-column>
        <el-table-column label="退款状态" align="center" prop="order"></el-table-column>
        <el-table-column label="运单号" align="center" prop="status"></el-table-column>       
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button             
              @click="handleEdit(scope.$index, scope.row)">查看</el-button>            
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.currentPage"       
        :page-size="tableData.pagesize"
        :page-sizes="tableData.sizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        >
    </el-pagination>
  </div>
</template>

<script>
import ActionBar from "@/components/ActionBar" //操作栏组件
import {reStatusArr,tableData} from "@/utils/home.js"
export default {  
  components:{
    ActionBar
  },
  data() {
    return { 
      reStatusArr,
      tableData
    }
  },
  created() {
    
  },
  methods: {
      handleSizeChange:function(){
          console.log('页数改变')
      },
      handleCurrentChange:function(){
          console.log('下一页')
      }
  }
}
</script>
