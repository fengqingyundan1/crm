import request from '@/utils/request'

// 保存-优惠券
export function saveCoupon(params) {
  return request({
    url: '/api/Coupon/save_coupon',
    method: 'post',
    data: params
  })
}


// 查询-优惠券
export function searchCoupon(params) {
  return request({
    url: '/api/Coupon/couponlist',
    method: 'post',
    data: params
  })
}


// 上下线-优惠券
export function switchacCoupon(params) {
  return request({
    url: '/api/Coupon/edit_online',
    method: 'post',
    data: params
  })
}
// 发券-优惠券
export function sendCoupon(params) {
  return request({
    url: '/api/Coupon/send_coupon',
    method: 'post',
    data: params
  })
}
// 领取-优惠券列表
export function userCoupon(params) {
  return request({
    url: '/api/Coupon/user_card_list',
    method: 'post',
    data: params
  })
}
