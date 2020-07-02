<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <el-form v-model="searchForm" :inline="true">
      <el-form-item label="">
        <el-input v-model="searchForm.title" placeholder="请输入优惠券名称" />
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="searchForm.isonline" placeholder="请选择状态">
          <el-option
            v-for="item in statusArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="searchForm.type" placeholder="请选择类型">
          <el-option
            v-for="item in typeArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="searchButton">搜索</el-button>
      <el-button type="success" @click="dialogChange('add')">添加</el-button>
    </el-form>
    <el-table v-loading="tableData.loading" border :data="tableData.data">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="优惠券名称" align="center" prop="title" />
      <el-table-column label="类型" align="center" prop="type" :formatter="couponType"/>
      <el-table-column label="优惠内容" align="center" prop="notes"/>
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
          <!-- 0：全部 1：上线 2：下线 -->
          <el-tag v-if="scope.row.isonline === '1'">上线</el-tag>
          <el-tag v-else type="success">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="已领取/剩余" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.get_count}}/{{scope.row.coupon_count - scope.row.get_count}}</p>
        </template>
      </el-table-column>
      <el-table-column label="已使用" align="center" prop="use_count"/>
      <el-table-column label="累计支付金额 (元)" align="center" prop="order_total"/>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button @click="dialogChange(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.isonline === '0'" type="danger" @click="switchacButton(scope.$index, scope.row, '1')">上线</el-button>
          <el-button v-else type="danger" @click="switchacButton(scope.$index, scope.row, '0')">下线</el-button>
          <el-button @click="sendCouponDialog(scope.$index, scope.row)">发券</el-button>
          <el-button @click="dialogCode(scope.$index, scope.row)" type="primary">推广</el-button>
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
      @current-change="handleCurrentChange"/>
    <!-- 优惠券弹框 -->
    <el-dialog
      :title="dialogCoupon.title"
      top="10px"
      :visible.sync="dialogCoupon.visible"
      :close-on-click-modal= 'false'>
      <el-form v-model="dialogForm" label-width="110px">
       <el-form-item label="类型">
          <el-select v-model="dialogForm.type" placeholder="请选择类型" :disabled='isEdit_1'>
            <el-option
              v-for="item in typeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="dialogForm.title"  placeholder="最多显示10个字" :disabled='isEdit_1' />
        </el-form-item>
        <el-form-item label="发放总量" :disabled='isEdit_1'>
          <el-input v-model="dialogForm.coupon_count"  placeholder="最多1000000张" :disabled='isEdit_1'/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="dialogForm.product_type" label="0" :disabled='isEdit_2'>全部商品</el-radio>
          <el-radio v-model="dialogForm.product_type" label="1" :disabled='isEdit_2'>指定商品可用</el-radio>
          <el-radio v-model="dialogForm.product_type" label="2" :disabled='isEdit_2'>指定商品不可用</el-radio>
        </el-form-item>
        <el-form-item label="商品ID" v-if='dialogForm.product_type !== "0"'>
          <el-input v-model="dialogForm.used" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }"  placeholder="请输入商品的id" :disabled='isEdit_2'/>
        </el-form-item>  
        <el-form-item label="使用门槛">
          <div><el-radio v-model="dialogForm.satisfy_type" label="1" :disabled='isEdit_1'>无使用门槛</el-radio></div>
          <div>
            <el-radio v-model="dialogForm.satisfy_type" label="2" :disabled='isEdit_1'>
             <el-input placeholder="请输入内容" :disabled='isEdit_1' v-model="dialogForm.satisfy">
                <template slot="prepend">订单满</template>
                <template slot="append">元</template>
              </el-input>
            </el-radio>
          </div>          
        </el-form-item>
        <el-form-item label="优惠内容">
          <el-input placeholder="0.00" :disabled='isEdit_1' v-model="dialogForm.value" v-if='dialogForm.type !== "3"'>
            <template slot="prepend">减免</template>
            <template slot="append">元</template>
          </el-input>
          <el-input placeholder="0.00" :disabled='isEdit_1' v-model="dialogForm.value" v-else>
            <template slot="prepend">折扣</template>
            <template slot="append">折</template>
          </el-input>
        </el-form-item>
        <el-form-item label="用券时间">
          <div>
            <el-radio v-model="dialogForm.use_opt" label="1" :disabled='isEdit_1'>
              <el-date-picker
                :disabled='isEdit_1'
                v-model="dateTime"
                unlink-panels
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateChange"/>
            </el-radio>
          </div>
          <div>
            <el-radio v-model="dialogForm.use_opt" label="2" :disabled='isEdit_1'>
             <el-input placeholder="最少1天，整数" v-model="dialogForm.use_day" :disabled='isEdit_1'>
                <template slot="prepend">领券当日起</template>
                <template slot="append">天内可用</template>
              </el-input>
            </el-radio>
          </div>          
        </el-form-item>
        <el-form-item label="是否会员中心领券列表显示">
          <el-radio v-model="dialogForm.is_show" label="1" :disabled='isEdit_2'>是</el-radio>
          <el-radio v-model="dialogForm.is_show" label="2" :disabled='isEdit_2'>否</el-radio>
        </el-form-item>
        <el-form-item label="是否重复领取">
          <el-radio v-model="dialogForm.repeat_to_receive" label="1" :disabled='isEdit_1'>是</el-radio>
          <el-radio v-model="dialogForm.repeat_to_receive" label="2" :disabled='isEdit_1'>否</el-radio>
        </el-form-item>
        <el-form-item label="是否是新用户">
          <el-radio v-model="dialogForm.is_new_user" label="1" :disabled='isEdit_1'>是</el-radio>
          <el-radio v-model="dialogForm.is_new_user" label="2" :disabled='isEdit_1'>否</el-radio>
        </el-form-item>
         <el-form-item label="详细信息：">
          <el-input :disabled='isEdit_2' v-model="dialogForm.notes" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }"  placeholder="200字以内"/>
        </el-form-item>  
      </el-form>
     
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCoupon.visible = false">取 消</el-button>
        <el-button type="primary" @click="sureFormButton" :loading="dialogCoupon.button">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 发券 -->
    <el-dialog
      title="发券给用户"
      top="10px"
      :visible.sync="dialogCouponSend.visible"
      :close-on-click-modal= 'false'>
      <el-form v-model="sendCouponForm" label-width="110px">      
        <el-form-item label="手机号">
          <el-input v-model="sendCouponForm.mobile"  placeholder="输入手机号"/>    
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="sendCouponForm.num"  placeholder="券数量，请输入整数"/>
        </el-form-item>
      </el-form>     
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCouponSend.visible = false">取 消</el-button>
        <el-button type="primary" @click="sendCoupon" :loading="dialogCouponSend.button">发送优惠券</el-button>
      </span>
    </el-dialog>
     <!-- 二维码 -->
    <el-dialog
      title="推广"
      top="10px"
      :visible.sync="dialogCouponcode.visible"
      :close-on-click-modal= 'false'>
      <el-form v-model="codeCouponForm" label-width="110px">  
        <p>推广二维码：</p>    
        <div><img :src="codeCouponForm.img" alt=""></div>
        <p>推广地址：<a :href="codeCouponForm.real_address" target="_blank">{{codeCouponForm.real_address}}</a></p>
      </el-form>     
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCouponcode.visible = false" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tableData } from '@/utils/home.js'
import { searchCoupon,saveCoupon,switchacCoupon,sendCoupon } from '@/api/sales.js'
const typeArr=[
  { 'value': '', 'label': '全部类型' },
  { 'value': '1', 'label': '现金券' },
  { 'value': '2', 'label': '满减券' },
  { 'value': '3', 'label': '折扣券' }
]
export default {
  data() {
    return {
      dialogCoupon:{
        visible:false,
        button:false,
        title:'添加',
      },
      dialogCouponSend:{
        visible:false,
        button:false
      },
      dialogCouponcode:{
        visible:false,
        button:false
      },
      tableData,
      searchForm: {
        page: tableData.page_number,
        limit:tableData.page_size,
        isonline: '',
        title: '',
        type:''
      },
      dateTime: '',
      dialogForm:{
        title: '',
        coupon_count:'',
        starttime:'',
        endtime:'',
        product_type:'',
        type:'',
        satisfy:'',
        is_new_user:'',
        repeat_to_receive:'',
        is_show:'',
        satisfy_type:'',
        notes:'',
        use_opt:'',
        use_day:'',
        used:'',
        value:'',
        isonline:"1"
      },
      sendCouponForm:{
        mobile:'',
        num:'',
        id:''
      },
      codeCouponForm:{
        img:'',
        real_address:"",
      },
      statusArr:[
        { 'value': '', 'label': '全部状态' },
        { 'value': '1', 'label': '上线' },
        { 'value': '0', 'label': '下线' }
      ],
      typeArr,
      isEdit_1:true, // 不可编辑
      isEdit_2:false, // 不可编辑
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
    couponType(val){
      var name = typeArr.filter((con) => {
        return  con.value === val.type
      })
      if(name.length !== 0){
        return name[0].label
      }else{
        return ''
      }     
    },
    //  初始化搜索表单
    searchButton() {
      this.tableData.loading = true
      searchCoupon(this.searchForm).then((res) => {
        this.tableData.loading = false
        if (res.code) {
          this.tableData.data = res.data.data
          this.tableData.count = res.data.count
        }
      })
    },
    // 添加编辑表单
    sureFormButton() {
      this.dialogCoupon.button = true
      saveCoupon(this.dialogForm).then((res) => {        
        if (res.code) {
          this.dialogCoupon.visible = false
          this.dialogCoupon.button = false
          this.searchButton()
        }
      })
    },
    async sendCoupon(){
      const obj = {
        id:this.sendCouponForm.id,
        mobile:this.sendCouponForm.mobile,
        num:this.sendCouponForm.num,
      }
      const res = await sendCoupon(obj)
      if(res.code){
        this.$message({message:'发送成功',type:'success'})
        this.dialogCouponSend.visible = false
      }
    },
    sendCouponDialog(index,row){
      this.sendCouponForm.id = row.id
      this.dialogCouponSend.visible = true
    },
    // 选择时间
    dateChange() {
      this.dialogForm.starttime = this.dateTime[0]
      this.dialogForm.endtime = this.dateTime[1]
    },
    // 二维码弹窗
    dialogCode(index,row){
      this.dialogCouponcode.visible = true
      this.codeCouponForm.img = row.url
      this.codeCouponForm.real_address = row.real_address
    },
    // 改变弹窗状态 add edit
    dialogChange(index, row) {
      this.dialogCoupon.visible = true
      if (index === 'add') {
        this.dialogCoupon.title = '添加'        
        this.dialogForm = this.$options.data().dialogForm  // 获取初始化data的值
        this.dateTime = []        
        this.isEdit_1 = false
        this.isEdit_2 = false
      } else {
        this.dialogCoupon.title = '编辑'
        this.isEdit_1 = true
        this.isEdit_2 = false
        // 深复制 去掉无用的值
        Object.keys(this.dialogForm).forEach((item)=>{
          this.dialogForm[item] = row[item]
        })
        this.dialogForm.id = row.id
        this.dateTime = [row.starttime, row.endtime]
      }
    },
    // 上线下线
    switchacButton(index, row, type) {
      const obj = {
        id: row.id,
        isonline: type
      }
      switchacCoupon(obj).then((res) => {
        if (res.code) {
          row.isonline = type
        }
      })
    },
  }
}
</script>
<style lang="scss">
.el-dialog__body{
  .el-input__inner{
    // width: 350px;
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
