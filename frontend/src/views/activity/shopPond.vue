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
      <el-table-column label="标题" align="center" prop="activity_name" />
      <el-table-column label="商品" align="center" prop="product_list"/>  
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
      title="添加商品池"
      :visible.sync="dialogVisible"
      :close-on-click-modal= 'false'
    >
      <el-form v-model="dialogForm" label-width="110px">        
        <el-form-item label="标题">
          <el-input v-model="dialogForm.activity_name" placeholder="请填写标题" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="dialogForm.status" label="1">上线</el-radio>
          <el-radio v-model="dialogForm.status" label="2">下线</el-radio>
        </el-form-item>
         <el-form-item label="是否显示在列表页">
          <el-radio v-model="dialogForm.show_index" label="1">显示</el-radio>
          <el-radio v-model="dialogForm.show_index" label="2">不显示</el-radio>
        </el-form-item>
        <el-form-item label="商品">
            <el-input v-model="dialogForm.product_list" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }"  placeholder="请输入商品编号，以英文逗号隔开"/>
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
        <p>注：添加的商品，需确定有无特权码规则，防止出现价格过低的现象</p>  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureFormButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tableData, onLineOrOff } from '@/utils/home.js'
import { searchPond, savePond, switchPond } from '@/api/active'
export default {
  data() {
    return {
      dialogVisible: false,
      tableData,
      onLineOrOff,
      searchForm: {
        page: tableData.page_number,
        limit:tableData.page_size,
        activity_name:'',
        status: '0',
      },
      dateTime: '',
      dialogForm: {
        activity_name: '',
        status: '2', // 1上线 2下线
        show_index: '',       
        product_list: '',
        start_time: '',
        end_time: '',
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
      searchPond(this.searchForm).then((res) => {
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
      console.log(this.dialogForm)
      savePond(this.dialogForm).then((res) => {
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
    // 改变弹窗状态 add edit
    dialogChange(index, row) {
      this.dialogVisible = true
      if (index === 'add') {
        this.dialogForm = {
            activity_name: '',
            status: '2', // 1上线 2下线
            show_index: '',       
            product_list: '',
            start_time: '',
            end_time: '',
        }
        this.dateTime = []
        this.dialogVisibleTitle = '添加商品池'
      } else {
        this.dialogVisibleTitle = '编辑商品池'
        // 必须深复制 浅复制有问题
        this.dialogForm = Object.assign({}, row)
        this.dateTime = [row.start_time, row.end_time]
      }
    },
    // 上线下线
    switchacButton(index, row, type) {
      const obj = {
        id: row.id,
        status: type
      }
      switchPond(obj).then((res) => {
        if (res.code) {
          row.status = type
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
