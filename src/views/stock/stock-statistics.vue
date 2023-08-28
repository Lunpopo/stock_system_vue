<!--
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-08-28 15:23:58
 * @FilePath: /vue-element-admin/src/views/tab/order.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container">
    <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加股票交易列表</el-button>

    <el-row v-loading="cardListLoading">
      <el-col v-for="(domain, index) in temp" :key="domain.id" :xs="22" :sm="22" :lg="10" :offset="1" style="margin-top: 20px">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <span style="font-size: 17px;font-weight: 800;"><i class="el-icon-document" />股票名称：{{ domain.stock_name }}</span>
            <el-button type="text" class="button" @click="handleDetails(domain.business_id)">查看详情<i class="el-icon-view el-icon--right" /></el-button>
            <el-button type="text" class="button" style="margin-right: 15px;" @click="handleUpdate(domain, index)">编辑<i class="el-icon-edit el-icon--right" /></el-button>
            <el-divider />
            <div class="bottom clearfix">最新操作时间：{{ domain.update_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
            <div class="bottom clearfix">交易次数：{{ domain.transaction_count }}</div>
            <div class="bottom clearfix">是否已清仓：
              <el-tag v-if="domain.is_cleared == '已清仓'" type="success">{{ domain.is_cleared }}</el-tag>
              <el-tag v-if="domain.is_cleared == '未清仓'" type="warning">{{ domain.is_cleared }}</el-tag>
            </div>
            <div class="bottom clearfix">最新成本价：<el-tag>{{ domain.latest_cost }}</el-tag></div>
            <div class="bottom clearfix">总盈利额：
              <el-tag v-if="domain.total_profit_amount >= 0" type="success">{{ domain.total_profit_amount }}</el-tag>
              <el-tag v-if="domain.total_profit_amount < 0" type="danger">{{ domain.total_profit_amount }}</el-tag>
            </div>
            <div class="bottom clearfix">备注：{{ domain.remarks }}</div>
            <el-button size="small" class="filter-item bottom clearfix" type="danger" icon="el-icon-delete" @click="handleDelete(domain, index)">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 查看详情页面弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" width="80%" :visible.sync="viewDetail">
      <el-table
        v-loading="listLoading"
        :data="currentTransactionList"
        border
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="交易类型" prod="transaction_type">
          <template slot-scope="{row}">
            <el-tag v-if="row.transaction_type === '买入'" type="success">{{ row.transaction_type }}</el-tag>
            <el-tag v-if="row.transaction_type === '卖出'" type="danger">{{ row.transaction_type }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="买入价格" prod="buy_price">
          <template slot-scope="{row}">
            <span>{{ row.buy_price }} </span>
          </template>
        </el-table-column>

        <el-table-column label="卖出价格" prod="sell_price">
          <template slot-scope="{row}">
            <span>{{ row.sell_price }} </span>
          </template>
        </el-table-column>

        <el-table-column label="数量" prod="quantity">
          <template slot-scope="{row}">
            <span>{{ row.quantity }} </span>
          </template>
        </el-table-column>

        <el-table-column label="价格" prod="subtotal_price">
          <template slot-scope="{row}">
            <span>{{ row.subtotal_price }} </span>
          </template>
        </el-table-column>

        <el-table-column label="卖出档位1" prod="sell_gear_one">
          <template slot-scope="{row}">
            <span>{{ row.sell_gear_one }} </span>
          </template>
        </el-table-column>

        <el-table-column label="卖出档位2" prod="sell_gear_two">
          <template slot-scope="{row}">
            <span>{{ row.sell_gear_two }} </span>
          </template>
        </el-table-column>

        <el-table-column label="加仓价格" prod="markup_price">
          <template slot-scope="{row}">
            <span>{{ row.markup_price }} </span>
          </template>
        </el-table-column>

        <el-table-column label="重仓价格" prod="heavy_price">
          <template slot-scope="{row}">
            <span>{{ row.heavy_price }} </span>
          </template>
        </el-table-column>

        <el-table-column label="交易时间" width="120px" prod="create_time">
          <template slot-scope="{row}">
            <span>{{ row.create_time | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="成本价" prod="cost">
          <template slot-scope="{row}">
            <span>{{ row.cost }} </span>
          </template>
        </el-table-column>

        <el-table-column label="剩余仓位" prod="remain_positions">
          <template slot-scope="{row}">
            <span>{{ row.remain_positions }} </span>
          </template>
        </el-table-column>

        <el-table-column label="盈利数额" prod="profit_amount">
          <template slot-scope="{row}">
            <span>{{ row.profit_amount }} </span>
          </template>
        </el-table-column>

        <el-table-column label="分红" prod="dividend_amount">
          <template slot-scope="{row}">
            <span>{{ row.dividend_amount }} </span>
          </template>
        </el-table-column>

        <el-table-column label="交易状态" prod="transaction_status">
          <template slot-scope="{row}">
            <span v-if="row.transaction_status === '未清仓'"><el-tag> {{ row.transaction_status }} </el-tag></span>
            <span v-if="row.transaction_status === '已清仓'"><el-tag type="success"> {{ row.transaction_status }} </el-tag></span>
          </template>
        </el-table-column>

        <el-table-column label="备注" prop="remarks" width="130px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.remarks }}</span>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

    <!-- 页面控制 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />

    <!-- 添加 按钮弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" width="80%" :visible.sync="dialogFormVisible" @close="cancelAddOrder">
      <el-form ref="dataForm" :rules="rules" :model="dynamicValidateForm" label-width="120px" label-position="right">
        <el-form-item prop="stock_name" label="股票名称：">
          <el-input v-model.trim="dynamicValidateForm.stock_name" />
        </el-form-item>

        <el-form-item prop="stock_code" label="股票代码：">
          <el-input v-model.trim="dynamicValidateForm.stock_code" />
        </el-form-item>

        <el-form-item label="股票交易列表：" prop="stock_transaction_list">
          <el-table
            v-loading="detailsListLoading"
            :data="saveStockTransaction"
            border
            style="width: 100%"
          >
            <el-table-column label="交易类型" prod="transaction_type">
              <template slot-scope="{row}">
                <el-tag v-if="row.transaction_type === '买入'" type="success">{{ row.transaction_type }}</el-tag>
                <el-tag v-if="row.transaction_type === '卖出'" type="danger">{{ row.transaction_type }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="买入价格" prod="buy_price">
              <template slot-scope="{row}">
                <span>{{ row.buy_price }} </span>
              </template>
            </el-table-column>

            <el-table-column label="卖出价格" prod="sell_price">
              <template slot-scope="{row}">
                <span>{{ row.sell_price }} </span>
              </template>
            </el-table-column>

            <el-table-column label="数量" prod="quantity">
              <template slot-scope="{row}">
                <span>{{ row.quantity }} </span>
              </template>
            </el-table-column>

            <el-table-column label="价格" prod="subtotal_price">
              <template slot-scope="{row}">
                <span>{{ row.subtotal_price }} </span>
              </template>
            </el-table-column>

            <el-table-column label="卖出档位1" prod="sell_gear_one">
              <template slot-scope="{row}">
                <span>{{ row.sell_gear_one }} </span>
              </template>
            </el-table-column>

            <el-table-column label="卖出档位2" prod="sell_gear_two">
              <template slot-scope="{row}">
                <span>{{ row.sell_gear_two }} </span>
              </template>
            </el-table-column>

            <el-table-column label="加仓价格" prod="markup_price">
              <template slot-scope="{row}">
                <span>{{ row.markup_price }} </span>
              </template>
            </el-table-column>

            <el-table-column label="重仓价格" prod="heavy_price">
              <template slot-scope="{row}">
                <span>{{ row.heavy_price }} </span>
              </template>
            </el-table-column>

            <el-table-column label="交易时间" width="250px" prod="create_time">
              <template slot-scope="{row}">
                <el-date-picker v-model.trim="row.create_time" type="date" value-format="timestamp" placeholder="选择日期时间" />
              </template>
            </el-table-column>

            <el-table-column label="备注" prop="remarks" width="130px" align="center">
              <template slot-scope="{row}">
                <el-input v-model.trim="row.remarks" :value="row.remarks" placeholder="输入备注信息" />
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="{row,$index}">
                <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDeleteProduct($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="addStockTransactionList">点击添加股票交易信息</el-button>
        </el-form-item>

        <!-- <el-form-item label="合计（元）：" prop="total_price">
          <el-input-number v-model.trim="dynamicValidateForm.total_price" disabled :controls="true" :precision="3" />
        </el-form-item> -->

        <el-form-item label="备注" prop="remarks">
          <el-input v-model.trim="dynamicValidateForm.remarks" :autosize="{ minRows: 2, maxRows: 2}" type="textarea" placeholder="输入该次交易的备注信息" />
        </el-form-item>
      </el-form>

      <!-- 点击添加股票交易列表 dialog -->
      <el-dialog
        width="60%"
        title="添加所选股票的交易信息"
        :visible.sync="innerVisible"
        append-to-body
      >
        <!-- <el-divider /> -->
        <el-form ref="dataFormTransaction" :rules="rules" :model="dynamicStockListForm" label-width="150px" label-position="right">
          <el-form-item label="交易类型：" prop="transaction_type">
            <el-select v-model.trim="dynamicStockListForm.transaction_type" placeholder="请选择交易类型" clearable class="filter-item">
              <el-option v-for="item in transactionTypeOptions" :key="item.id" :label="item.transaction_type" :value="item.transaction_type" />
            </el-select>
          </el-form-item>

          <el-form-item label="产品的类型：" prop="product_type">
            <el-select v-model.trim="dynamicStockListForm.product_type" placeholder="请选择产品的类型" clearable class="filter-item">
              <el-option v-for="item in productTypeOptions" :key="item.id" :label="item.product_type" :value="item.product_type" />
            </el-select>
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '买入'" label="买入价格：" prop="buy_price">
            <el-input-number v-model.trim="dynamicStockListForm.buy_price" :controls="true" :precision="3" />
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '买入'" label="买入数量：" prop="quantity">
            <el-input-number v-model.trim="dynamicStockListForm.quantity" placeholder="输入买入数量" :controls="true" @change="calTotalChangePrice(dynamicStockListForm)" />
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '买入'" label="小计买入价格：" prop="subtotal_price">
            <el-input-number v-model.trim="dynamicStockListForm.subtotal_price" :controls="true" @change="calUnitPrice(dynamicStockListForm)" />
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '买入'" label="卖出档位1（10%）：" prop="sell_gear_one">
            <el-input-number v-model.trim="dynamicStockListForm.sell_gear_one" :controls="true" />
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '买入'" label="卖出档位2（20%）：" prop="sell_gear_two">
            <el-input-number v-model.trim="dynamicStockListForm.sell_gear_two" :controls="true" />
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '买入'" label="加仓价格（10%）：" prop="markup_price">
            <el-input-number v-model.trim="dynamicStockListForm.markup_price" :controls="true" />
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '买入'" label="重仓价格（20%）：" prop="heavy_price">
            <el-input-number v-model.trim="dynamicStockListForm.heavy_price" :controls="true" />
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '卖出'" label="卖出价格：" prop="sell_price">
            <el-input-number v-model.trim="dynamicStockListForm.sell_price" :controls="true" :precision="3" />
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '卖出'" label="卖出数量：" prop="quantity">
            <el-input-number v-model.trim="dynamicStockListForm.quantity" :controls="true" @change="calTotalChangePrice(dynamicStockListForm)" />
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '卖出'" label="小计卖出价格：" prop="subtotal_price">
            <el-input-number v-model.trim="dynamicStockListForm.subtotal_price" :controls="true" @change="calUnitPrice(dynamicStockListForm)" />
          </el-form-item>

          <el-form-item v-if="dynamicStockListForm.transaction_type == '卖出'" label="分红金额：" prop="dividend_amount">
            <el-input-number v-model.trim="dynamicStockListForm.dividend_amount" :controls="true" @change="calDividendAmount(dynamicStockListForm)" />
          </el-form-item>

          <el-form-item prop="create_time" label="交易时间：">
            <el-date-picker v-model.trim="dynamicStockListForm.create_time" type="date" value-format="timestamp" placeholder="选择日期时间" />
          </el-form-item>

          <el-form-item label="备注" prop="remarks">
            <el-input v-model.trim="dynamicStockListForm.remarks" :autosize="{ minRows: 2, maxRows: 2}" type="textarea" placeholder="输入该股票的备注信息" />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="addStockTransaction">
            确认
          </el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddOrder">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addStockList, getStockInfoById, getStockTransactionById, updateStockList, getStockList, delStock } from '@/api/stock'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Order',
  components: { Pagination },
  directives: { waves },
  data() {
    // 限制数字
    const limitNumber = (rule, value, callback) => {
      value = parseInt(value)
      if (!value && value !== 0) {
        // 如果没有值
        return callback(new Error(rule.msg))
      } else {
        if (!Number.isInteger(+value)) {
          callback(new Error('只允许输入整数'))
        } else if (value < 0) {
          callback(new Error('数字应大于等于0'))
        } else {
          callback()
        }
      }
    }
    return {
      // 点击查看详情的产品表格的加载圈圈
      detailsListLoading: true,
      cardListLoading: true,
      listLoading: true,
      transactionTypeOptions: [{
        id: 12345,
        transaction_type: '买入'
      }, {
        id: 54321,
        transaction_type: '卖出'
      }],
      productTypeOptions: [{
        id: 12345,
        product_type: '股票'
      }, {
        id: 54321,
        product_type: '基金'
      }],
      // 存放临时的分红数额变量
      temp_dividend_amount: 0,
      // 存放详细交易信息的
      currentTransactionList: [],
      // 动态表单的提交内容
      dynamicValidateForm: {
        stock_name: ''
      },
      dynamicStockListForm: {
        product_type: '股票'
      },
      // 内嵌产品列表的总量
      productTotal: 0.0,
      listQuery: {
        page: 1,
        limit: 10
      },
      // 内嵌页面的产品列表分页参数
      productListQuery: {
        page: 1,
        limit: 10
      },
      // 存放所有的交易信息
      transactionList: [],
      // 保存临时交易信息
      saveStockTransaction: [],
      // 是否展示隐藏列
      showReviewer: false,
      temp: {},
      // 是否展示添加股票交易信息弹出框
      dialogFormVisible: false,
      // 是否打开内嵌的搜索产品 dialog
      innerVisible: false,
      // 是否展示详情弹出框
      viewDetail: false,
      // 弹出层的状态，例如是 create 或者是 update
      dialogStatus: '',
      textMap: {
        detail: '股票及其交易详情信息',
        update: '更新股票及其交易信息',
        create: '添加股票及其交易信息'
      },
      // 表单验证规则
      rules: {
        title: [{ required: true, message: '请输入入库单标题', trigger: 'change' }],
        product_name: [{ required: true, message: '请输入产品名', trigger: 'change' }],
        belong_to: [{ required: true, message: '请输入属于哪里的经销商价格', trigger: 'change' }],
        specifications: [{ required: true, msg: '请输入产品规格（ML）', validator: limitNumber, trigger: 'blur' }],
        // trigger 还一个属性是 blur，失去焦点再验证
        scent_type: [{ required: true, msg: '请选择产品的香型', trigger: 'change' }],
        specification_of_piece: [{ required: true, msg: '请输入产品的每件规格（瓶）', validator: limitNumber, trigger: 'blur' }],
        unit_price: [{ required: true, msg: '请输入出厂价（元/瓶）', validator: limitNumber, trigger: 'blur' }],
        price_of_piece: [{ required: true, msg: '请输入每件价格（元）', validator: limitNumber, trigger: 'blur' }],
        suggested_retail_price: [{ required: true, msg: '请输入建议零售价（元/瓶）', validator: limitNumber, trigger: 'blur' }],
        scanning_price: [{ required: true, msg: '请输入扫码价（元/瓶）', validator: limitNumber, trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },

  created() {
    // 初始化页面的数据
    this.getData()
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      // if (rowIndex === 1) {
      //   return 'warning-row'
      // } else if (rowIndex === 3) {
      //   return 'success-row'
      // }
      if (row.remain_positions === 0) {
        return 'success-row'
      } else {
        return ''
      }
    },

    // 获取当前日期的函数：2023-2-14 DONE
    getTime() {
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      return yy + '-' + mm + '-' + dd
    },
    // 取消添加订单
    cancelAddOrder() {
      this.dialogFormVisible = false
      // 清空临时保存的订单产品列表
      this.savePurchaseProduct = []

      // 清空表单
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dynamicValidateForm = {}
    },

    // 点击添加股票交易信息弹框
    addStockTransactionList() {
      this.innerVisible = true

      // 清空表单
      this.$nextTick(() => {
        this.$refs['dataFormTransaction'].clearValidate()
      })
      this.dynamicStockListForm = { product_type: '股票' }
      // 重置分红数额的临时变量
      this.temp_dividend_amount = 0
      const current_time = new Date().getTime()
      this.$delete(this.dynamicStockListForm, 'update_time')
      this.$set(this.dynamicStockListForm, 'update_time', current_time)
      this.$delete(this.dynamicStockListForm, 'create_time')
      this.$set(this.dynamicStockListForm, 'create_time', current_time)
    },

    calDividendAmount(element_obj) {
      // 计算分红之后的总金额
      if (element_obj.subtotal_price !== undefined && element_obj.subtotal_price !== null && element_obj.subtotal_price !== '' && element_obj.subtotal_price !== 0) {
        let subtotal_price = Number(element_obj.subtotal_price) // 总金额
        const dividend_amount = Number(element_obj.dividend_amount) // 分红金额
        const quantity = Number(element_obj.quantity) // 卖出数量

        if (this.temp_dividend_amount !== undefined && this.temp_dividend_amount !== null) {
          // 将总金额和单价复原回去
          subtotal_price = subtotal_price - Number(this.temp_dividend_amount)
        }

        const actual_subtotal_price = Number(parseFloat(subtotal_price + dividend_amount).toFixed(3)) // 实际总金额
        const actual_sell_price = Number(parseFloat(actual_subtotal_price / quantity).toFixed(3))

        this.$delete(this.dynamicStockListForm, 'sell_price')
        this.$set(this.dynamicStockListForm, 'sell_price', actual_sell_price)

        this.$delete(this.dynamicStockListForm, 'subtotal_price')
        this.$set(this.dynamicStockListForm, 'subtotal_price', actual_subtotal_price)

        this.temp_dividend_amount = dividend_amount
      }
    },

    // 输入总价格和数量之后立马进行正确的金额计算（如果是股票的话，用下面的计算公式计算，如果是场内基金的话，买入卖出都是万1的费率）
    // 股票：0.15‰佣金（我调到了万1.5）（最低5元）0.00015；0.02‰的过户费0.00002；1‰的印花税（卖出才有）0.0005
    calUnitPrice(element_obj) {
      if (element_obj.product_type === '股票' && element_obj.quantity !== null && element_obj.quantity !== '' && element_obj.quantity !== undefined && element_obj.quantity !== 0) {
        if (element_obj.transaction_type === '买入') {
          // 获取没有算手续费的总价格
          const subtotal_price = Number(parseFloat(element_obj.subtotal_price).toFixed(3))
          const quantity = Number(element_obj.quantity)

          // 计算实际的买入价格（需要加上手续费等等）
          // 计算佣金费有没有超过5块
          const commission = Number(parseFloat(subtotal_price * 0.00015).toFixed(3))
          let actual_subtotal_price = 0.0 // 实际买入总价格
          if (commission < 5) {
            // (25500.00) + 5 + (25500.00 * 0.00002)
            actual_subtotal_price = Number(parseFloat(subtotal_price + 5.0 + subtotal_price * 0.00002).toFixed(3))
          } else {
            actual_subtotal_price = Number(parseFloat(subtotal_price + commission + subtotal_price * 0.00002).toFixed(3))
          }

          // 实际买入单价
          const actual_buy_price = Number(parseFloat(actual_subtotal_price / quantity).toFixed(3))

          if (actual_subtotal_price >= 0) {
            // 页面数据更新
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', actual_subtotal_price)
            // 实际的买入单价
            this.$delete(this.dynamicStockListForm, 'buy_price')
            this.$set(this.dynamicStockListForm, 'buy_price', actual_buy_price)

            // 卖出档位1、卖出档位2、加仓价格、重仓价格
            const sell_gear_one_price = Number(parseFloat(actual_buy_price * 1.1).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'sell_gear_one')
            this.$set(this.dynamicStockListForm, 'sell_gear_one', sell_gear_one_price)
            const sell_gear_two_price = Number(parseFloat(actual_buy_price * 1.2).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'sell_gear_two')
            this.$set(this.dynamicStockListForm, 'sell_gear_two', sell_gear_two_price)
            const markup_price = Number(parseFloat(actual_buy_price * 0.9).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'markup_price')
            this.$set(this.dynamicStockListForm, 'markup_price', markup_price)
            const heavy_price = Number(parseFloat(actual_buy_price * 0.8).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'heavy_price')
            this.$set(this.dynamicStockListForm, 'heavy_price', heavy_price)
          } else {
            // 页面更新数据，得先删除这个属性，再进行赋值
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', undefined)
          }
        } else {
          // 卖出股票
          // 获取没有算手续费的总价格
          const subtotal_price = Number(parseFloat(element_obj.subtotal_price).toFixed(3))
          const quantity = Number(element_obj.quantity)

          // 计算实际的买入价格（需要加上手续费等等）
          // 计算佣金费有没有超过5块
          let commission = Number(parseFloat(subtotal_price * 0.00015).toFixed(3))

          let actual_subtotal_price = 0.0 // 实际卖出总价格
          if (commission < 5) {
            // (15300) - 5 - (15300 * 0.00002) - (15300 * 0.0005)
            // 手续费
            commission = Number(5.0)
            // 印花税
            const stamp_duty = Number(subtotal_price) * 0.0005
            // 过户费
            const transfer_fee = Number(subtotal_price) * 0.00002
            actual_subtotal_price = Number(parseFloat(subtotal_price - commission - transfer_fee - stamp_duty).toFixed(3))
          } else {
            // 印花税
            const stamp_duty = Number(subtotal_price) * 0.0005
            // 过户费
            const transfer_fee = Number(subtotal_price) * 0.00002
            actual_subtotal_price = Number(parseFloat(subtotal_price - commission - transfer_fee - stamp_duty).toFixed(3))
          }

          // 实际卖出单价
          const actual_sell_price = Number(parseFloat(actual_subtotal_price / quantity).toFixed(3))

          if (actual_subtotal_price >= 0) {
            // 页面更新数据，得先删除这个属性，再进行赋值
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', actual_subtotal_price)
            // 实际的卖出单价
            this.$delete(this.dynamicStockListForm, 'sell_price')
            this.$set(this.dynamicStockListForm, 'sell_price', actual_sell_price)
          } else {
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', undefined)
          }
        }
      } else if (element_obj.product_type === '基金' && element_obj.quantity !== null && element_obj.quantity !== '' && element_obj.quantity !== undefined && element_obj.quantity !== 0) {
        if (element_obj.transaction_type === '买入') {
          // 获取没有算手续费的总价格
          const subtotal_price = Number(parseFloat(element_obj.subtotal_price).toFixed(3))
          const quantity = Number(element_obj.quantity)

          // 计算实际的买入价格（需要加上手续费等等）
          let actual_subtotal_price = 0.0 // 实际买入总价格
          // 万一的手续费
          actual_subtotal_price = Number(parseFloat(subtotal_price + subtotal_price * 0.0001).toFixed(3))

          // 实际买入单价
          const actual_buy_price = Number(parseFloat(actual_subtotal_price / quantity).toFixed(3))

          if (actual_subtotal_price >= 0) {
            // 页面更新数据，得先删除这个属性，再进行赋值
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', actual_subtotal_price)
            // 实际的买入单价
            this.$delete(this.dynamicStockListForm, 'buy_price')
            this.$set(this.dynamicStockListForm, 'buy_price', actual_buy_price)

            // 卖出档位1、卖出档位2、加仓价格、重仓价格
            const sell_gear_one_price = Number(parseFloat(actual_buy_price * 1.1).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'sell_gear_one')
            this.$set(this.dynamicStockListForm, 'sell_gear_one', sell_gear_one_price)
            const sell_gear_two_price = Number(parseFloat(actual_buy_price * 1.2).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'sell_gear_two')
            this.$set(this.dynamicStockListForm, 'sell_gear_two', sell_gear_two_price)
            const markup_price = Number(parseFloat(actual_buy_price * 0.9).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'markup_price')
            this.$set(this.dynamicStockListForm, 'markup_price', markup_price)
            const heavy_price = Number(parseFloat(actual_buy_price * 0.8).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'heavy_price')
            this.$set(this.dynamicStockListForm, 'heavy_price', heavy_price)
          } else {
            // 页面更新数据，得先删除这个属性，再进行赋值
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', undefined)
          }
        } else {
          // 卖出股票
          // 获取没有算手续费的总价格
          const subtotal_price = Number(parseFloat(element_obj.subtotal_price).toFixed(3))
          const quantity = Number(element_obj.quantity)

          // 计算实际的买入价格（需要加上手续费等等）
          let actual_subtotal_price = 0.0 // 实际卖出总价格
          // 万1的手续费
          actual_subtotal_price = Number(parseFloat(subtotal_price - subtotal_price * 0.0001).toFixed(3))

          // 实际卖出单价
          const actual_sell_price = Number(parseFloat(actual_subtotal_price / quantity).toFixed(3))

          if (actual_subtotal_price >= 0) {
            // 页面更新数据，得先删除这个属性，再进行赋值
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', actual_subtotal_price)
            // 实际的卖出单价
            this.$delete(this.dynamicStockListForm, 'sell_price')
            this.$set(this.dynamicStockListForm, 'sell_price', actual_sell_price)
          } else {
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', undefined)
          }
        }
      }
    },

    // （用于内嵌的添加交易列表的表单价格计算）更改数量之后立马更新 行内的 小计金额 和 外面的总计金额 和 总计件数
    calTotalChangePrice(element_obj) {
      if (element_obj.transaction_type === '买入') {
        const buy_price = Number(parseFloat(element_obj.buy_price).toFixed(3))

        if (element_obj.quantity !== undefined) {
          const subtotal_price = parseFloat(buy_price * Number(element_obj.quantity)).toFixed(3) // 买入的价格小计
          if (subtotal_price >= 0) {
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', subtotal_price)

            // 卖出档位1、卖出档位2、加仓价格、重仓价格
            const sell_gear_one_price = Number(parseFloat(buy_price * 1.1).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'sell_gear_one')
            this.$set(this.dynamicStockListForm, 'sell_gear_one', sell_gear_one_price)
            const sell_gear_two_price = Number(parseFloat(buy_price * 1.2).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'sell_gear_two')
            this.$set(this.dynamicStockListForm, 'sell_gear_two', sell_gear_two_price)
            const markup_price = Number(parseFloat(buy_price * 0.9).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'markup_price')
            this.$set(this.dynamicStockListForm, 'markup_price', markup_price)
            const heavy_price = Number(parseFloat(buy_price * 0.8).toFixed(3))
            this.$delete(this.dynamicStockListForm, 'heavy_price')
            this.$set(this.dynamicStockListForm, 'heavy_price', heavy_price)
          } else {
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', undefined)
          }
        }
      } else {
        // 卖出
        const sell_price = Number(parseFloat(element_obj.sell_price).toFixed(3))
        if (element_obj.quantity !== undefined) {
          const subtotal_price = parseFloat(sell_price * Number(element_obj.quantity)).toFixed(3) // 卖出的价格小计
          if (subtotal_price >= 0) {
            // 页面数据更新
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', subtotal_price)
          } else {
            this.$delete(this.dynamicStockListForm, 'subtotal_price')
            this.$set(this.dynamicStockListForm, 'subtotal_price', undefined)
          }
        }
      }
    },

    // 点击 添加按钮 添加股票交易信息
    handleCreate() {
      // 增加一个时间戳，用来前端更新弹出层用的
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.detailsListLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // 清空股票交易列表
      this.saveStockTransaction = []
    },

    // 更新股票及其交易信息
    handleUpdate(domain, index) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      this.detailsListLoading = true
      const params = {
        'stock_id': domain.business_id
      }
      getStockInfoById(params).then((response) => {
        const stock_obj = response.data.stock_obj
        const transaction_obj_list = response.data.transaction_obj_list

        // 股票名
        this.$delete(this.dynamicValidateForm, 'stock_name')
        this.$set(this.dynamicValidateForm, 'stock_name', stock_obj.stock_name)
        // 股票 code
        this.$delete(this.dynamicValidateForm, 'stock_code')
        this.$set(this.dynamicValidateForm, 'stock_code', stock_obj.stock_code)
        // 备注
        this.$delete(this.dynamicValidateForm, 'remarks')
        this.$set(this.dynamicValidateForm, 'remarks', stock_obj.remarks)
        // 业务id
        this.$delete(this.dynamicValidateForm, 'business_id')
        this.$set(this.dynamicValidateForm, 'business_id', stock_obj.business_id)
        // 交易列表
        this.saveStockTransaction = transaction_obj_list
        this.detailsListLoading = false
      }).catch(() => {
        this.detailsListLoading = false
      })
    },

    // 点击查看详情
    handleDetails(business_id) {
      this.dialogStatus = 'detail'
      this.viewDetail = true
      const params = {
        'stock_id': business_id
      }
      this.listLoading = true

      getStockTransactionById(params).then((response) => {
        this.currentTransactionList = response.data.data
        this.detailsListLoading = false
        this.listLoading = false
      }).catch(() => {
        this.detailsListLoading = false
        this.listLoading = false
      })
    },

    // 点击删除股票卡片
    handleDelete(obj, index) {
      const business_id = obj.business_id
      const stock_name = obj.stock_name

      this.$confirm('是否确认删除该股票及其交易信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          'stock_id': business_id
        }
        this.listLoading = true
        // 根据 business_id 删除该条股票数据
        delStock(params).then((response) => {
          this.$notify({
            title: '删除股票：' + stock_name,
            message: response.msg,
            type: 'success',
            duration: 2000
          })
          this.temp.splice(index, 1)
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消！'
        })
      })
    },

    // 内嵌产品的删除产品
    handleDeleteProduct(index) {
      this.$confirm('是否确认删除此条产品数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 根据index删除此条数据
        this.saveStockTransaction.splice(index, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消！'
        })
      })
    },

    // 添加交易到该股票的交易信息列表
    addStockTransaction() {
      this.dynamicValidateForm.stock_transaction_list = []
      // 调用计算 总计金额 和 总计数量 的函数
      // this.calPiecePrice()
      // 将临时保存的订单产品列表放入 domains 里面
      this.dynamicStockListForm.stock_id = this.dynamicValidateForm.business_id
      this.saveStockTransaction.push(this.dynamicStockListForm)
      this.innerVisible = false
    },

    // 添加此股票的交易
    addData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dynamicValidateForm.stock_transaction_list = this.saveStockTransaction

          this.listLoading = true
          // 发送到后台，添加该股票及其交易信息
          addStockList(this.dynamicValidateForm).then((response) => {
            this.$notify({
              title: '新增股票交易列表',
              message: response.msg,
              type: 'success',
              duration: 2000
            })
            this.temp = []
            this.dynamicValidateForm = {}
            this.getData()
            this.listLoading = false

            // 关闭弹出框
            this.dialogFormVisible = false
          }).catch(() => {
            this.listLoading = false
          })
        }
      })
    },

    // 更新股票数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.dynamicValidateForm.stock_transaction_list = this.saveStockTransaction

          // 更新股票及其交易信息
          updateStockList(this.dynamicValidateForm).then((response) => {
            this.$notify({
              title: '更新股票及其交易信息',
              message: response.msg,
              type: 'success',
              duration: 2000
            })
            this.temp = []
            this.dynamicValidateForm = {}
            this.getData()
            this.listLoading = false

            // 关闭弹出框
            this.dialogFormVisible = false
          }).catch(() => {
            this.listLoading = false
          })
        }
      })
    },

    // 获取股票交易列表卡片
    getData() {
      this.cardListLoading = true
      getStockList(this.listQuery).then((response) => {
        this.temp = response.data.data
        this.total = response.data.count
        this.cardListLoading = false
      }).catch(() => {
        this.cardListLoading = false
      })
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }

  /* 移动端的适配 */
  @media screen and (max-width: 500px) {
    .el-dialog {
      width: 90% !important;
    }

    .el-form-item__content {
      margin: 0 !important;
    }
  }
</style>
