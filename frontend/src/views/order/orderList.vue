<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <el-form :inline="true" v-model="searchForm">
      <el-form-item label="">
        <el-date-picker   
            v-model="searchForm.dateTime"
            unlink-panels
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="daterange"  
            start-placeholder="开始日期"                     
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="来源">
        <el-select v-model="searchForm.origin" placeholder="请选择订单来源">
          <el-option
            v-for="item in originArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择订单状态">
          <el-option
            v-for="item in originArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input placeholder="订单、商品编号、商品名称" v-model="searchForm.key_words"></el-input>
      </el-form-item>
      <el-button type="primary">搜索</el-button>
      <el-button type="info" >导出</el-button>
    </el-form>
    <!-- 数据表格 -->        
    <el-table border :data="tableData.data" v-loading="tableData.loading">
        <el-table-column label="ID" align="center"  type="index"></el-table-column>
        <el-table-column label="订单编号" align="center" prop="title"></el-table-column>        
        <el-table-column label="商品/商品编号/型号" align="center"  prop="promotetype"></el-table-column>
        <el-table-column label="收货人" align="center"  prop="position"></el-table-column>
        <el-table-column label="单价(元)/数量" align="center" prop="file_url">
          <template slot-scope="scope">
              <img :src="scope.row.file_url" width="100px">
          </template>
        </el-table-column>
        <el-table-column label="特权码" align="center" prop="linkurl"></el-table-column>
        <el-table-column label="实收金额" align="center" prop="created"></el-table-column>
        <el-table-column label="下单时间" align="center" prop="order"></el-table-column>
        <el-table-column label="订单状态" align="center" prop="status"></el-table-column>
        <el-table-column label="1级/预估收入" align="center" prop="status"></el-table-column>
        <el-table-column label="2级/预估收入" align="center" prop="status"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button             
              @click="handleEdit(scope.$index, scope.row)">查看</el-button>            
          </template>
        </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.currentPage"     
        :total="tableData.total"  
        :page-size="tableData.pagesize"
        :page-sizes="tableData.sizes"
        layout="total, sizes, prev, pager, next, jumper"       
        >
    </el-pagination>
    <!-- 弹框 -->
    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      top="0" 
     >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">订单信息</span>          
        </div>        
        <div>          
           订单编号：121212121　　　订单状态：已发送   
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">客户信息</span>          
        </div>        
        <el-table border :header-cell-style="{background:'#EBF4FF',color:'#606266'}">>
          <el-table-column label="微信头像/昵称" align="center"></el-table-column>
          <el-table-column label="会员等级" align="center"></el-table-column>
          <el-table-column label="姓名" align="center"></el-table-column>
          <el-table-column label="手机号" align="center"></el-table-column>
          <el-table-column label="收货地址" align="center"></el-table-column>
        </el-table>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">商品信息</span>          
        </div>        
        <el-table border :header-cell-style="{background:'#EBF4FF',color:'#606266'}">>
          <el-table-column label="商品名称" align="center"></el-table-column>
          <el-table-column label="商品编号" align="center"></el-table-column>
          <el-table-column label="商品型号" align="center"></el-table-column>
          <el-table-column label="单价" align="center"></el-table-column>
          <el-table-column label="数量/总价" align="center"></el-table-column>
        </el-table>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">支付信息</span>          
        </div>    
        <el-table border :header-cell-style="{background:'#EBF4FF',color:'#606266'}">>
          <el-table-column label="应付金额" align="center"></el-table-column>
          <el-table-column label="特权码" align="center"></el-table-column>
          <el-table-column label="实收金额" align="center"></el-table-column>         
        </el-table>    
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">订单处理</span>          
        </div>
        <div>
          <el-radio v-model="radio" label="1">退款</el-radio>
          <el-radio v-model="radio" label="2">已发货</el-radio>
        </div>     
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">订单跟踪</span>          
        </div>       
        <el-table border :header-cell-style="{background:'#EBF4FF',color:'#606266'}">>
          <el-table-column label="操作处理" align="center"></el-table-column>
          <el-table-column label="操作时间" align="center"></el-table-column>
          <el-table-column label="操作人" align="center"></el-table-column>         
        </el-table> 
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {statusArr,tableData,originArr} from "@/utils/home.js"
import { searchOrder } from '@/api/order.js'
export default {  
  data() {
    return {
      radio:'2',
      statusArr,
      originArr,
      tableData,
      dateTime: '',
      dialogVisible:false,
      searchForm:{
        start_time:"",
        end_time:'',
        status:'',
        keyword:'',
        page_size:tableData.page_size,
        page_number:tableData.page_number
      },   
        
    }
  },
  created() {
    // this.searchButton()
  },
  methods: {
      handleSizeChange:function(){
          console.log('页数改变')
      },
      handleCurrentChange:function(){
          console.log('下一页')
      },
      // 选择时间
      dateChange() {
        this.searchForm.start_time = this.dateTime[0]
        this.searchForm.end_time = this.dateTime[1]
      },
      //  初始化搜索表单
      searchButton() {
        this.tableData.loading = true
        searchOrder(this.searchForm).then((res) => {
          this.tableData.loading = false
          if (res.code) {
            this.tableData.data = res.data.list
            this.tableData.count = res.data.count
          }
        })
      },
  }
}
</script>
<style lang="scss">
.app-container{
  .el-dialog__body{
    padding: 0 15px;
  }
}
  .box-card{
    margin-top: 20px;
    .title{
      font-size: 16px;
      font-weight: 700;
    }
  }
</style>