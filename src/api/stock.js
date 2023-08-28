/*
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2023-02-28 17:17:55
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-08-28 15:25:32
 * @FilePath: /order_system_vue/src/api/purchase_order.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 获取股票统计信息列表
export function getStockList(query) {
  return request({
    url: '/purchase_order/get_stock_list',
    method: 'get',
    params: query
  })
}

// 新增股票交易信息列表
export function addStockList(data) {
  return request({
    url: '/purchase_order/add_stock_list',
    method: 'post',
    data
  })
}

// 新增股票交易信息列表
export function updateStockList(data) {
  return request({
    url: '/purchase_order/update_stock_list',
    method: 'post',
    data
  })
}

// 根据 stock id 获取股票交易信息
export function getStockInfoById(data) {
  return request({
    url: '/purchase_order/get_stock_info_by_id',
    method: 'post',
    data
  })
}

// 根据 stock id 获取详细的股票交易信息
export function getStockTransactionById(data) {
  return request({
    url: '/purchase_order/get_stock_transaction_by_id',
    method: 'post',
    data
  })
}

// 通过 stock id 删除该股票及其交易信息
export function delStock(data) {
  return request({
    url: '/purchase_order/del_stock',
    method: 'post',
    data
  })
}

