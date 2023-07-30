<template>
  <div class="dashboard-editor-container">
    <!-- 入库出库总金额和总数量统计 -->
    <el-row v-if="checkPermission(['admin', 'data', 'test'])" :gutter="40" class="panel-group">
      <el-col v-loading="purchaseLoading" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-statistic group-separator="," :precision="2" decimal-separator="." :value="purchase_order_total_price" title="入库单总金额">
            <template slot="prefix">
              <i class="el-icon-s-flag" style="color: red" />
            </template>
            <template slot="suffix">
              <i class="el-icon-s-flag" style="color: blue" />
            </template>
          </el-statistic>
        </div>
      </el-col>

      <el-col v-loading="purchaseLoading" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-statistic :value="purchase_order_total_piece" title="入库单总数量（件）" />
        </div>
      </el-col>

      <el-col v-loading="outboundLoading" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-statistic group-separator="," :precision="2" decimal-separator="." :value="outbound_order_total_price" title="出库单总金额">
            <template slot="prefix">
              <i class="el-icon-s-flag" style="color: red" />
            </template>
            <template slot="suffix">
              <i class="el-icon-s-flag" style="color: blue" />
            </template>
          </el-statistic>
        </div>
      </el-col>

      <el-col v-loading="outboundLoading" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-statistic :value="outbound_order_total_piece" title="出库单总数量（瓶）" />
        </div>
      </el-col>
    </el-row>

    <panel-group v-if="checkPermission(['admin', 'data', 'test'])" @handleSetLineChartData="handleSetLineChartData" />

    <el-row v-if="checkPermission(['admin', 'data', 'test'])" v-loading="listLoading" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row v-if="checkPermission(['admin', 'data', 'test'])" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart />
          <!-- <bar-chart /> -->
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <!-- 每行总共24个栅格，在不同尺寸的页面上如何分配宽度比例：
    xs	<768px	超小屏 如：手机
    sm	≥768px	小屏幕 如：平板
    md	≥992px	中等屏幕 如：桌面显示器
    lg	≥1200px	大屏幕 如：大桌面显示器
    xl	≥1920px	2k屏等 -->
    <el-row v-if="checkPermission(['admin', 'data', 'test'])" :gutter="32">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="margin-bottom:30px;">
        <!-- <el-col :span="12"> -->
        <div class="chart-wrapper">
          <transaction-table />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="margin-bottom:30px;">
        <!-- <el-col :span="12"> -->
        <div class="chart-wrapper">
          <product-transaction-table />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { getTotalPurchasePriceAndPiece, getPurchasePriceStatistics, getPurchasePieceStatistics } from '@/api/purchase_order'
// import { getTotalOutboundPriceAndPiece, getOutboundPriceStatistics, getOutboundPieceStatistics } from '@/api/outbound_order'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import ProductTransactionTable from './components/ProductTransactionTable'
import checkPermission from '@/utils/permission' // 权限判断函数

const choiceStatistic = {
  purchase_price: {
    data: [],
    date_time: [],
    switch_name: '金额（元）'
  },
  purchase_piece: {
    data: [],
    date_time: [],
    switch_name: '数量（件）'
  },
  outbound_price: {
    data: [],
    date_time: [],
    switch_name: '金额（元）'
  },
  outbound_piece: {
    data: [],
    date_time: [],
    switch_name: '数量（件）'
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    BarChart,
    TransactionTable,
    ProductTransactionTable
  },

  data() {
    return {
      // 入库单总金额加载圈
      purchaseLoading: true,
      // 出库单总金额加载圈
      outboundLoading: true,
      // 加载圈圈
      listLoading: true,
      // 默认展示的折线统计图
      lineChartData: choiceStatistic.purchase_price,
      purchase_order_total_price: '',
      purchase_order_total_piece: '',
      outbound_order_total_price: '',
      outbound_order_total_piece: ''
    }
  },

  created() {
    // 初始化页面的数据
    this.getTotalPurchaseOutbound()
    this.getStatistic()
  },

  methods: {
    checkPermission,
    // 获取入库单和出库单的总金额和总数量
    getTotalPurchaseOutbound() {
      // this.purchaseLoading = true
      // // 入库单总金额统计
      // getTotalPurchasePriceAndPiece().then((response) => {
      //   const data = response.data
      //   this.purchase_order_total_price = data.total_price
      //   this.purchase_order_total_piece = data.total_piece
      //   this.purchaseLoading = false
      // }).catch(() => {
      //   this.purchaseLoading = false
      // })

      // this.outboundLoading = true
      // // 出库单总金额统计
      // getTotalOutboundPriceAndPiece().then((response) => {
      //   const data = response.data
      //   this.outbound_order_total_price = data.total_price
      //   this.outbound_order_total_piece = data.total_piece
      //   this.outboundLoading = false
      // }).catch(() => {
      //   this.outboundLoading = false
      // })
    },

    // 获取 4 个统计图的数据信息
    getStatistic() {
      this.getPurchaseStatistic()
      this.getOutboundStatistic()
    },

    // 获取入库单金额和时间的统计数据
    getPurchaseStatistic() {
      this.listLoading = true
      // getPurchasePriceStatistics().then((response) => {
      //   const _dict = {
      //     'data': response.data.y,
      //     'date_time': response.data.x,
      //     'switch_name': '金额（元）',
      //     'title': '入库金额统计（元）：'
      //   }
      //   choiceStatistic.purchase_price = _dict
      //   this.lineChartData = _dict
      //   this.listLoading = false
      // }).catch(() => {
      //   this.listLoading = false
      // })
      // getPurchasePieceStatistics().then((response) => {
      //   const _dict = {
      //     'data': response.data.y,
      //     'date_time': response.data.x,
      //     'switch_name': '数量（件）',
      //     'title': '入库数量统计（件）：'
      //   }
      //   choiceStatistic.purchase_piece = _dict
      // })
    },

    // 获取出库单金额和时间的统计数据
    getOutboundStatistic() {
      // getOutboundPriceStatistics().then((response) => {
      //   const _dict = {
      //     'data': response.data.y,
      //     'date_time': response.data.x,
      //     'switch_name': '金额（元）',
      //     'title': '出库金额统计（元）：'
      //   }
      //   choiceStatistic.outbound_price = _dict
      // })
      // getOutboundPieceStatistics().then((response) => {
      //   const _dict = {
      //     'data': response.data.y,
      //     'date_time': response.data.x,
      //     'switch_name': '数量（瓶）',
      //     'title': '出库数量统计（瓶）：'
      //   }
      //   choiceStatistic.outbound_piece = _dict
      // })
    },

    // 点击按钮 切换统计图
    handleSetLineChartData(type) {
      this.listLoading = true
      this.lineChartData = choiceStatistic[type]
      this.listLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-panel-col {
    margin-bottom: 32px;
  }

  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 16px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
