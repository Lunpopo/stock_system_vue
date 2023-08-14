<template>
  <div v-loading="listLoading" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { getOutboundBarStatistics } from '@/api/outbound_order'
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
      chart: null,
      keys: [],
      values: []
    }
  },

  created() {
    this.get_outbound_bar_statistics()
  },

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    get_outbound_bar_statistics() {
      this.listLoading = true
      getOutboundBarStatistics().then((response) => {
        this.keys = response.data.keys
        const values = response.data.values

        for (var dealer_name in values) {
          const new_dict = {
            'name': dealer_name,
            'type': 'bar',
            'stack': 'vistors',
            // 'stack': dealer_name,
            'barWidth': '60%',
            'data': values[dealer_name],
            'animationDuration': 6000
          }
          this.values.push(new_dict)
        }

        // 初始化展示柱状图
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
          text: '各产品的经销商销售统计图（瓶）：',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bolder'
          }
        },
        tooltip: {
          // 鼠标放上去的提示信息
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          // top: '20%',
          left: '2%',
          right: '2%',
          // bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.keys,
          // boundaryGap: [0, 1],
          axisTick: {
            alignWithLabel: true,
            show: true
          },
          axisLabel: {
            interval: 0,
            // 显示完全的文字
            formatter: function(params, index) {
              var newParamsName = ''
              var paramsNameNumber = params.length
              var provideNumber = 5
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''
                  var start = p * provideNumber
                  var end = start + provideNumber
                  if (p === rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr
                }
              } else {
                newParamsName = params
              }
              return newParamsName
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        // 点击按钮
        // legend: {
        //   itemWidth: 15,
        //   itemHeight: 15,
        //   data: ['同事朋友', '刘总']
        // },
        series: this.values,
        dataZoom: [ // 滑动条
          {
            // xAxisIndex: 0, // 这里是从X轴的0刻度开始
            show: true, // 是否显示滑动条，不影响使用
            type: 'slider', // inside是内部滑块，隐藏了外部的明显滑块，slider会显示出滑块出来
            // startValue: 0, // 从头开始。
            endValue: 5 // 一次性展示5+1个。
            // zoomOnMouseWheel: false, // 关闭滚轮缩放
            // moveOnMouseWheel: true, // 开启滚轮平移
            // moveOnMouseMove: true // 鼠标移动能触发数据窗口平移
          }
        ]
      })
    }
  }
}
</script>
