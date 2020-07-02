import request from '@/utils/request'

// 添加分销商品
export function addRetail(params) {
  return request({
    url: '/api/fxproduct/addfxproduct',
    method: 'post',
    data: params
  })
}
// 编辑分销商品
export function editRetail(params) {
  return request({
    url: '/api/fxproduct/editfxproduct',
    method: 'post',
    data: params
  })
}

// 查询活动
export function searchRetail(params) {
  return request({
    url: '/api/fxproduct/queryfxproduct',
    method: 'post',
    data: params
  })
}

// 删除活动
export function deleteRetail(params) {
  return request({
    url: '/api/fxproduct/deleteactivity',
    method: 'post',
    data: params
  })
}

// 上线下线分销商品
export function switchacRetail(params) {
  return request({
    url: '/api/fxproduct/switchproductstatus',
    method: 'post',
    data: params
  })
}

// 提现api
export function searchWithdraw(params) {
  return request({
    url: '/api/fxwithdraw/getwithdrawlist',
    method: 'post',
    data: params
  })
}

// 提现 切换状态
export function switchStatus(params) {
  return request({
    url: '/api/fxwithdraw/audit',
    method: 'post',
    data: params
  })
}

// 微信提现
export function submitWithdraw(params) {
  return request({
    url: '/api/fxwithdraw/submitwithdraw',
    method: 'post',
    data: params
  })
}

// 机构列表页
export function getUserList(params) {
  return request({
    url: '/api/fxuser/getuserlist',
    method: 'post',
    data: params
  })
}

export function saveOrganization(params) {
  return request({
    url: '/api/fxorganization/editorganization',
    method: 'post',
    data: params
  })
}
