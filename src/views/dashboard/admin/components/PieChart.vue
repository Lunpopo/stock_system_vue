<template>
  <div v-loading="listLoading" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { getOutboundPieStatistics } from '@/api/outbound_order'
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
      default: '400px'
    }
  },

  data() {
    return {
      listLoading: true,
      // 经销商列表
      dealer_names: [],
      // 经销商数据列表，里面是字典
      dealer_price_data: [],
      chart: null
    }
  },

  created() {
    this.get_outbound_pie_data()
  },

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    // 获取各个经销商出库金额的饼图统计信息
    get_outbound_pie_data() {
      this.listLoading = true
      getOutboundPieStatistics().then((response) => {
        // 然后再给饼状图赋值
        this.dealer_names = response.data.dealer_names
        this.dealer_price_data = response.data.data_dict

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
          text: '前5名经销商进货额统计信息：',
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
          data: this.dealer_names
        },
        series: [
          {
            name: '前5名经销商进货额统计信息',
            type: 'pie',
            roseType: 'radius',
            // radius: [15, 95],
            radius: [30, 130],
            // center: ['50%', '38%'],
            data: this.dealer_price_data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
