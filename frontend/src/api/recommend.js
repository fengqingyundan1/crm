import request from '@/utils/request'

// 弹框-搜索
export function searchPopimg(params) {
  return request({
    url: '/api/homescreen/homescreenlist',
    method: 'post',
    data: params
  })
}
// 弹框-添加修改
export function savePopimg(params) {
  return request({
    url: '/api/homescreen/savehomescreen',
    method: 'post',
    data: params
  })
}
//  弹框-上下线
export function switchPopimg(params) {
  return request({
    url: '/api/homescreen/editscreenstatus',
    method: 'post',
    data: params
  })
}



// banner-搜索
export function searchBanner(params) {
  return request({
    url: '/api/banner/getbannerlist',
    method: 'post',
    data: params
  })
}
// banner-添加修改
export function saveBanner(params) {
  return request({
    url: '/api/banner/savebanner',
    method: 'post',
    data: params
  })
}
//  banner-上下线
export function switchBanner(params) {
  return request({
    url: '/api/banner/editstatus',
    method: 'post',
    data: params
  })
}


// 广告-搜索
export function searchAd(params) {
  return request({
    url: '/api/Adrecommendation/adlist',
    method: 'post',
    data: params
  })
}
// 广告-添加修改
export function saveAd(params) {
  return request({
    url: '/api/Adrecommendation/saveadinfo',
    method: 'post',
    data: params
  })
}
//  广告-上下线
export function switchAd(params) {
  return request({
    url: '/api/Adrecommendation/editonline',
    method: 'post',
    data: params
  })
}

// 橱窗海报-搜索
export function searchWindow(params) {
  return request({
    url: '/api/Windowactivity/getwindowactivitylist',
    method: 'post',
    data: params
  })
}
// 橱窗海报-添加修改
export function saveWindow(params) {
  return request({
    url: '/api/Windowactivity/savewindowactivity',
    method: 'post',
    data: params
  })
}
//  橱窗海报-上下线
export function switchWindow(params) {
  return request({
    url: '/api/Windowactivity/editwindowstatus',
    method: 'post',
    data: params
  })
}



// 精选-搜索
export function searchSelected(params) {
  return request({
    url: '/api/Recommendation/getlist',
    method: 'post',
    data: params
  })
}
// 精选-添加修改
export function saveSelected(params) {
  return request({
    url: '/api/Recommendation/saveinfo',
    method: 'post',
    data: params
  })
}
//  精选-上下线
export function switchSelected(params) {
  return request({
    url: '/api/Recommendation/editstatus',
    method: 'post',
    data: params
  })
}