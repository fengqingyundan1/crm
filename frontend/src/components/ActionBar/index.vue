<template>
    <!-- 顶部操作栏 -->
    <el-form :inline="true" v-model="searchForm">
      <el-form-item label="">
        <el-date-picker   
            v-model="searchForm.time"
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
            v-for="item in orderStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input placeholder="订单、商品编号、商品名称" v-model="searchForm.key_words"></el-input>
      </el-form-item>
      <el-button type="primary" @click="searchClick">搜索</el-button>
      <el-button type="info"  @click="outClick">导出</el-button>
    </el-form>
</template>

<script>
import {originArr} from "@/utils/home.js"
export default {
  name: 'ActionBar',    
   props: {
      orderStatus: Array,      
  },
  data(){
    return{
        searchForm:{
            time:"",
            origin:'',
            status:'',
            key_words:''
        },   
        originArr
    }
  }, 

  methods: {
      searchClick:function(){
          console.log(this.orderStatus)
      },
      outClick:function(){
          alert('捯饬')
      }
  }
}
</script>


