/*
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2023-02-22 15:42:36
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-03-06 17:24:28
 * @FilePath: /order_system_vue/src/api/menu.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 添加功能api
export function addApi(data) {
  return request({
    url: '/user/add_api',
    method: 'post',
    data
  })
}

// 更新功能api
export function updateApi(data) {
  return request({
    url: `/user/update_api`,
    method: 'post',
    data
  })
}

// 删除功能api
export function deleteApi(data) {
  return request({
    url: `/user/delete_api`,
    method: 'post',
    data
  })
}

// 搜索api功能
export function searchApi(query) {
  return request({
    url: `/user/search_api`,
    method: 'get',
    params: query
  })
}
