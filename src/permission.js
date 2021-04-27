import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 判断是否已经登录
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // i如果已经登录，重定向到 '/'
      next({ path: '/' })
      NProgress.done()
    } else {
      // 通过 getInfo 接口判断用户是否获得他对应的角色权限
      // 判断是否获取角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 注意:角色列表必须是一个数组，例如: ['admin'] 或者 ['developer','editor']
          // 通过 getInfo 来获取用户的角色
          const { roles } = await store.dispatch('user/getInfo')
          // 根据角色生成对应的权限路由
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            roles
          )
          // 动态添加路由
          router.addRoutes(accessRoutes)
          // 使用 next({ ...to, replace: true }) 确保路由完整添加成功
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有 token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 对于无需验证的白名单路由，直接进入
      next()
    } else {
      // 其他无权访问的页面将被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
