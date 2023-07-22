/*
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2023-02-22 15:42:36
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-02-23 16:08:42
 * @FilePath: /order_system_vue/src/api/menu.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 获取菜单列表
export function getMenu(query) {
  return request({
    url: '/user/get_menu',
    method: 'get',
    params: query
  })
}

// 获取所有的api权限名
export function getAllPermission() {
  return request({
    url: '/user/get_all_permission',
    method: 'get'
  })
}

// 获取所有的父级菜单列表（非二级）
export function getParentMenu() {
  return request({
    url: '/user/get_parent_menu',
    method: 'get'
  })
}

// 添加菜单
export function addMenu(data) {
  return request({
    url: '/user/add_menu',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenu(data) {
  return request({
    url: `/user/update_menu`,
    method: 'post',
    data
  })
}

// 删除菜单
export function deleteMenu(data) {
  return request({
    url: `/user/delete_menu`,
    method: 'post',
    data
  })
}
