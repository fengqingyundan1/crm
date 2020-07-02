import request from '@/utils/request'

// 添加活动
export function searchOrder(params) {
  return request({
    url: '/api/fxorder/queryorders',
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