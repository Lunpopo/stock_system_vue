/*
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-08-28 15:25:51
 * @FilePath: /vue-admin-template/Users/popolun/test_folder/vue-element-admin/src/api/article.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 获取股票统计信息：股票盈利总金额、总交易次数、总买入额、总卖出额
export function getStockStatisticsInfo(query) {
  return request({
    url: '/order_statistics/get_stock_statistics_info',
    method: 'get',
    params: query
  })
}

// 获取各个股票盈利饼图信息
export function getProfitPieStatistics(query) {
  return request({
    url: '/order_statistics/get_profit_pie_statistics',
    method: 'get',
    params: query
  })
}
