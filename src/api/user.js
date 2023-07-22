/*
 * @Author: lunpopo lunpopo.personal@gmail.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: lunpopo lunpopo.personal@gmail.com
 * @LastEditTime: 2023-02-25 20:45:38
 * @FilePath: /vue-element-admin/src/api/user.js
 * @Description: 用户信息api
 */
import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户token
export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function getViewRoutes() {
  return request({
    url: '/user/get_view_routes',
    method: 'get'
  })
}
