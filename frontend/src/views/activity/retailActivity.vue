<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <el-form v-model="searchForm" :inline="true">
      <!-- <el-form-item label="">
        <el-date-picker
          v-model="searchForm.time"
          unlink-panels
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item> -->
      <el-form-item label="">
        <el-select v-model="searchForm.enable" placeholder="请选择活动状态">
          <el-option
            v-for="item in statusArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="searchForm.title" placeholder="活动标题" />
      </el-form-item>
      <el-button type="primary" @click="searchButton">搜索</el-button>
      <el-button type="success" @click="dialogChange('add')">添加</el-button>
    </el-form>
    <!-- 数据 -->
    <el-table v-loading="tableData.loading" border :data="tableData.data">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="图片" align="center" prop="promotetype">
        <template slot-scope="scope">
          <img :src="imgBaseUrl + scope.row.imgurl" width="100px">
        </template>
      </el-table-column>
      <el-table-column label="特权码规则" align="center" prop="coderule" />
      <el-table-column label="机构分销比例" align="center" prop="ratiofororganization" />
      <el-table-column label="群主分销比例" align="center" prop="ratioforgroupowner" />
      <el-table-column label="开始时间" align="center" prop="starttime" />
      <el-table-column label="结束时间" align="center" prop="endtime" />
      <el-table-column label="状态" align="center" prop="enable">
        <template slot-scope="scope">
          <!-- 0：全部 1：上线 2：下线 -->
          <el-tag v-if="scope.row.enable === '1'">上线</el-tag>
          <el-tag v-else type="success">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="dialogChange(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button v-if="scope.row.enable === '2'" type="danger" @click="switchacActiveButton(scope.$index, scope.row, '1')">上线</el-button>
          <el-button v-else type="danger" @click="switchacActiveButton(scope.$index, scope.row, '2')">下线</el-button>
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
      :title="dialogVisibleTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      top="5vh"
    >
      <el-form v-model="dialogForm" label-width="110px">
        <!-- <el-form-item label="分销类型">
          <el-radio v-model="dialogForm.radio" label="1">商品</el-radio>
        </el-form-item> -->
        <el-form-item label="特权码规则">
          <el-autocomplete
            v-model="dialogForm.coderule"
            :fetch-suggestions="querySearch"
            placeholder="搜索优惠码名称"
            :trigger-on-focus="false"
            @select="querySelect"
          />
        </el-form-item>
        <el-form-item label="填写标题">
          <el-input v-model="dialogForm.title" placeholder="请填写标题商品、活动标题" />
        </el-form-item>
        <el-form-item label="机构分销比例">
          <el-input v-model="dialogForm.ratiofororganization" placeholder="最多支持小数点后2位" />
        </el-form-item>
        <el-form-item label="群主分销比例">
          <el-input v-model="dialogForm.ratioforgroupowner" placeholder="最多支持小数点后2位" />
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="dateTime"
            unlink-panels
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          />
        </el-form-item>
        <el-form-item label="活动规则">
          <el-input
            v-model.trim="dialogForm.regulation"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10}"
            placeholder="请输入活动商品规则,以'|'为分隔"
          />
        </el-form-item>
        <el-form-item label="图片海报">
          <el-upload
            ref="imgUpload"
            :action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :auto-upload="true"
            name="file"
            :on-success="(res, file, list)=>uploadSuccess(res,file,list,'1')"
            :file-list="fileList1"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="活动缩略图">
          <el-upload
            ref="imgUpload"
            :action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :auto-upload="true"
            :on-success="(res, file, list)=>uploadSuccess(res,file,list,'2')"
            :file-list="fileList2"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogVisibleButton" @click="sureFormButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tableData, uploadUrl, imgBaseUrl } from '@/utils/home.js'
import { getCodeRule, addActive, searchActive, editActive, switchacActive } from '@/api/active.js'
export default {
  data() {
    return {
      tableData,
      uploadUrl,
      imgBaseUrl,
      dialogVisible: false,
      dialogVisibleTitle: '添加活动',
      dialogVisibleButton: false,
      dialogForm: {
        coderule_id: '', // 特权码规则id
        coderule: '',
        ratiofororganization: '', // 机构分销
        ratioforgroupowner: '', //  群主分销
        starttime: '', //  开始时间
        endtime: '', // 结束时间
        title: '', // 标题
        imgurl: '', // 海报
        thumbnailurl: '', // 缩略图
        regulation: '' // 活动规则
      },
      fileList1: [],
      fileList2: [],
      dateTime: '',
      searchResult: [],
      searchForm: {
        title: '',
        enable: '0', // 0：全部 1：上线 2：下线
        page_size: tableData.page_size,
        page_number: tableData.page_number
      },
      statusArr: [
        { value: '0', label: '全部' },
        { value: '1', label: '上线' },
        { value: '2', label: '下线' }
      ]
    }
  },
  created() {
    this.searchButton()
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
      this.dialogForm.starttime = this.dateTime[0]
      this.dialogForm.endtime = this.dateTime[1]
    },
    // 上传图片
    uploadSuccess(res, file, list, type) {
      if (type === '1') {
        this.dialogForm.imgurl = res.data[0]
      } else {
        this.dialogForm.thumbnailurl = res.data[0]
      }
    },
    // 模糊搜索
    querySearch(queryString, cb) {
      const obj = {
        keyword: queryString
      }
      getCodeRule(obj).then((res) => {
        const dataList = res.data
        if (res.code) {
          if (dataList.length > 1) {
            cb(dataList)
          } else {
            cb([{ value: '暂无数据' }])
          }
        }
      })
    },
    querySelect(item) {
      this.dialogForm.coderule_id = item.id
    },
    // 添加编辑表单
    sureFormButton() {
      this.dialogVisibleButton = true
      if (this.dialogVisibleTitle === '添加活动') {
        addActive(this.dialogForm).then((res) => {
          this.dialogVisibleButton = false
          console.log(res)
          if (res.code) {
            this.dialogVisible = false
            this.searchButton()
          }
        })
      } else {
        editActive(this.dialogForm).then((res) => {
          this.dialogVisibleButton = false
          console.log(res)
          if (res.code) {
            this.dialogVisible = false
            this.searchButton()
          }
        })
      }
    },
    //  初始化搜索表单
    searchButton() {
      this.tableData.loading = true
      searchActive(this.searchForm).then((res) => {
        this.tableData.loading = false
        if (res.code) {
          const dataList = res.data.list
          dataList.forEach(element => {
            element.regulation = element.regulation.join('|')
          })
          this.tableData.data = dataList
          this.tableData.count = res.data.count
        }
      })
    },
    // 上线下线
    switchacActiveButton(index, row, type) {
      const obj = {
        id: row.id,
        enable: type
      }
      switchacActive(obj).then((res) => {
        if (res.code) {
          row.enable = type
        }
      })
    },
    // 改变弹窗状态 add edit
    dialogChange(index, row) {
      this.dialogVisible = true
      if (index === 'add') {
        this.dialogForm = {
          coderule_id: '',
          coderule: '',
          ratiofororganization: '', // 机构分销
          ratioforgroupowner: '', //  群主分销
          starttime: '', //  开始时间
          endtime: '', // 结束时间
          title: '', // 标题
          imgurl: '', // 海报
          thumbnailurl: '' // 缩略图
        }
        this.fileList1 = []
        this.fileList2 = []
        this.dateTime = []
        this.dialogVisibleTitle = '添加活动'
      } else {
        this.dialogVisibleTitle = '编辑活动'
        // 必须深复制 浅复制有问题
        this.dialogForm = Object.assign({}, row)
        this.fileList1 = [{ url: imgBaseUrl + row.imgurl }]
        this.fileList2 = [{ url: imgBaseUrl + row.thumbnailurl }]
        this.dateTime = [row.starttime, row.endtime]
      }
    }
  }
}
</script>
<style lang="scss">
.el-dialog__body{
  .el-input__inner{
    width: 260px
  }
}
.pagination{
  margin-top: 20px;
}
</style>
