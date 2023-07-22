/*
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-03-30 15:20:27
 * @FilePath: /vue-admin-template/Users/popolun/test_folder/vue-element-admin/src/api/article.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 获取所有的产品列表（用于下载数据）
export function getAllProduct(query) {
  return request({
    url: '/data/get_all_product_data',
    method: 'get',
    params: query
  })
}

// 新增产品
export function addProduct(params) {
  return request({
    url: '/data/add_product',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    params,
    data: params.image
  })
}

// 更新产品
export function updateProduct(params) {
  return request({
    url: '/data/update_product',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    params,
    data: params.image
  })
}

// 删除产品
export function deleteProduct(data) {
  return request({
    url: '/data/delete_product',
    method: 'post',
    data
  })
}

// 批量删除产品
export function product_multi_delete(data) {
  return request({
    url: '/data/product_multi_delete',
    method: 'post',
    data
  })
}

// 搜索产品
export function searchProduct(query) {
  return request({
    url: '/data/search_product',
    method: 'get',
    params: query
  })
}
