// 订单来源
const originArr = [
  { 'value': '0', 'label': '全部' },
  { 'value': '1', 'label': '硬货' },
  { 'value': '2', 'label': '掌探' },
  { 'value': '3', 'label': '装备库' }
]
// 订单状态
const statusArr = [
  { 'value': '0', 'label': '全部' },
  { 'value': '1', 'label': '待付款' },
  { 'value': '2', 'label': '待发货' },
  { 'value': '3', 'label': '待收货' },
  { 'value': '4', 'label': '已完成' },
  { 'value': '5', 'label': '已关闭' },
  { 'value': '6', 'label': '退款中' },
  { 'value': '7', 'label': '待评价' }
]
// 退款状态
const reStatusArr = [
  { 'value': '0', 'label': '全部' },
  { 'value': '1', 'label': '申请退款' },
  { 'value': '2', 'label': '待退款' },
  { 'value': '3', 'label': '已退款' }
]
// 支付状态
const payStatusArr = [
  { 'value': '', 'label': '全部' },
  { 'value': '1', 'label': '待审核' },
  { 'value': '2', 'label': '已取消' },
  { 'value': '3', 'label': '已通过' },
  { 'value': '4', 'label': '已驳回' },
  { 'value': '5', 'label': '已完成' }
]
// 跳转类型
const jumpStatusArr = [
  { 'value': '1', 'label': 'H5活动' },
  { 'value': '2', 'label': '常规活动' },
  { 'value': '3', 'label': '会员活动' },
  { 'value': '4', 'label': '商品关联' },
]
const onLineOrOff = [
  { 'value': '0', 'label': '全部状态' },
  { 'value': '1', 'label': '上线' },
  { 'value': '2', 'label': '下线' }
]
const tableData = {
  count: 0,
  page_number: 1,
  page_size: 20,
  sizes: [20, 50, 100, 200],
  loading: false,
  data: []
}
// 默认配置图片路径
const uploadUrl = process.env.VUE_APP_BASE_API + '/api/uploader/upload'
const imgBaseUrl = process.env.VUE_APP_BASE_API + '/uploads/'
module.exports = {
  originArr,
  statusArr,
  reStatusArr,
  tableData,
  payStatusArr,
  jumpStatusArr,
  onLineOrOff,
  uploadUrl,
  imgBaseUrl }
