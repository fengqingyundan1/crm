import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/userList',
    // meta: { title: '用户管理', icon: 'example' },
    children: [
      {
        path: 'userList',
        name: 'userList',
        component: () => import('@/views/user/userList'),
        meta: { title: '用户管理', icon: 'example'}
      },     
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/h5Activity',
    name: 'activity',
    meta: { title: '活动管理', icon: 'example' },
    children: [
      {
        path: 'shopPond',
        name: 'shopPond',
        component: () => import('@/views/activity/shopPond'),
        meta: { title: '商品池'}
      },     
      {
        path: 'h5Activity',
        name: 'h5Activity',
        component: () => import('@/views/activity/h5Activity'),
        meta: { title: 'H5活动'}
      }
    ]
  },
  {
    path: '/recommend',
    component: Layout,
    redirect: '/recommend/popImg',
    meta: { title: '推荐管理', icon: 'example' },
    children: [
      {
        path: 'popImg',
        name: 'popImg',
        component: () => import('@/views/recommend/popImg'),
        meta: { title: '首页弹框' }
      },
      {
        path: 'banner',
        name: 'banner',
        component: () => import('@/views/recommend/banner'),
        meta: { title: '首页轮播' }
      }, 
      {
        path: 'selected',
        name: 'selected',
        component: () => import('@/views/recommend/selected'),
        meta: { title: '精选推荐' }
      },
      {
        path: 'window/2',
        name: 'window-s',
        component: () => import('@/views/recommend/window'),
        meta: { title: 'S级橱窗' }
      },
      {
        path: 'window/1',
        name: 'poster',
        component: () => import('@/views/recommend/window'),
        meta: { title: '海报管理' }
      },     
      {
        path: 'ad',
        name: 'ad',
        component: () => import('@/views/recommend/ad'),
        meta: { title: '广告推荐' }
      },    
      {
        path: 'window/3',
        name: 'window',
        component: () => import('@/views/recommend/window'),
        meta: { title: '日常橱窗(未使用)' }
      }
    ]
  },
  {
    path: '/sales',
    component: Layout,
    redirect: '/sales/coupon',
    name: 'sales',
    meta: { title: '促销管理', icon: 'example' },
    children: [
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('@/views/sales/coupon'),
        meta: { title: '优惠券'}
      },
      {
        path: 'couponPeople',
        name: 'couponPeople',
        component: () => import('@/views/sales/couponPeople'),
        meta: { title: '优惠券领取列表'}
      }
    ]
  },
]

/**
 * asyncRoutes
 * 异步获路由结构，在填充
 */
export const asyncRoutes = [
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
