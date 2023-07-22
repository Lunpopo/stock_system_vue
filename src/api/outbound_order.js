/*
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-06-26 14:14:24
 * @FilePath: /vue-admin-template/Users/popolun/test_folder/vue-element-admin/src/api/article.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 获取各个经销商出库总金额柱状图信息
export function getOutboundBarStatistics(query) {
  return request({
    url: '/order_statistics/get_outbound_bar_statistics',
    method: 'get',
    params: query
  })
}

// 获取各个经销商出库总金额饼图信息
export function getOutboundPieStatistics(query) {
  return request({
    url: '/order_statistics/get_outbound_pie_statistics',
    method: 'get',
    params: query
  })
}

// 获取出库单总金额统计信息
export function getOutboundPriceStatistics(query) {
  return request({
    url: '/order_statistics/get_outbound_price_statistics',
    method: 'get',
    params: query
  })
}

// 获取出库单总数量统计信息
export function getOutboundPieceStatistics(query) {
  return request({
    url: '/order_statistics/get_outbound_piece_statistics',
    method: 'get',
    params: query
  })
}

// 获取出库单总金额和总数量
export function getTotalOutboundPriceAndPiece(query) {
  return request({
    url: '/order_statistics/get_total_outbound_price_and_piece',
    method: 'get',
    params: query
  })
}

// 获取出库单列表
export function getOutboundOrder(query) {
  return request({
    url: '/outbound_order/get_outbound_order',
    method: 'get',
    params: query
  })
}

// 新增一条出库单
export function addOutboundOrder(data) {
  return request({
    url: '/outbound_order/add_outbound_order',
    method: 'post',
    data
  })
}

// 编辑出库单
export function updateOutboundOrder(data) {
  return request({
    url: '/outbound_order/update_outbound_order',
    method: 'post',
    data
  })
}

// 通过出库单ID获取所有的产品列表
export function getOutboundProductDetails(query) {
  return request({
    url: '/outbound_order/get_outbound_product_details',
    method: 'get',
    params: query
  })
}

// 通过出库单ID删除该次进出库单
export function delOutboundOrder(data) {
  return request({
    url: '/outbound_order/del_outbound_order',
    method: 'post',
    data
  })
}
