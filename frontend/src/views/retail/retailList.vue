<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <el-form v-model="searchForm" :inline="true">
      <el-form-item label="">
        <el-input v-model="searchForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择订单状态">
          <el-option
            v-for="item in payStatusArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="searchButton">搜索</el-button>
    </el-form>
    <el-table v-loading="tableData.loading" border :data="tableData.data">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="昵称" align="center" prop="nickname" />
      <el-table-column label="手机号" align="center" prop="mobile" />
      <el-table-column label="提现流水号" align="center" prop="wx_payment_no" />
      <el-table-column label="商户订单号" align="center" prop="tx_order_sn" />
      <el-table-column label="提交时间" align="center" prop="applytime" />
      <el-table-column label="提现金额" align="center" prop="amount" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormatter" />
      <el-table-column label="备注" align="center" prop="refusereason" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '1'" type="primary" @click="switchButton(scope.$index, scope.row, '3')">通过审核</el-button>
          <el-button v-if="scope.row.status === '1'" type="info" @click="switchButton(scope.$index, scope.row, '4')">驳回</el-button>
          <el-button v-if="scope.row.status === '3'" type="warning" @click="submitButton(scope.$index, scope.row)">付款</el-button>
          <el-button type="success">对账</el-button>
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
import { payStatusArr, tableData } from '@/utils/home.js'
import { searchWithdraw, switchStatus, submitWithdraw } from '@/api/retail.js'
export default {
  data() {
    return {
      dialogVisible: false,
      tableData,
      payStatusArr,
      searchForm: {
        mobile: '',
        status: '',
        page_size: tableData.page_size,
        page_number: tableData.page_number
      },
      dialogForm: {
        title: '',
        productids: ''
      }
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
    //  初始化搜索表单
    searchButton() {
      this.tableData.loading = true
      searchWithdraw(this.searchForm).then((res) => {
        this.tableData.loading = false
        if (res.code) {
          this.tableData.data = res.data.list
          this.tableData.count = res.data.count
        }
      })
    },
    statusFormatter(row, col) {
      switch (row.status) {
        case '1':
          return '待审核'
        case '2':
          return '已取消'
        case '3':
          return '已通过'
        case '4':
          return '已驳回'
        case '5':
          return '已完成'
        default: return '其他'
      }
    },
    // 上线下线
    switchButton(index, row, type) {
      var obj = {
        id: row.id,
        auditstatus: type,
        refusereason: ''
      }
      if (type === '3') { // 通过审核
        switchStatus(obj).then((res) => {
          if (res.code) {
            row.status = type
          }
        })
      } else { // 驳回审核
        this.$prompt('请输入驳回理由', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          obj.refusereason = value
          switchStatus(obj).then((res) => {
            if (res.code) {
              row.status = type
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      }
    },
    // 提现
    submitButton(index, row) {
      submitWithdraw({ id: row.id }).then((res) => {
        if (res.code) {
          console.log('成功支付')
        }
      })
    }
  }
}
</script>
