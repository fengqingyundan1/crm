<template>
  <div class="dashboard-editor-container">
    <panel-group 
    :todaycount='tota.todaycount' 
    :totalcount='tota.totalcount' 
    :yesterdaycount='tota.yesterdaycount'/>
    <!-- 顶部操作栏 -->
    <el-form :inline="true">
      <el-form-item label="">
        <el-input v-model="searchForm.keyword" placeholder="请输入手机号/姓名/昵称" />
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="searchForm.source" placeholder="请选择来源" @change="sourceChange">
          <el-option
            v-for="item in sourceArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="dateTime"
          unlink-panels
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateChange"/>
      </el-form-item>  
      <el-button type="primary" @click="searchButton">搜索</el-button>
    </el-form>
    <el-table v-loading="tableData.loading" border :data="tableData.data">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="客户" align="center" prop="wechat_headimgurl">
        <template slot-scope="scope">
          <div><img :src="scope.row.wechat_headimgurl" width="100px"></div>
          <div>{{scope.row.nickname}}</div>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="mobile" />
      <el-table-column label="会员等级/成长值" align="center" prop="actionpoint">
        <template slot-scope="scope">
          <p>{{scope.row.level}} / {{scope.row.kolamount}}</p>
        </template>
      </el-table-column>
      <el-table-column label="当前可用积分" align="center" prop="canusecoin"/>
      <el-table-column label="消费金额(元)" align="center" prop="consumeamount" />
      <el-table-column label="注册时间" align="center" prop="regdate" />
      <el-table-column label="注册来源" align="center" prop="zcly" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="updateInfo(scope.$index, scope.row)" :loading="updateLoading">更新积分</el-button>
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
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import PanelGroup from '@/components/GroupData/PanelGroup'
import { tableData } from '@/utils/home.js'
import { searchMembers, updateMembers,getMemberCount} from '@/api/member.js'

export default {
  name: 'Dashboard',
  components:{
    PanelGroup
  },
  data() {
    return {
      tableData, 
      dateTime:[],   
      searchForm: {
        page_number: tableData.page_number,
        page_size:tableData.page_size,
        keyword:'',
        starttime:'',
        endtime:'',
        source:'',
      },
      updateLoading:false,
      tota:{},
      sourceArr:[
        {label:'全部',value:''},
        {label:'探路者硬货小程序',value:'1'},
        {label:'探路者会员中心',value:'2'},
      ]
    }
  },
  created(){
    this.searchButton()
    this.getMemberCount()
  },
  methods: {
    handleSizeChange(val) {
      this.searchForm.page_size = val
      this.searchButton()
    },
    handleCurrentChange(val) {
      this.searchForm.page_number = val
      this.searchButton()
    },
    // 选择时间
    dateChange() {
      this.searchForm.page_number = 1
      if(!this.dateTime){
        this.searchForm.starttime = ''
        this.searchForm.endtime = ''
      }else{
        this.searchForm.starttime = this.dateTime[0]
        this.searchForm.endtime = this.dateTime[1]
      }     
    },
    // 类型选择
    sourceChange(){
      this.searchForm.page_number = 1
    },
    //  初始化搜索表单
    searchButton(islimit) {
      this.tableData.loading = true
      searchMembers(this.searchForm).then((res) => {
        this.tableData.loading = false
        if (res.code) {
          this.tableData.data = res.data.list
          this.tableData.count = res.data.count
        }
      })
    },
    // 更新积分
    updateInfo(index,row){
      this.updateLoading = true
      updateMembers({member_id:row.id}).then((res) => {
        this.updateLoading = false
        if(res.code){
          row.level = res.data.level
          row.actionpoint = res.data.actionpoint
          row.canusecoin = res.data.canusecoin
        }
      })
    },
    // 获取统计
    getMemberCount(){
      getMemberCount().then((res) => {
        if(res.code){
          this.tota = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  position: relative;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>