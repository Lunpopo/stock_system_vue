<template>
  <div class="dashboard-editor-container">
    <!-- 入库出库总金额和总数量统计 -->
    <el-row v-if="checkPermission(['admin', 'data', 'test'])" :gutter="40" class="panel-group">
      <!-- 盈利总金额 -->
      <el-col v-loading="stockInfoLoading" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-statistic group-separator="," :precision="2" decimal-separator="." :value="total_profit_amount" title="盈利总金额">
            <template slot="prefix">
              <i class="el-icon-s-flag" style="color: red" />
            </template>
            <template slot="suffix">
              <i class="el-icon-s-flag" style="color: blue" />
            </template>
          </el-statistic>
        </div>
      </el-col>

      <!-- 交易总次数 -->
      <el-col v-loading="stockInfoLoading" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-statistic :value="total_transaction_count" title="交易总次数" />
        </div>
      </el-col>

      <!-- 买入总金额 -->
      <el-col v-loading="stockInfoLoading" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-statistic group-separator="," :precision="2" decimal-separator="." :value="total_buy_amount" title="买入总金额" />
        </div>
      </el-col>

      <!-- 卖出总金额 -->
      <el-col v-loading="stockInfoLoading" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-statistic :value="total_sell_amount" :precision="2" title="卖出总金额" />
        </div>
      </el-col>
    </el-row>

    <el-row v-if="checkPermission(['admin', 'data', 'test'])" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <pie-chart />
          <!-- <bar-chart /> -->
        </div>
      </el-col>
      <!-- <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col> -->
    </el-row>

    <!-- 每行总共24个栅格，在不同尺寸的页面上如何分配宽度比例：
    xs	<768px	超小屏 如：手机
    sm	≥768px	小屏幕 如：平板
    md	≥992px	中等屏幕 如：桌面显示器
    lg	≥1200px	大屏幕 如：大桌面显示器
    xl	≥1920px	2k屏等 -->
    <!-- <el-row v-if="checkPermission(['admin', 'data', 'test'])" :gutter="32"> -->
    <!-- <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="margin-bottom:30px;"> -->
    <!-- <el-col :span="12"> -->
    <!-- <div class="chart-wrapper">
          <transaction-table />
        </div> -->
    <!-- </el-col> -->
    <!-- <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="margin-bottom:30px;"> -->
    <!-- <el-col :span="12"> -->
    <!-- <div class="chart-wrapper">
          <product-transaction-table />
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { getStockStatisticsInfo } from '@/api/stock_statistics'
import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import ProductTransactionTable from './components/ProductTransactionTable'
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
    PieChart // 饼图
    // BarChart, // 柱状图
    // TransactionTable,
    // ProductTransactionTable
  },

  data() {
    return {
      // 顶部的股票信息小旗标展示
      stockInfoLoading: true,
      // 加载圈圈
      listLoading: true,

      // 默认展示的折线统计图
      lineChartData: choiceStatistic.purchase_price,
      total_profit_amount: '',
      total_transaction_count: '',
      total_buy_amount: '',
      total_sell_amount: ''
    }
  },

  created() {
    // 初始化页面的数据
    this.stockStatisticsInfo()
  },

  methods: {
    checkPermission,
    // 获取股票统计信息：盈利总金额、交易总次数、买入总额、卖出总额
    stockStatisticsInfo() {
      this.stockInfoLoading = true
      getStockStatisticsInfo().then((response) => {
        const data = response.data
        this.total_profit_amount = data.total_profit_amount
        this.total_transaction_count = data.total_transaction_count
        this.total_buy_amount = data.total_buy_amount
        this.total_sell_amount = data.total_sell_amount
        this.stockInfoLoading = false
      }).catch(() => {
        this.stockInfoLoading = false
      })
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
