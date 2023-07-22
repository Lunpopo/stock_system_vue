/*
 * @Author: lunpopo lunpopo.personal@gmail.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-03-03 14:59:25
 * @FilePath: /order_system_vue/src/store/modules/permission.js
 * @Description: 动态路由控制
 */
// import { asyncRoutes, constantRoutes } from '@/router'
import { constantRoutes } from '@/router'
import { getViewRoutes } from '@/api/user'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 根据后台返回的路径，生成页面的组件模版
 * @param component 组件名
 * @returns 导入的包的对象
 */
function loadView(component) {
  return (resolve) => require([`@/${component}.vue`], resolve)
}

/**
 * 把后台返回菜单组装成routes要求的格式
 * @param routes routes
 */
function getAsyncRoutes(routes) {
  const res = []
  const keys = ['path', 'name', 'children', 'redirect', 'alwaysShow', 'meta', 'hidden']
  routes.forEach(item => {
    const newItem = {}
    if (item.component) {
      if (item.component === 'layout/Layout' || item.component === 'Layout') {
        newItem.component = Layout
      } else {
        newItem.component = loadView(item.component)
      }
    }
    for (const key in item) {
      if (keys.includes(key)) {
        newItem[key] = item[key]
      }
    }
    if (newItem.children && newItem.children.length) {
      newItem.children = getAsyncRoutes(item.children)
    }
    res.push(newItem)
  })
  return res
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  /**
   * 根据角色生成对应角色可访问的路由对象数组
   * @param {commit} 不知道
   * @param {roles} roles 角色信息
   * @returns
   */
  generateRoutes({ commit }, roles) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      let accessedRoutes

      // 这块是后端传过来的动态路由dict
      // --------snip--------
      if (roles.includes('admin')) {
        const routes = await getViewRoutes() // 获取到后台路由
        const asyncRoutes = getAsyncRoutes(routes.data) // 对路由格式进行处理
        accessedRoutes = asyncRoutes || []
      } else {
        const routes = await getViewRoutes() // 获取到后台路由
        const asyncRoutes = getAsyncRoutes(routes.data) // 对路由格式进行处理
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // --------snip--------
      // // 这块是前端写死动态路由的部分
      // // --------snip--------
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // // --------snip--------

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
