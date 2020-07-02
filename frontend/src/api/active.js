import request from '@/utils/request'

// 添加活动
export function addActive(params) {
  return request({
    url: '/api/fxactivity/addactivity',
    method: 'post',
    data: params
  })
}

// 编辑活动
export function editActive(params) {
  return request({
    url: '/api/fxactivity/editactivity',
    method: 'post',
    data: params
  })
}

// 查询活动
export function searchActive(params) {
  return request({
    url: '/api/fxactivity/queryactivity',
    method: 'post',
    data: params
  })
}

// 删除活动
export function deleteActive(params) {
  return request({
    url: '/api/fxactivity/deleteactivity',
    method: 'post',
    data: params
  })
}

// 上线下线活动
export function switchacActive(params) {
  return request({
    url: '/api/fxactivity/switchactivitystatus',
    method: 'post',
    data: params
  })
}

// 特权码模糊搜索
export function getCodeRule(params) {
  console.log(params)
  return request({
    url: '/api/fxactivity/getcoderule',
    method: 'post',
    data: params
  })
}


// H5-搜索
export function searchH5Activity(params) {
  return request({
    url: '/api/Activity2h5/getlist',
    method: 'post',
    data: params
  })
}
// H5-添加修改
export function saveH5Activity(params) {
  return request({
    url: '/api/Activity2h5/saveinfo',
    method: 'post',
    data: params
  })
}
//  H5-上下线
export function switchH5Activity(params) {
  return request({
    url: '/api/Activity2h5/editstatus',
    method: 'post',
    data: params
  })
}

// 商品池-搜索
export function searchPond(params) {
  return request({
    url: '/api/Commoditypool/getpoollist',
    method: 'post',
    data: params
  })
}
// 商品池-添加修改
export function savePond(params) {
  return request({
    url: '/api/Commoditypool/savepool',
    method: 'post',
    data: params
  })
}
//  商品池-上下线
export function switchPond(params) {
  return request({
    url: '/api/Recommendation/editstatus',
    method: 'post',
    data: params
  })
}