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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '统计列表', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/advertising',
    component: Layout,
    children: [
      {
        path: 'advertising',
        name: 'Advertising',
        component: () => import('@/views/advertising/index'),
        meta: { title: '广告管理', icon: 'advertising' }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    children: [
      {
        path: 'member',
        name: 'Member',
        component: () => import('@/views/member/index'),
        meta: { title: '会员管理', icon: 'member' }
      }
    ]
  },
  {
    path: '/mallManage',
    component: Layout,
    redirect: '/mallManage/mallManageClass',
    name: 'MallManage',
    meta: { title: '商城管理', icon: 'mallManage' },
    children: [
      {
        path: 'mallManageClass',
        name: 'MallManageClass',
        component: () => import('@/views/mallManageClass/index'),
        meta: { title: '分类管理', icon: 'tree' }
      },
      {
        path: 'mallManageGood',
        name: 'MallManageGood',
        component: () => import('@/views/mallManageGood/index'),
        meta: { title: '商品管理', icon: 'good' }
      }
    ]
  },
  {
    path: '/withdraw',
    component: Layout,
    children: [
      {
        path: 'withdraw',
        name: 'Withdraw',
        component: () => import('@/views/withdraw/index'),
        meta: { title: '提现管理', icon: 'withdraw' }
      }
    ]
  },

  {
    path: '/article',
    component: Layout,
    children: [
      {
        path: 'article',
        name: 'article',
        component: () => import('@/views/article/index'),
        meta: { title: '文章管理', icon: 'article' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/views/setting/index'),
        meta: { title: '参数配置', icon: 'setting' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  }
]
const createRouter = () =>
  new Router({
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
