/*
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2023-02-27 09:30:06
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-02-27 14:48:55
 * @FilePath: /order_system_vue/src/api/role.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

/**
 * 返回所有的路由（菜单/api）
 * @returns
 */
export function getRoutes() {
  return request({
    url: '/user/routes',
    method: 'get'
  })
}

/**
 * 返回角色所对应的路由（菜单/api）
 * @returns
 */
export function getRoutesByRole(query) {
  return request({
    url: '/user/get_routes_by_role',
    method: 'get',
    params: query
  })
}

export function getRoles() {
  return request({
    url: '/user/roles',
    method: 'get'
  })
}

// 新增用户组
export function addRole(data) {
  return request({
    url: '/user/add_role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/user/update_role`,
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: `/user/delete_role`,
    method: 'post',
    data
  })
}
