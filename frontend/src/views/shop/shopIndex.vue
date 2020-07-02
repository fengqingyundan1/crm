<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <el-form v-model="searchForm" :inline="true">
      <el-form-item label="搜索">
        <el-input v-model="searchForm.title" placeholder="商品编号" />
      </el-form-item>
      <el-button type="primary" @click="searchRetailButton">搜索</el-button>
      <el-button type="success" @click="dialogChange('add')">添加分销商品</el-button>
    </el-form>
    <el-table v-loading="tableData.loading" border :data="tableData.data">
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="商品ID" align="center" prop="productids" />
      <el-table-column label="商品数（件）" align="center" prop="count" />
      <el-table-column label="状态" align="center" prop="enable">
        <template slot-scope="scope">
          <!-- 0：全部 1：上线 2：下线 -->
          <el-tag v-if="scope.row.enable === '1'">上线</el-tag>
          <el-tag v-else type="success">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="dialogChange(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.enable === '2'" type="danger" @click="switchacActiveButton(scope.$index, scope.row, '1')">上线</el-button>
          <el-button v-else type="danger" @click="switchacActiveButton(scope.$index, scope.row, '2')">下线</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹框 -->
    <el-dialog
      title="添加分销商品"
      :visible.sync="dialogVisible"
    >
      <el-form v-model="dialogForm">
        <el-form-item label="标题">
          <el-input v-model="dialogForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="商品id">
          <el-input v-model="dialogForm.productids" type="textarea" :autosize="{ minRows: 6, maxRows: 50 }" />
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
import { tableData } from '@/utils/home.js'
import { searchRetail, switchacRetail, addRetail, editRetail } from '@/api/retail.js'
export default {
  data() {
    return {
      dialogVisible: false,
      tableData,
      searchForm: {
        title: '',
        productids: ''
      },
      dialogForm: {
        title: '',
        productids: ''
      }
    }
  },
  created() {
    this.searchRetailButton()
  },
  methods: {
    //  初始化搜索表单
    searchRetailButton() {
      this.tableData.loading = true
      searchRetail(this.searchForm).then((res) => {
        this.tableData.loading = false
        if (res.code) {
          this.tableData.data = res.data
          this.tableData.count = res.data.count
        }
      })
    },
    // 添加编辑表单
    sureFormButton() {
      this.dialogVisibleButton = true
      if (this.dialogVisibleTitle === '添加分销商品') {
        addRetail(this.dialogForm).then((res) => {
          this.dialogVisibleButton = false
          console.log(res)
          if (res.code) {
            this.dialogVisible = false
            this.searchRetailButton()
          }
        })
      } else {
        editRetail(this.dialogForm).then((res) => {
          this.dialogVisibleButton = false
          console.log(res)
          if (res.code) {
            this.dialogVisible = false
            this.searchRetailButton()
          }
        })
      }
    },
    // 改变弹窗状态 add edit
    dialogChange(index, row) {
      this.dialogVisible = true
      if (index === 'add') {
        this.dialogForm = {
          title: '',
          id: ''
        }
        this.dialogVisibleTitle = '添加分销商品'
      } else {
        this.dialogVisibleTitle = '编辑分销商品'
        // 必须深复制 浅复制有问题
        this.dialogForm = Object.assign({}, row)
      }
    },
    // 上线下线
    switchacActiveButton(index, row, type) {
      const obj = {
        id: row.id,
        enable: type
      }
      switchacRetail(obj).then((res) => {
        if (res.code) {
          row.enable = type
        }
      })
    }
  }
}
</script>
