/*
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-08-11 11:14:36
 * @FilePath: /vue-admin-template/Users/popolun/test_folder/vue-element-admin/src/api/article.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 获取总体的库存数据-用于下载
export function getStockTotalProfit(query) {
  return request({
    url: '/order_statistics/get_stock_total_profit',
    method: 'get',
    params: query
  })
}

// // 获取总体的库存数据-用于下载
// export function getStockAllData(query) {
//   return request({
//     url: '/order_statistics/get_stock_all_data',
//     method: 'get',
//     params: query
//   })
// }

// // 获取入库的库存数据-用于下载
// export function getPurchaseStockAllData(query) {
//   return request({
//     url: '/order_statistics/get_purchase_stock_all_data',
//     method: 'get',
//     params: query
//   })
// }

// // 获取出库的库存数据-用于下载
// export function getOutboundStockAllData(query) {
//   return request({
//     url: '/order_statistics/get_outbound_stock_all_data',
//     method: 'get',
//     params: query
//   })
// }

// // 获取总体的库存数据
// export function getStockDataList(query) {
//   return request({
//     url: '/order_statistics/get_stock_data_list',
//     method: 'get',
//     params: query
//   })
// }

// // 获取入库的库存数据
// export function getPurchaseStockDataList(query) {
//   return request({
//     url: '/order_statistics/get_purchase_stock_data_list',
//     method: 'get',
//     params: query
//   })
// }

// // 获取出库的库存数据
// export function getOutboundStockDataList(query) {
//   return request({
//     url: '/order_statistics/get_outbound_stock_data_list',
//     method: 'get',
//     params: query
//   })
// }
