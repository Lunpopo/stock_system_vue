/*
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2023-03-08 17:13:41
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-06-30 10:41:17
 * @FilePath: /order_system_vue/src/api/remote-search.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 获取交易信息api
export function transactionList(query) {
  return request({
    url: '/order_statistics/get_transaction_list',
    method: 'get',
    params: query
  })
}

// 获取产品交易信息api
export function productTransactionList(query) {
  return request({
    url: '/order_statistics/get_product_transaction_list',
    method: 'get',
    params: query
  })
}
