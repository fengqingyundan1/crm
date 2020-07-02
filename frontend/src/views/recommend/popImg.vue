<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <el-form v-model="searchForm" :inline="true">
      <el-form-item label="">
        <el-input v-model="searchForm.banner_name" placeholder="请输入搜索标题" />
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
      <el-table-column label="标题" align="center" prop="activityname" />
      <el-table-column label="图片" align="center" prop="image_url">
        <template slot-scope="scope">
          <img :src="imgBaseUrl + scope.row.image_url" width="100px">
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="enable">
        <template slot-scope="scope">
          <!-- 0：全部 1：上线 2：下线 -->
          <el-tag v-if="scope.row.enable === '1'">上线</el-tag>
          <el-tag v-else type="success">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="start_time" />
      <el-table-column label="结束时间" align="center" prop="end_time" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="dialogChange(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.enable === '2'" type="danger" @click="switchacButton(scope.$index, scope.row, '1')">上线</el-button>
          <el-button v-else type="danger" @click="switchacButton(scope.$index, scope.row, '2')">下线</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination
      background
      :current-page="searchForm.page"
      :total="tableData.count"
      :page-size="searchForm.limit"
      :page-sizes="tableData.sizes"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 弹框 -->
    <el-dialog
      :title="dialogVisibleTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal= 'false'
    >
      <el-form v-model="dialogForm" label-width="110px">
        <el-form-item label="弹框名称">
          <el-input v-model="dialogForm.activityname" placeholder="请填写弹框名称" />
        </el-form-item>
        <el-form-item label="弹框状态">
          <el-radio v-model="dialogForm.enable" label="1">上线</el-radio>
          <el-radio v-model="dialogForm.enable" label="2">下线</el-radio>
        </el-form-item>
        <el-form-item label="弹框图片">
          <el-upload
            ref="imgUpload"
            :action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :auto-upload="true"
            name="file"
            :on-success="(res, file, list)=>uploadSuccess(res,file,list)"
            :file-list="fileList"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转类型">
          <el-select v-model="dialogForm.activity_type" placeholder="请选择弹框类型">
            <el-option
              v-for="item in jumpStatusArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转地址">
          <el-input v-model="dialogForm.url_activity" placeholder="请输入h5活动链接https://www.baidu.com"  v-if="dialogForm.activity_type  === '1' "/>
          <el-input v-model="dialogForm.url_activity" placeholder="请输入对应类型的ID"  v-else />
        </el-form-item> 
        <el-form-item label="活动时间">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureFormButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tableData, uploadUrl, imgBaseUrl,onLineOrOff,jumpStatusArr } from '@/utils/home.js'
import { searchPopimg, savePopimg, switchPopimg } from '@/api/recommend.js'
export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisibleTitle:'',
      tableData,
      uploadUrl,
      imgBaseUrl,
      onLineOrOff,
      jumpStatusArr,
      searchForm: {
        page: tableData.page_number,
        limit:tableData.page_size,
        status:'0',
        banner_name:''
      },
      dateTime: '',
      fileList: [],
      dialogForm: {
        activityname: '',
        image_url: '',
        enable: '2', // 1上线 2下线
        activity_type: '',
        url_activity: '',
        start_time: '',
        end_time: ''
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
      searchPopimg(this.searchForm).then((res) => {
        this.tableData.loading = false
        if (res.code) {
          this.tableData.data = res.data.list
          this.tableData.count = res.data.count
          console.log(this.tableData)
        }
      })
    },
    // 添加编辑表单
    sureFormButton() {
      this.dialogVisibleButton = true      
      console.log(this.dialogForm)
      savePopimg(this.dialogForm).then((res) => {
        this.dialogVisibleButton = false
        console.log(res)
        if (res.code) {
          this.dialogVisible = false
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
    uploadSuccess(res, file, list) {
      this.dialogForm.image_url = res.data[0]
    },
    // 改变弹窗状态 add edit
    dialogChange(index, row) {
      this.dialogVisible = true
      if (index === 'add') {
        this.dialogForm = {
          activityname: '',
          image_url: '',
          enable: '2', // 1上线 2下线
          activity_type: '',
          url_activity: '',
          start_time: '',
          end_time: ''
        }
        this.fileList = []
        this.dateTime = []
        this.dialogVisibleTitle = '添加弹框'
      } else {
        this.dialogVisibleTitle = '编辑弹框'
        // 必须深复制 浅复制有问题
        this.dialogForm = Object.assign({}, row)
        if( row.image_url !== '')  this.fileList = [{ url: imgBaseUrl + row.image_url }]
        this.dateTime = [row.start_time, row.end_time]
      }
    },
    // 上线下线
    switchacButton(index, row, type) {
      const obj = {
        id: row.id,
        is_recommend: type
      }
      switchPopimg(obj).then((res) => {
        if (res.code) {
          row.enable = type
        }
      })
    }
  }
}
</script>
<style lang="scss">
.el-dialog__body{
  .el-input__inner{
    width: 350px;
  }
}
.pagination{
  margin-top: 20px;
}
</style>
