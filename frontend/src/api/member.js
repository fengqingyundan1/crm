import request from '@/utils/request'

// 查看用户
export function searchMembers(params) {
  return request({
    url: '/api/member/getmembers',
    method: 'post',
    data: params
  })
}
// 更新用户
export function updateMembers(params) {
  return request({
    url: '/api/member/getupdatedinfo',
    method: 'post',
    data: params
  })
}
// 获取统计信息
export function getMemberCount(params) {
  return request({
    url: '/api/member/getmembercount',
    method: 'post',
    data: params
  })
}
