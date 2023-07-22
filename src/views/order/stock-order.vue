<template>
  <div class="app-container">
    <!-- 过滤组件 -->
    <div class="filter-container">
      <el-input v-model.trim="searchTitle" placeholder="请输入产品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出表格数据
      </el-button>
    </div>

    <el-tabs v-model.trim="activeName" type="card">
      <!-- 产品总库存数量表格 -->
      <el-tab-pane class="cs02">
        <span slot="label"><i class="el-icon-date" /> 产品总库存数量表</span>
        <!-- 表格数据 -->
        <el-table
          :key="totalTableKey"
          v-loading="listLoading"
          :data="total_list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >

          <el-table-column label="产品名称" prop="product_name" min-width="100px">
            <template slot-scope="{row}">
              <span>{{ row.product_name }} </span>
              <el-tag>{{ row.scent_type }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="规格（ML）" prop="specifications" align="center">
            <template slot-scope="{row}">
              <span>{{ row.specifications }}</span>
            </template>
          </el-table-column>

          <el-table-column label="每件规格（瓶）" prop="specification_of_piece" align="center">
            <template slot-scope="{row}">
              <span>{{ row.specification_of_piece }}</span>
            </template>
          </el-table-column>

          <el-table-column label="入库数量（瓶）" prop="unit_price" class-name="status-col">
            <template slot-scope="{row}">
              <span>{{ row.purchase_quantity }}</span>
            </template>
          </el-table-column>

          <el-table-column label="出库数量（瓶）" prop="price_of_piece" align="center">
            <template slot-scope="{row}">
              <span>{{ row.outbound_quantity }}</span>
            </template>
          </el-table-column>

          <el-table-column label="剩余库存数量（瓶）" prop="remarks" align="center">
            <template slot-scope="{row}">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>

          <el-table-column label="缩略图" prop="thumb_img" align="center">
            <template slot-scope="{row}">
              <el-popover
                placement="right"
                title=""
                trigger="click"
              >
                <img :src="row.img_url" style="max-height: 600px; max-width: 600px">
                <img slot="reference" :src="row.thumb_img_url" :alt="row.thumb_img_url" style="max-height: 35px; max-width: 110px">
              </el-popover>
            </template>
          </el-table-column>
        </el-table>

        <!-- 页面控制 -->
        <pagination v-show="total_count>0" :total="total_count" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTotalList" />
      </el-tab-pane>

      <!-- 产品入库数量表格 -->
      <el-tab-pane class="cs02">
        <span slot="label"><i class="el-icon-date" /> 产品入库数量表</span>
        <!-- 表格数据 -->
        <el-table
          :key="purchaseTableKey"
          v-loading="purchaseListLoading"
          :data="purchase_list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >

          <el-table-column label="产品名称" prop="product_name" min-width="100px">
            <template slot-scope="{row}">
              <span>{{ row.product_name }} </span>
              <el-tag>{{ row.scent_type }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="规格（ML）" prop="specifications" align="center">
            <template slot-scope="{row}">
              <span>{{ row.specifications }}</span>
            </template>
          </el-table-column>

          <el-table-column label="每件规格（瓶）" prop="specification_of_piece" align="center">
            <template slot-scope="{row}">
              <span>{{ row.specification_of_piece }}</span>
            </template>
          </el-table-column>

          <el-table-column label="单价（元）" prop="unit_price" align="center">
            <template slot-scope="{row}">
              <span>{{ row.unit_price }}</span>
            </template>
          </el-table-column>

          <el-table-column label="入库数量（瓶）" prop="unit_price" class-name="status-col">
            <template slot-scope="{row}">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>

          <el-table-column label="缩略图" prop="thumb_img" align="center">
            <template slot-scope="{row}">
              <el-popover
                placement="right"
                title=""
                trigger="click"
              >
                <img :src="row.img_url" style="max-height: 600px; max-width: 600px">
                <img slot="reference" :src="row.thumb_img_url" :alt="row.thumb_img_url" style="max-height: 35px; max-width: 110px">
              </el-popover>
            </template>
          </el-table-column>
        </el-table>

        <!-- 页面控制 -->
        <pagination v-show="purchase_count>0" :total="purchase_count" :page.sync="purchaseListQuery.page" :limit.sync="purchaseListQuery.limit" @pagination="getPurchaseList" />
      </el-tab-pane>

      <!-- 产品出库数量表格 -->
      <el-tab-pane class="cs02">
        <span slot="label"><i class="el-icon-date" /> 产品出库数量表</span>
        <!-- 表格数据 -->
        <el-table
          :key="outboundTableKey"
          v-loading="outboundListLoading"
          :data="outbound_list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >

          <el-table-column label="产品名称" prop="product_name" min-width="100px">
            <template slot-scope="{row}">
              <span>{{ row.product_name }} </span>
              <el-tag>{{ row.scent_type }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="规格（ML）" prop="specifications" align="center">
            <template slot-scope="{row}">
              <span>{{ row.specifications }}</span>
            </template>
          </el-table-column>

          <el-table-column label="每件规格（瓶）" prop="specification_of_piece" align="center">
            <template slot-scope="{row}">
              <span>{{ row.specification_of_piece }}</span>
            </template>
          </el-table-column>

          <el-table-column label="出库数量（瓶）" prop="unit_price" class-name="status-col">
            <template slot-scope="{row}">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>

          <el-table-column label="缩略图" prop="thumb_img" align="center">
            <template slot-scope="{row}">
              <el-popover
                placement="right"
                title=""
                trigger="click"
              >
                <img :src="row.img_url" style="max-height: 600px; max-width: 600px">
                <img slot="reference" :src="row.thumb_img_url" :alt="row.thumb_img_url" style="max-height: 35px; max-width: 110px">
              </el-popover>
            </template>
          </el-table-column>
        </el-table>

        <!-- 页面控制 -->
        <pagination v-show="outbound_count>0" :total="outbound_count" :page.sync="outboundListQuery.page" :limit.sync="purchaseListQuery.limit" @pagination="getPurchaseList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getStockDataList, getPurchaseStockDataList, getOutboundStockDataList, getStockAllData, getPurchaseStockAllData, getOutboundStockAllData } from '@/api/stock_order'
import 'animate.css'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'StockOrder',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // 产品入库加载
      purchaseListLoading: true,
      // 搜索名称
      searchTitle: '',
      activeName: 0,
      // 下载 excel 保存数据
      downloadDataList: [],
      totalTableKey: 0,
      purchaseTableKey: 0,
      outboundTableKey: 0,
      // 总库存数据列表
      total_list: null,
      // 入库数据列表
      purchase_list: null,
      // 出库数据列表
      outbound_list: null,
      // 数据总数
      total_count: 0,
      // 入库数据总数
      purchase_count: 0,
      // 出库数据总数
      outbound_count: 0,
      // 是否显示加载圆圈
      listLoading: true,
      // 数据请求参数
      listQuery: {
        page: 1,
        limit: 10
      },
      // 入库数据请求参数
      purchaseListQuery: {
        page: 1,
        limit: 10
      },
      // 出库数据请求参数
      outboundListQuery: {
        page: 1,
        limit: 10
      },
      // 加载动画
      downloadLoading: false
    }
  },

  // 初始化函数
  created() {
    this.getTotalList()
    this.getPurchaseList()
    this.getOutboundList()
  },

  methods: {
    // 处理下载 Excel 表格数据
    handleDownload() {
      this.downloadLoading = true
      let message = ''
      if (this.activeName === '0') {
        message = '是否确认将【产品总库存表】导出为Excel表格？'
      } else if (this.activeName === '1') {
        message = '是否确认将【产品入库表】导出为Excel表格？'
      } else if (this.activeName === '2') {
        message = '是否确认将【产品出库表】导出为Excel表格？'
      } else {
        this.$message({
          message: '错误的下载参数！',
          type: 'error'
        })
        this.downloadLoading = false
        return false
      }

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true
        if (this.activeName === '0') {
          getStockAllData(this.listQuery).then((response) => {
            const res = response.data.data

            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['产品名称', '规格（ML）', '香型', '每件规格（瓶）', '入库数量（瓶）', '出库数量（瓶）', '剩余库存数量（瓶）']
              const filterVal = ['product_name', 'specifications', 'scent_type', 'specification_of_piece', 'purchase_quantity', 'outbound_quantity', 'quantity']
              const data = this.formatJson(filterVal, res)

              // 导出 excel
              excel.export_json_to_excel({
                header: tHeader,
                autoWidth: true,
                data,
                bookType: 'xlsx',
                filename: '产品总库存数量表'
              })
            })
          })
          this.downloadLoading = false
        } else if (this.activeName === '1') {
          getPurchaseStockAllData(this.purchaseListQuery).then((response) => {
            const res = response.data.data

            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['产品名称', '规格（ML）', '香型', '每件规格（瓶）', '单价（元）', '入库数量（瓶）']
              const filterVal = ['product_name', 'specifications', 'scent_type', 'specification_of_piece', 'unit_price', 'quantity']
              const data = this.formatJson(filterVal, res)

              // 导出 excel
              excel.export_json_to_excel({
                header: tHeader,
                autoWidth: true,
                data,
                bookType: 'xlsx',
                filename: '产品入库数量表'
              })
            })
          })
          this.downloadLoading = false
        } else if (this.activeName === '2') {
          getOutboundStockAllData(this.outboundListQuery).then((response) => {
            const res = response.data.data

            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['产品名称', '规格（ML）', '香型', '每件规格（瓶）', '出库数量（瓶）']
              const filterVal = ['product_name', 'specifications', 'scent_type', 'specification_of_piece', 'quantity']
              const data = this.formatJson(filterVal, res)

              // 导出 excel
              excel.export_json_to_excel({
                header: tHeader,
                autoWidth: true,
                data,
                bookType: 'xlsx',
                filename: '产品出库数量表'
              })
            })
          })
          this.downloadLoading = false
        } else {
          this.$message({
            message: '错误的数据表格！',
            type: 'error'
          })
          this.downloadLoading = false
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消！'
        })
        this.downloadLoading = false
      })
    },
    // 格式转换
    formatJson(filterVal, jsonData) {
      const returnData = []
      jsonData.map(v => {
        v = filterVal.map(j => {
          // 如果是外表字段  即存在 "."
          if (j.indexOf('.') !== -1) {
            // 截取到"."之前的字符
            const subStar = j.substring(0, j.indexOf('.'))
            // 截取到"."之后的字符
            const subEnd = j.substring(j.indexOf('.') + 1, j.length)
            // 如果联表数据不为空
            if (v[subStar] != null) {
              return v[subStar][subEnd]
            }
          } else {
            if (j === 'update_time') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }
        })
        returnData.push(v)
      })
      return returnData
    },

    // 获取表格数据
    getTotalList() {
      this.listLoading = true
      this.listQuery.title = this.searchTitle
      getStockDataList(this.listQuery).then(response => {
        this.total_list = response.data.data
        this.total_count = response.data.count
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 获取入库数量数据
    getPurchaseList() {
      this.purchaseListLoading = true
      this.purchaseListQuery.title = this.searchTitle
      getPurchaseStockDataList(this.purchaseListQuery).then(response => {
        this.purchase_list = response.data.data
        this.purchase_count = response.data.count
        this.purchaseListLoading = false
      }).catch(() => {
        this.purchaseListLoading = false
      })
    },

    // 获取出库数量数据
    getOutboundList() {
      this.outboundListLoading = true
      this.outboundListQuery.title = this.searchTitle
      getOutboundStockDataList(this.outboundListQuery).then(response => {
        this.outbound_list = response.data.data
        this.outbound_count = response.data.count
        this.outboundListLoading = false
      }).catch(() => {
        this.outboundListLoading = false
      })
    },

    // 搜索功能
    handleFilter() {
      if (this.activeName === '0') {
        this.getTotalList()
      } else if (this.activeName === '1') {
        this.getPurchaseList()
      } else if (this.activeName === '2') {
        this.getOutboundList()
      } else {
        this.total_list = []
        this.total_count = 0
      }
    }
  }
}
</script>

<style>
  /* 产看详情的 style */
  /* .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  } */

  /* 移动端的适配 */
  @media screen and (max-width: 500px) {
    .el-dialog {
      width: 90% !important;
    }

    .el-form-item__content {
      margin: 0 !important;
    }
  }

  /**添加切换动画 */
  .cs02 {
    animation: fadeIn 1.2s 0.02s ease backwards;
    /*解释：
    * fadeInleft 是引用插件中的一个动画名称
    * 1s         是点击时，这个动画整体使用的时间
    * 0.02s      是动画刚开始显示需要的时间
    * ease       是动画开始的方向
    * backwards  有啥效果，鄙人目前还没看出来，百度查的说是“规定对象动画时间之外的状态”
    */
  }
</style>
