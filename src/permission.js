/*
 * @Author: lunpopo lunpopo.personal@gmail.com
 * @Date: 2023-02-25 16:23:05
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-03-14 20:37:53
 * @FilePath: /order_system_vue/src/permission.js
 * @Description:
 */
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // 用户登录成功之后，会在全局钩子router.beforeEach中拦截路由，判断是否已获得token，在获得token之后我们就要去获取用户的基本信息了
  // 页面加载进度条，在左上角
  // start progress bar
  NProgress.start()

  // 设置页面的标题抬头
  // document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // 基于角色生成可访问路线图
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack方法确保addRoutes完成
          // 将replace:true设置为true，这样导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败！
          // 删除 token 并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          // next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((res) => {
  // finish progress bar
  NProgress.done()
})
