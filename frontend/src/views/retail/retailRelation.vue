<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <el-form :inline="true" v-model="searchForm"> 
      <el-form-item label="">
        <el-input placeholder="请输入手机号" v-model="searchForm.key_words"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择机构">
          <el-option
            v-for="item in payStatusArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="searchButton">搜索</el-button>      
    </el-form>
    <el-table border :data="tableData.data" v-loading="tableData.loading">        
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="昵称" align="center" prop="nickname"></el-table-column>
        <el-table-column label="手机号" align="center" prop="mobile"></el-table-column>               
        <el-table-column label="注册时间" align="center" prop="register_time"></el-table-column>               
        <el-table-column label="机构负责人/群主" align="center" prop="usertype"></el-table-column>               
        <el-table-column label="机构名称" align="center" prop="name"></el-table-column>               
        <el-table-column label="机构返现比例" align="center" prop="ratiofororganization"></el-table-column>               
        <el-table-column label="群主返现比例" align="center" prop="ratioforgroupowner"></el-table-column>               
        <el-table-column label="总提现金额" align="center" prop="totalwithdraw"></el-table-column>  
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="dialogChange(scope.$index, scope.row)">编辑</el-button>            
            <el-button @click="stopEdit(scope.$index, scope.row)"  type="danger">停止</el-button>            
          </template>
        </el-table-column>
    </el-table>
    <!-- 弹框 -->
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'      
     >
      <h3>当前页面所有设置的分销比例均只对正常商品，若有活动商品将按活动返现比例。</h3>
      <el-form  v-model="dialogForm" label-width="110px"> 
        <el-form-item label="分销开关">
          <el-radio v-model="dialogForm.enable" label="1">启用</el-radio>
          <el-radio v-model="dialogForm.enable" label="2">禁止</el-radio>
        </el-form-item>
        <el-form-item label="机构名称">
          <el-input placeholder="机构名称" v-model="dialogForm.title"></el-input>
        </el-form-item>        
        <el-form-item label="机构分销比例">
          <el-input placeholder="最多支持小数点后2位" v-model="dialogForm.ratiofororganization"></el-input>
        </el-form-item>
        <el-form-item label="群主分销比例">
          <el-input placeholder="最多支持小数点后2位" v-model="dialogForm.ratioforgroupowner"></el-input>
        </el-form-item> 
        <el-form-item label="提现最小金额">
          <el-input placeholder="提现最小金额" v-model="dialogForm.minmoney"></el-input>
        </el-form-item>   
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureFormButton">确 定</el-button>
      </span>
    </el-dialog>   
  </div>
</template>

<script>
import {payStatusArr, tableData} from "@/utils/home.js"
import { getUserList, saveOrganization } from '@/api/retail.js'
export default {  
  data() {
    return {
      payStatusArr,  
      tableData,
      dialogVisible:false,    
      searchForm:{
        org_id:0,
        mobile:''
      },
      dialogForm:{
        id:'',
        enable:'',
        ratiofororganization:'',
        ratioforgroupowner:'',
        minmoney:'',
      },
    }
  },
  created() {
    this.searchButton()
  },
  methods: {
    //  初始化搜索表单
    searchButton() {
      this.tableData.loading = true
      getUserList(this.searchForm).then((res) => {
        this.tableData.loading = false
        if (res.code) {
          this.tableData.data = res.data
          // this.tableData.count = res.data.count
        }
      })
    },
    // 改变弹窗状态 add edit
    dialogChange(index, row) {
      this.dialogVisible = true
      // 必须深复制 浅复制有问题
      this.dialogForm = {
        id:row.id,
        enable:'1',
        ratiofororganization:row.ratiofororganization,
        ratioforgroupowner:row.ratioforgroupowner,
        minmoney:row.minmoney
      }  
      console.log(row)
    },
    // 添加编辑表单
    sureFormButton() {
      this.dialogVisibleButton = true
      console.log(this.dialogForm)
      saveOrganization(this.dialogForm).then((res) => {
        this.dialogVisibleButton = false
        if (res.code) {
          this.dialogVisible = false
          this.searchButton()
        }
      })
    },
  }
}
</script>
