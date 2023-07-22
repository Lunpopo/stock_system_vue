<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// echarts theme
require('echarts/theme/macarons')
import resize from './mixins/resize'
import { parseTime } from '@/utils'

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },

    setOptions({ data, date_time, switch_name, title } = {}) {
      // 转换之后的时间
      const parse_date_time = []
      date_time.forEach(element => {
        element = parseTime(element, '{y}-{m}-{d}')
        parse_date_time.push(element)
      })

      this.chart.setOption({
        title: {
          text: title,
          textStyle: {
            fontSize: 18,
            fontWeight: 'bolder'
          }
        },
        xAxis: {
          data: parse_date_time,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 1,
          right: 1,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        // 是否打开控制按钮开关
        // legend: {
        //   // data: ['expected', 'actual']
        //   data: [switch_name]
        // },
        series: [{
          name: switch_name,
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: data,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
