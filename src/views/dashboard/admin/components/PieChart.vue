<template>
  <div v-loading="listLoading" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { getProfitPieStatistics } from '@/api/stock_statistics'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    }
  },

  data() {
    return {
      listLoading: true,
      // 股票名字列表
      stock_names: [],
      // 数据列表
      profit_amount_data: [],
      chart: null
    }
  },

  created() {
    this.get_pie_data()
  },

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    // 获取各个股票盈利的饼图统计信息
    get_pie_data() {
      this.listLoading = true
      getProfitPieStatistics().then((response) => {
        // 然后再给饼状图赋值
        this.stock_names = response.data.stock_names
        this.profit_amount_data = response.data.data_dict

        this.$nextTick(() => {
          this.initChart()
        })
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: '前10名股票盈利统计信息：',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bolder'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.stock_names
        },
        series: [
          {
            name: '前10名股票盈利统计信息',
            type: 'pie',
            roseType: 'radius',
            // radius: [15, 95],
            radius: [30, 130],
            // center: ['50%', '38%'],
            data: this.profit_amount_data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
