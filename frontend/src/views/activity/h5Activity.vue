<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <el-form v-model="searchForm" :inline="true">
      <el-form-item label="">
        <el-input v-model="searchForm.activity_name" placeholder="请输入搜索标题" />
      </el-form-item>
      <el-form-item label="">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option
              v-for="item in onLineOrOff"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
      </el-form-item>
      <el-button type="primary" @click="searchButton">搜索</el-button>
      <el-button type="success" @click="dialogChange('add')">添加</el-button>
    </el-form>
    <el-table v-loading="tableData.loading" border :data="tableData.data">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="活动标题/地址" align="center">
       <template slot-scope="scope">
          <p>{{scope.row.activity_name}}</p>
          <a :href="scope.row.activity_url" target="_blank">{{scope.row.activity_url}}</a>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="h5banner">
        <template slot-scope="scope">
          <img :src="imgBaseUrl + scope.row.h5banner" width="100px">
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <!-- 0：全部 1：上线 2：下线 -->
          <el-tag v-if="scope.row.status === '1'">上线</el-tag>
          <el-tag v-else type="success">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="start_time"/>
      <el-table-column label="结束时间" align="center" prop="end_time"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="dialogChange(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status === '2'" type="danger" @click="switchacButton(scope.$index, scope.row, '1')">上线</el-button>
          <el-button v-else type="danger" @click="switchacButton(scope.$index, scope.row, '2')">下线</el-button>
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
    <!-- 弹框 -->
    <el-dialog
      title="添加"
      top="10px"
      :visible.sync="dialogVisible"
      :close-on-click-modal= 'false'
    >
      <el-form v-model="dialogForm" label-width="110px">
        <el-form-item label="名称">
          <el-input v-model="dialogForm.activity_name" placeholder="请填写名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="dialogForm.status" label="1">上线</el-radio>
          <el-radio v-model="dialogForm.status" label="2">下线</el-radio>
        </el-form-item>
        <el-form-item label="H5顶部banner">
          <el-upload
            ref="imgUpload"
            :action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :auto-upload="true"
            name="file"
            :on-success="(res, file, list)=>uploadSuccess(res,file,list,false)"
            :file-list="fileList">
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="优惠券">
          <el-radio v-model="dialogForm.is_coupon" label="1">不需要</el-radio>
          <el-radio v-model="dialogForm.is_coupon" label="2">需要</el-radio>
        </el-form-item>
        <el-form-item label="优惠券ID" v-if="dialogForm.is_coupon === '2'">
          <el-input v-model="dialogForm.activity_id" placeholder="请填写优惠券ID,英文逗号分隔" />
        </el-form-item>
        <el-form-item label="背景色">
          <el-color-picker v-model="dialogForm.backgroundcolor" show-alpha></el-color-picker>
          <span class="tips">提示：背景色为迎合整体氛围，不填默认为白色</span>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="dateTime"
            unlink-panels
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          />
        </el-form-item>
        <!-- 动态商品组 -->
        <div v-for="(item,i) in dialogForm.product_list" :key="i">
            <el-form-item :label="'商品组Banner_第'+(i+1)+'组'">
            <el-upload
                ref="imgUpload"
                :action="uploadUrl"
                list-type="picture-card"
                :limit="1"
                :auto-upload="true"
                name="file"
                :on-success="(res, file, list)=>uploadSuccess(res,file,list,true,i)"
                :file-list="fileListGroup[i]">
                <i class="el-icon-plus" />
            </el-upload>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="item.describe" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }"  placeholder="请输入商品组的标题，可为空"/>
            </el-form-item>
            <el-form-item label="商品展示">
              <el-radio v-model="item.show_type" label="1">单排展示</el-radio>
              <el-radio v-model="item.show_type" label="2">双排展示</el-radio>
            </el-form-item>
            <el-form-item label="商品">
              <el-input v-model="item.product_list" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }"  placeholder="请输入商品编号，以英文逗号隔开，有多分类时用 | 隔开"/>
            </el-form-item> 
            <el-form-item label="删除">
              <el-button  icon="el-icon-circle-plus-outline" @click="removeShopGroup(i)">删除商品组</el-button>
            </el-form-item>   
            
        </div>
        <el-button type="primary" @click="addShopGroup">添加商品组</el-button>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureFormButton" :loading="dialogVisibleButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tableData, uploadUrl, imgBaseUrl, activeStatusArr, onLineOrOff } from '@/utils/home.js'
import { searchH5Activity, saveH5Activity, switchH5Activity } from '@/api/active.js'
export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisibleButton:false,
      tableData,
      uploadUrl,
      imgBaseUrl,
      activeStatusArr,
      onLineOrOff,
      searchForm: {
        page: tableData.page_number,
        limit:tableData.page_size,
        status: '0',
        activity_name: ''
      },
      dateTime: '',
      fileList: [],
      fileListGroup:[],
      dialogForm: {
        activity_name: '',
        status: '', // 1上线 2下线
        is_coupon:'1',
        activity_id:'',
        backgroundcolor: 'rgba(255, 255, 255, 1)',
        h5banner: '',       
        start_time: '',
        end_time: '',
        product_list:[
            {'product_banner':'','product_list':'','describe':'','show_type':'1'}
        ]
      }
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
      searchH5Activity(this.searchForm).then((res) => {
        this.tableData.loading = false
        if (res.code) {
          this.tableData.data = res.data.list
          this.tableData.count = res.data.count
        }
      })
    },
    // 添加编辑表单
    sureFormButton() {
      this.dialogVisibleButton = true
      const data = Object.assign({}, this.dialogForm) 
      data.product_list =   JSON.stringify(data.product_list)       
      console.log(data)
      saveH5Activity(data).then((res) => {        
        if (res.code) {
          this.dialogVisible = false
          this.dialogVisibleButton = false
          this.searchButton()
        }
      })
    },
    // 选择时间
    dateChange() {
      this.dialogForm.start_time = this.dateTime[0]
      this.dialogForm.end_time = this.dateTime[1]
    },
    // 上传图片
    uploadSuccess(res, file, list, isgroup,index) {
        if(!isgroup){
            this.dialogForm.h5banner = res.data[0]
        } else {
            this.dialogForm.product_list[index].product_banner = res.data[0]
        }      
    },
    // 改变弹窗状态 add edit
    dialogChange(index, row) {
      this.dialogVisible = true
      if (index === 'add') {
        this.dialogForm = {
            activity_name: '',
            status: '', // 1上线 2下线
            backgroundcolor: 'rgba(255, 255, 255, 1)',
            h5banner: '',       
            start_time: '',
            end_time: '',
            product_list:[
                {'product_banner':'','product_list':'','describe':'','show_type':'1'}
            ]
        }
        this.fileList = []
        this.fileListGroup = []
        this.dateTime = []
        this.dialogVisibleTitle = '添加'
      } else {
        this.dialogVisibleTitle = '编辑'
        // 必须深复制 浅复制有问题
        this.dialogForm = Object.assign({}, row)
        if(row.h5banner !== '') {
           this.fileList = [{ url: imgBaseUrl + row.h5banner }]
        }
        row.product_list.forEach((item,index) => {
          if(item.product_banner !== ''){
            this.fileListGroup[index] = [{ url: imgBaseUrl + item.product_banner }]
          }          
        });       
        this.dateTime = [row.start_time, row.end_time]
      }
    },
    // 上线下线
    switchacButton(index, row, type) {
      const obj = {
        id: row.id,
        status: type
      }
      switchH5Activity(obj).then((res) => {
        if (res.code) {
          row.status = type
        }
      })
    },
    // 增加商品组
    addShopGroup() {
      this.dialogForm.product_list.push({'product_banner':[],'product_list':'','describe':'','show_type':'1'})
    },
    // 删除商品组
    removeShopGroup(index){     
      this.dialogForm.product_list.splice(index,1)
      this.fileListGroup.splice(index,1) // 删除默认图片
    }
  }
}
</script>
<style lang="scss">
.el-dialog__body{
  .el-input__inner{
    width: 350px;
  }
  .tips{
      font-size: 12px;
      color: #B0C2D1
  }
}
.pagination{
  margin-top: 20px;
}
</style>
