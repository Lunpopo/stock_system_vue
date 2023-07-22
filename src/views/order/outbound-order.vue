<!--
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-06-28 11:54:34
 * @FilePath: /vue-element-admin/src/views/tab/order.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container">
    <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加出库单</el-button>
    <!-- 选择经销商进行过滤展示 -->
    <el-select v-model.trim="listQuery.dealer_name" placeholder="请选择经销商" clearable class="filter-item" style="width: 130px; margin-left: 10px;" @change="selectDealerFilter">
      <el-option v-for="item in dealerListOptions" :key="item.id" :label="item.dealer_name" :value="item.dealer_name" />
    </el-select>

    <!-- 展示出库信息卡片 -->
    <el-row v-loading="cardListLoading">
      <el-col v-for="(domain, index) in temp" :key="domain.id" :xs="22" :sm="22" :lg="10" :offset="1" style="margin-top: 20px">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <!-- 本次出库的标题 -->
            <span style="font-size: 17px; font-weight: 800;"><i class="el-icon-document" />出库抬头：{{ domain.title }}</span>
            <el-button type="text" class="button" @click="handleDetails(domain.business_id, index)">查看详情<i class="el-icon-view el-icon--right" /></el-button>
            <el-button type="text" class="button" style="margin-right: 15px;" @click="handleUpdate(domain, index)">编辑<i class="el-icon-edit el-icon--right" /></el-button>

            <el-divider />
            <div class="bottom clearfix">本次订单出库时间：{{ domain.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
            <div class="bottom clearfix">本次订单更新时间：{{ domain.update_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
            <div class="bottom clearfix">归属经销商：<el-tag size="small">{{ domain.belong_to }}</el-tag></div>
            <div class="bottom clearfix">本次出库的产品种类：<el-tag size="small" type="success">{{ domain.type }}</el-tag></div>
            <div class="bottom clearfix">本次出库总数量（瓶）：{{ domain.total_piece }}</div>
            <div class="bottom clearfix">本次出库总金额（元）：{{ domain.total_price }}</div>

            <el-tooltip :disabled="domain.remarks == null || domain.remarks.length <= 18" class="item" style="margin-top: 8px;" effect="dark" :content="domain.remarks" placement="top-start">
              <div ref="remarksRef" class="designer-inner-info_width">备注：{{ domain.remarks }}</div>
            </el-tooltip>

            <el-button size="small" class="filter-item bottom" type="danger" icon="el-icon-delete" @click="handleDelete(domain, index)">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 查看详情页面弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" width="80%" :visible.sync="viewDetail">
      <el-descriptions title="客户信息">
        <el-descriptions-item label="电话">
          <el-tag v-if="outbound_phone !== null" size="small">{{ outbound_phone }}</el-tag>
          <el-button v-if="outbound_phone !== null" size="mini" style="margin-left: 5px;" type="primary" round icon="el-icon-document" @click.stop="_copy(outbound_phone)">复制</el-button>
        </el-descriptions-item>

        <el-descriptions-item label="地址">
          <span>{{ outbound_address }}</span>
          <el-button size="mini" type="primary" style="margin-left: 5px;" round icon="el-icon-document" @click.stop="_copy(outbound_address)">复制</el-button>
        </el-descriptions-item>

        <el-descriptions-item label="物流公司">{{ outbound_logistics_company }}</el-descriptions-item>

        <el-descriptions-item label="物流单号">
          <el-tag v-if="outbound_logistics_num !== null" type="warning" size="small">
            {{ outbound_logistics_num }}
          </el-tag>
          <el-button size="mini" type="primary" style="margin-left: 5px;" round icon="el-icon-document" @click.stop="_copy(outbound_logistics_num)">复制</el-button>
        </el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" style="margin-bottom: 15px;" @click="exportOutboundOrder(currentProduct, temp)">
        导出本次出库单
      </el-button>
      <el-table
        v-loading="detailsListLoading"
        :data="currentProduct"
        border
        style="width: 100%"
      >
        <el-table-column label="产品名称" prod="product_name" min-width="150px">
          <template slot-scope="{row}">
            <span>{{ row.product_name }}</span>
            <el-tag>{{ row.scent_type }}</el-tag>
            <el-tag type="success">{{ row.specifications }} ML</el-tag>
            <el-tag type="warning">{{ row.belong_to }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="数量（瓶）" prod="quantity">
          <template slot-scope="{row}">
            <span>{{ row.quantity }} </span>
          </template>
        </el-table-column>

        <el-table-column label="每件规格（瓶）" prod="specification_of_piece">
          <template slot-scope="{row}">
            <span>{{ row.specification_of_piece }} </span>
          </template>
        </el-table-column>

        <el-table-column label="单价（元/瓶）" prod="unit_price">
          <template slot-scope="{row}">
            <span>{{ row.unit_price }} </span>
          </template>
        </el-table-column>

        <el-table-column label="小计（元）" prod="subtotal_price">
          <template slot-scope="{row}">
            <span>{{ row.subtotal_price }} </span>
          </template>
        </el-table-column>

        <el-table-column label="缩略图" prop="thumb_img" width="110px" align="center">
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

        <el-table-column label="备注" prop="remarks" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.remarks }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 页面控制 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />

    <!-- 添加 按钮弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" width="60%" :visible.sync="dialogFormVisible" @close="cancelAddOrder">
      <el-form ref="dataForm" :rules="rules" :model="dynamicValidateForm" label-width="100px">
        <el-form-item label-width="120px" prop="title" label="出库单标题（抬头）：">
          <el-input v-model.trim="dynamicValidateForm.title" suffix-icon="el-icon-edit" placeholder="请输入出库单抬头" />
        </el-form-item>

        <el-form-item v-if="dialogStatus == 'update'" label-width="120px" prop="create_time" label="出库时间：">
          <el-date-picker v-model.trim="dynamicValidateForm.create_time" type="datetime" value-format="timestamp" placeholder="选择日期时间" />
        </el-form-item>

        <el-form-item label-width="120px" prop="belong_to" label="属于哪里的经销商：">
          <el-select v-model.trim="dynamicValidateForm.belong_to" placeholder="请选择经销商" clearable class="filter-item" @change="selectDealer">
            <el-option v-for="item in dealerListOptions" :key="item.id" :label="item.dealer_name" :value="item.dealer_name" />
          </el-select>
        </el-form-item>

        <el-form-item label-width="120px" label="出库产品列表：" prop="product_list">
          <el-table
            :data="saveOutboundProduct"
            border
            style="width: 100%"
          >
            <el-table-column label="产品名称" prod="product_name" min-width="150px">
              <template slot-scope="{row}">
                <span>{{ row.product_name }}</span>
                <el-tag>{{ row.scent_type }}</el-tag>
                <el-tag type="success">{{ row.specifications }} ML</el-tag>
                <!-- <el-tag type="warning">{{ row.belong_to }}</el-tag> -->
              </template>
            </el-table-column>

            <el-table-column label="每件规格" prod="specification_of_piece">
              <template slot-scope="{row}">
                <span>{{ row.specification_of_piece }} </span>
              </template>
            </el-table-column>

            <el-table-column label="出厂价" prod="unit_price">
              <template slot-scope="{row}">
                <span>{{ row.unit_price }} </span>
              </template>
            </el-table-column>

            <el-table-column label="小计" prod="subtotal_price">
              <template slot-scope="{row}">
                <span>{{ row.subtotal_price }} </span>
              </template>
            </el-table-column>

            <el-table-column label="数量（瓶）" prod="quantity">
              <template slot-scope="{row, $index}">
                <el-input v-model.trim="row.quantity" :value="row.quantity" placeholder="输入数量（瓶）" @change="calTotalChangePrice(row, $index)" />
              </template>
            </el-table-column>

            <el-table-column label="缩略图" sortable prop="thumb_img" width="110px" align="center">
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

            <el-table-column label="备注" prop="remarks" width="110px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.product_remarks }}</span>
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
          <el-button type="primary" @click="addOutboundProduct">点击添加出库产品</el-button>
        </el-form-item>

        <el-form-item label-width="120px" label="合计（元）：" prop="total_price">
          <el-input-number v-model.trim="dynamicValidateForm.total_price" disabled :controls="true" :precision="2" />
        </el-form-item>

        <el-form-item label-width="120px" label="合计（瓶）：" prop="total_piece">
          <el-input-number v-model.trim="dynamicValidateForm.total_piece" disabled :controls="true" />
        </el-form-item>

        <el-form-item label-width="120px" label="电话：" prop="phone">
          <el-input v-model.trim="dynamicValidateForm.phone" suffix-icon="el-icon-mobile-phone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label-width="120px" label="地址：" prop="address">
          <el-input v-model.trim="dynamicValidateForm.address" suffix-icon="el-icon-office-building" placeholder="请输入送货地址" />
        </el-form-item>

        <el-form-item label-width="120px" label="物流公司：" prop="logistics_company">
          <el-input v-model.trim="dynamicValidateForm.logistics_company" suffix-icon="el-icon-truck" placeholder="请输入物流公司" />
        </el-form-item>

        <el-form-item label-width="120px" label="物流单号：" prop="logistics_num">
          <el-input v-model.trim="dynamicValidateForm.logistics_num" suffix-icon="el-icon-truck" placeholder="请输入物流单号" />
        </el-form-item>

        <el-form-item label-width="120px" label="备注" prop="remarks">
          <el-input v-model.trim="dynamicValidateForm.remarks" :autosize="{ minRows: 2, maxRows: 2}" type="textarea" placeholder="输入该次出库的备注信息" />
        </el-form-item>
      </el-form>

      <!-- 内嵌产品搜索 dialog -->
      <el-dialog
        width="70%"
        title="添加需要出库的产品"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-input v-model.trim="productListQuery.title" prefix-icon="el-icon-search" placeholder="请输入产品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>

        <el-divider />
        <el-table
          v-loading="embeddedListLoading"
          :data="productList"
          border
          style="width: 100%"
        >
          <el-table-column label="产品名称" prod="product_name" min-width="150px">
            <template slot-scope="{row}">
              <span>{{ row.product_name }}</span>
              <el-tag>{{ row.scent_type }}</el-tag>
              <el-tag type="success">{{ row.specifications }} ML</el-tag>
              <el-tag type="warning">{{ row.belong_to }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="每件规格（瓶）" prod="specification_of_piece">
            <template slot-scope="{row}">
              <span>{{ row.specification_of_piece }} </span>
            </template>
          </el-table-column>

          <el-table-column label="单价（元/瓶）" prod="unit_price">
            <template slot-scope="{row}">
              <span>{{ row.unit_price }} </span>
            </template>
          </el-table-column>

          <el-table-column label="缩略图" sortable prop="thumb_img" width="110px" align="center">
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

          <el-table-column label="备注" prop="remarks" width="110px" align="center">
            <template slot-scope="{row}">
              <el-input v-model.trim="row.product_remarks" :value="row.product_remarks" placeholder="输入备注信息" />
            </template>
          </el-table-column>

          <el-table-column label="小计（元）" prod="subtotal_price">
            <template slot-scope="{row}">
              <span>{{ row.subtotal_price }} </span>
            </template>
          </el-table-column>

          <el-table-column label="数量（瓶）" min-width="210px" prod="quantity">
            <template slot-scope="{row, $index}">
              <el-input-number v-model.trim="row.quantity" :value="row.quantity" :controls="true" controls-position="right" size="medium" placeholder="请输入产品数量" @change="calProductPrice(row, $index)" />
            </template>
          </el-table-column>
        </el-table>

        <!-- 内嵌的页面控制 -->
        <pagination v-show="productTotal>0" :total="productTotal" :page.sync="productListQuery.page" :limit.sync="productListQuery.limit" @pagination="handleFilter" />

        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="addProduct">
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
import { addOutboundOrder, updateOutboundOrder, getOutboundOrder, getOutboundProductDetails, delOutboundOrder } from '@/api/outbound_order'
import { getDealerList, searchDealerProduct } from '@/api/dealer_product'
import { parseTime } from '@/utils'
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
      // 内嵌产品搜索加载框
      embeddedListLoading: true,
      // 加载详情的圈圈
      detailsListLoading: true,
      // 卡片的加载圈圈
      cardListLoading: true,
      // 点击查看详情展示的电话
      outbound_phone: 0,
      outbound_address: 0,
      outbound_logistics_company: 0,
      outbound_logistics_num: 0,

      // 当前点击查看详情的 出库订单的 索引
      outbound_order_index: 0,
      // 保存远程拉取的经销商名单数据
      dealerListOptions: [],

      // 动态表单的提交内容
      dynamicValidateForm: {
        title: '',
        domains: [{
          product_name: ''
        }],
        total_piece: 0,
        total_price: 0,
        logistics_company: '自发货',
        logistics_num: '自发货'
      },

      // 临时保存出库订单的产品
      saveOutboundProduct: [],
      // 外面的出库订单总量
      total: 0,
      // 内嵌产品列表的总量
      productTotal: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      // 内嵌页面的产品列表分页参数
      productListQuery: {
        page: 1,
        limit: 10
      },
      // 存放所有的产品信息
      productList: [],
      // 详情页的当前出库产品列表
      currentProduct: [],
      statusOptions: ['老白干香型', '浓香型', '清香型', '酱香型', '其他香型'],
      // 是否展示隐藏列
      showReviewer: false,
      temp: [],
      // 是否展示添加出库单弹出框
      dialogFormVisible: false,
      // 是否打开内嵌的搜索产品 dialog
      innerVisible: false,
      // 是否展示详情弹出框
      viewDetail: false,
      // 弹出层的状态，例如是 create 或者是 update
      dialogStatus: '',
      textMap: {
        detail: '本次出库详情信息',
        update: '更新本次出库信息',
        create: '添加本次出库单产品'
      },
      // 表单验证规则
      rules: {
        title: [{ required: true, message: '请输入出库单标题', trigger: 'change' }],
        product_name: [{ required: true, message: '请输入产品名', trigger: 'change' }],
        belong_to: [{ required: true, message: '请输入属于哪里的经销商价格', trigger: 'change' }],
        specifications: [{ required: true, msg: '请输入产品规格（ML）', validator: limitNumber, trigger: 'blur' }],
        // trigger 还一个属性是 blur，失去焦点再验证
        scent_type: [{ required: true, msg: '请选择产品的香型', trigger: 'change' }],
        specification_of_piece: [{ required: true, msg: '请输入产品的每件规格（瓶）', validator: limitNumber, trigger: 'blur' }],
        unit_price: [{ required: true, msg: '请输入出厂价（元/瓶）', validator: limitNumber, trigger: 'blur' }],
        price_of_piece: [{ required: true, msg: '请输入每件价格（元）', validator: limitNumber, trigger: 'blur' }],
        suggested_retail_price: [{ required: true, msg: '请输入建议零售价（元/瓶）', validator: limitNumber, trigger: 'blur' }],
        scanning_price: [{ required: true, msg: '请输入扫码价（元/瓶）', validator: limitNumber, trigger: 'blur' }],
        address: [{ required: true, message: '请输入发货地址', trigger: 'change' }],
        phone: [{ required: false },
          { type: 'number',
            message: '手机号码格式不正确',
            trigger: 'change',
            transform(value) {
              var phonereg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
              if (value !== undefined && value !== null && value !== ' ' && !phonereg.test(value)) {
                return false
              } else if (value === undefined || value === null || value === ' ') {
                return value
              } else {
                return Number(value)
              }
            }
          }]
      },
      downloadLoading: false
    }
  },

  created() {
    // 初始化页面的数据
    this.getData()
    // 获取下拉框经销商名单
    this.getDealerSelection()
  },

  methods: {
    // 获取当前日期的函数：2023-2-14
    getTime() {
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      return yy + '-' + mm + '-' + dd
    },

    // 复制操作
    _copy(context) {
      // 创建输入框元素
      const oInput = document.createElement('input')
      // 将想要复制的值
      oInput.value = context
      // 页面底部追加输入框
      document.body.appendChild(oInput)
      // 选中输入框
      oInput.select()
      // 执行浏览器复制命令
      document.execCommand('Copy')
      // 弹出复制成功信息
      this.$message.success('复制成功！')
      // 复制后移除输入框
      oInput.remove()
    },

    // 导出出库单Excel
    exportOutboundOrder(product_list, outbound_order_list) {
      this.downloadLoading = true
      // 添加一个确认框
      this.$confirm('是否确认将本次出库单导出为Excel表格？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '产品名称', '产品香型', '规格型号（ML）', '数量（瓶）', '单价（元）', '金额（元）', '备注']
          const filterVal = ['id', 'product_name', 'scent_type', 'specifications', 'quantity', 'unit_price', 'subtotal_price', 'remarks']
          const data = this.formatJson(filterVal, product_list)
          // 合并单元格
          const mergeCol = ['A1:H1', 'B3:C3', 'B4:C4', 'B5:C5', 'F3:H3', 'F4:H4', 'F5:H5']
          // 数据的总长度（加上一些自己手动添加的行）
          const dataLength = data.length + 7
          // 添加总金额的合并单元格
          mergeCol.push('C' + (dataLength - 3) + ':F' + (dataLength - 3))
          // 添加合计的合并单元格
          mergeCol.push('A' + (dataLength - 3) + ':B' + (dataLength - 2))
          // 添加人民币的合并单元格
          mergeCol.push('C' + (dataLength - 2) + ':D' + (dataLength - 2))
          // 添加大写的合并单元格
          mergeCol.push('F' + (dataLength - 2) + ':H' + (dataLength - 2))

          // 导出 excel
          excel.export_json_to_excel({
            // 多级表头
            multiHeader: [
              ['长沙星亿达酒业销售有限公司销售出库单', '', '', '', '', '', '', ''],
              ['', '', '', '', '', '', '', ''],
              ['客户名称：', outbound_order_list[this.outbound_order_index].belong_to, '', '', '发货日期：', parseTime(outbound_order_list[this.outbound_order_index].create_time, '{y}-{m}-{d}'), '', ''],
              ['电话：', outbound_order_list[this.outbound_order_index].phone, '', '', '地址：', outbound_order_list[this.outbound_order_index].address, '', ''],
              ['物流公司：', outbound_order_list[this.outbound_order_index].logistics_company, '', '', '物流单号：', outbound_order_list[this.outbound_order_index].logistics_num, '', ''],
              ['', '', '', '', '', '', '', '']
            ],
            header: tHeader,
            autoWidth: false,
            data,
            bookType: 'xlsx',
            filename: outbound_order_list[this.outbound_order_index].title,
            merges: mergeCol
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消！'
        })
      })
      // 关闭加载
      this.downloadLoading = false
    },
    // 格式转换
    formatJson(filterVal, jsonData) {
      const returnData = []
      jsonData.map(v => {
        const formatDataList = []
        // v是对象，filterVal是 key 的列表
        for (let j = 0; j < filterVal.length; j++) {
          if (filterVal[j] === 'update_time') {
            formatDataList.push(parseTime(v['update_time']))
          } else if (filterVal[j] === 'id') {
            continue
          } else {
            formatDataList.push(v[filterVal[j]])
          }
        }
        returnData.push(formatDataList)
      })

      // 将序号加上去
      const newList = []
      returnData.map((element, index) => {
        element.unshift(index + 1)
        newList.push(element)
      })

      // 最后两行加上金额合计
      newList.push(['合计：', null, '总  金  额（元）', null, null, null, this.temp[this.outbound_order_index].total_price, null])
      newList.push([null, null, '人民币', null, '（大写）', this.digitUppercase(this.temp[this.outbound_order_index].total_price), null, null])
      newList.push([null, null, null, null, null, null, null, null])
      newList.push(['制单：', '谭丽容', '业务员：', '谭丽容', '审核：', '谢月星', '财务审核：', '谢月星'])
      return newList
    },

    // 添加出库单数据
    addData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          const deleteZeroProduct = []
          this.saveOutboundProduct.forEach(element => {
            if (element.quantity !== 0) {
              deleteZeroProduct.push(element)
            }
          })
          this.dynamicValidateForm.domains = deleteZeroProduct

          // 发送到后台，添加该次出库单
          addOutboundOrder(this.dynamicValidateForm).then((response) => {
            this.$notify({
              title: '新增出库单',
              message: '新增成功！',
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

    // 更新出库数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          const deleteZeroProduct = []
          this.saveOutboundProduct.forEach(element => {
            if (element.quantity !== 0) {
              deleteZeroProduct.push(element)
            }
          })
          this.dynamicValidateForm.domains = deleteZeroProduct

          // 发送到后台，添加该次出库单
          updateOutboundOrder(this.dynamicValidateForm).then((response) => {
            this.$notify({
              title: '更新出库单',
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

    // 添加产品到本次出库订单的产品列表
    addProduct() {
      this.dynamicValidateForm.domains = []
      // 如果已存在一模一样的，就直接覆盖
      this.productList.forEach(element => {
        let is_same = false

        this.saveOutboundProduct.forEach((element1, index) => {
          if (element1.product_name === element.product_name && element1.scent_type === element.scent_type && element1.specifications === element.specifications) {
            // 一样的就将数量进行覆盖
            this.saveOutboundProduct[index].quantity = element.quantity
            // 数量覆盖之后，行内价格也要进行覆盖
            const subtotal_price = element.unit_price * element.quantity
            this.saveOutboundProduct[index].subtotal_price = subtotal_price

            is_same = true
            return false // 跳出此次循环
          }
        })
        if (is_same === false) {
          this.saveOutboundProduct.push(element)
        }
      })

      // 删除数量为0的产品列表
      const remove_zero_outbound_product = this.saveOutboundProduct.filter(item => item.quantity !== 0 && item.quantity !== undefined)
      this.saveOutboundProduct = remove_zero_outbound_product

      // 调用计算 总计金额 和 总计数量 的函数
      this.calPiecePrice()
      // 将临时保存的订单产品列表放入 domains 里面
      this.dynamicValidateForm.domains = this.saveOutboundProduct
      this.innerVisible = false
    },

    // 点击添加出库产品
    addOutboundProduct() {
      this.innerVisible = true
      this.embeddedListLoading = true

      // 获取所有的经销商产品
      searchDealerProduct(this.productListQuery).then(response => {
        // 用临时变量暂时保存检索的产品
        const temp_productList = response.data.data
        // 将临时保存的产品的数量弄到搜索框里面去
        this.saveOutboundProduct.forEach(element1 => {
          temp_productList.forEach((element2, index) => {
            if (element1.product_name === element2.product_name && element1.scent_type === element2.scent_type && element1.specifications === element2.specifications) {
              temp_productList[index].quantity = element1.quantity
              if (temp_productList[index].quantity !== undefined) {
                let subtotal_price = 0
                subtotal_price = temp_productList[index].unit_price * temp_productList[index].quantity
                if (subtotal_price >= 0) {
                  temp_productList[index].subtotal_price = parseFloat(subtotal_price).toFixed(2)
                } else {
                  temp_productList[index].subtotal_price = undefined
                }
              } else {
                temp_productList[index].subtotal_price = undefined
              }
            }
          })
        })
        // 覆盖临时变量
        this.productList = temp_productList
        this.productTotal = response.data.count
        this.embeddedListLoading = false
      }).catch(() => {
        this.embeddedListLoading = false
      })
    },

    // 获取经销商的下拉框数据
    getDealerSelection() {
      getDealerList().then((response) => {
        // 将获取的远程经销商数据存入 this.dealerListOptions
        this.dealerListOptions = response.data.data
      })
    },

    // 下拉选择经销商 触发事件
    selectDealer(value) {
      this.productListQuery.dealer_name = value
    },

    // 选择经销商进行过滤
    selectDealerFilter(value) {
      this.listQuery.dealer_name = value

      // 进行经销商过滤
      this.getData()
    },

    // 取消添加订单
    cancelAddOrder() {
      this.dialogFormVisible = false
      // 清空临时保存的订单产品列表
      this.saveOutboundProduct = []

      // 清空表单
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      // 初始化
      this.dynamicValidateForm = {
        title: this.getTime() + '日出库',
        domains: [{
          product_name: ''
        }],
        total_piece: 0,
        total_price: 0,
        logistics_company: '自发货',
        logistics_num: '自发货'
      }
    },

    // 搜索功能
    handleFilter() {
      // 获取所有的产品
      this.embeddedListLoading = true
      searchDealerProduct(this.productListQuery).then(response => {
        this.productList = response.data.data
        this.productTotal = response.data.count
        this.embeddedListLoading = false
      }).catch(() => {
        this.embeddedListLoading = false
      })
    },

    // 更改数量之后立马更新 行内的 小计金额 和 外面的总计金额 和 总瓶数
    calTotalChangePrice(row, index) {
      if (row.quantity !== undefined) {
        let subtotal_price = 0
        // subtotal_price = row.specification_of_piece * row.unit_price * row.quantity
        subtotal_price = row.unit_price * row.quantity
        if (subtotal_price >= 0) {
          // 页面更新数据，得先删除这个属性，再进行赋值
          this.$delete(this.saveOutboundProduct[index], 'subtotal_price')
          this.$set(this.saveOutboundProduct[index], 'subtotal_price', parseFloat(subtotal_price).toFixed(2))
        } else {
          // 页面更新数据，得先删除这个属性，再进行赋值
          this.$delete(this.saveOutboundProduct[index], 'subtotal_price')
          this.$set(this.saveOutboundProduct[index], 'subtotal_price', undefined)
        }
      }
      this.calPiecePrice()
    },

    // 计算总计的价格
    calPiecePrice() {
      let total_price = 0.0 // 总金额
      let total_piece = 0 // 总数量
      this.saveOutboundProduct.forEach(element => {
        total_price = total_price + Number(element.subtotal_price)
        total_piece = total_piece + Number(element.quantity)
      })
      this.dynamicValidateForm.total_price = total_price
      this.dynamicValidateForm.total_piece = total_piece
    },

    // 计算内嵌dialog内的产品的小计（元）
    calProductPrice(row, index) {
      if (row.quantity !== undefined) {
        let subtotal_price = 0
        subtotal_price = row.unit_price * row.quantity
        if (subtotal_price >= 0) {
          // 页面更新数据，得先删除这个属性，再进行赋值
          this.$delete(this.productList[index], 'subtotal_price')
          this.$set(this.productList[index], 'subtotal_price', parseFloat(subtotal_price).toFixed(2))
        } else {
          this.$delete(this.productList[index], 'subtotal_price')
          this.$set(this.productList[index], 'subtotal_price', undefined)
        }
      } else {
        this.$delete(this.productList[index], 'subtotal_price')
        this.$set(this.productList[index], 'subtotal_price', undefined)
      }
    },

    // 点击 添加按钮 添加出库单
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      // 页面更新数据，得先删除这个属性，再进行赋值
      this.$delete(this.dynamicValidateForm, 'title')
      this.$set(this.dynamicValidateForm, 'title', this.getTime() + '日出库')
      // 删除搜索的经销商名
      this.$delete(this.productListQuery, 'dealer_name')
    },

    // 更新出库单卡片数据
    handleUpdate(domain, index) {
      this.detailsListLoading = true
      // this.temp = Object.assign({}, domain) // copy obj
      const params = {
        'outbound_order_id': domain.business_id
      }
      getOutboundProductDetails(params).then((response) => {
        this.saveOutboundProduct = response.data.data
        // 更新价格
        this.calPiecePrice()
        this.detailsListLoading = false
      }).catch(() => {
        this.detailsListLoading = false
      })

      // 标题
      // 页面更新数据，得先删除这个属性，再进行赋值
      this.$delete(this.dynamicValidateForm, 'title')
      this.$set(this.dynamicValidateForm, 'title', this.temp[index].title)
      // 属于哪个经销商
      this.$delete(this.dynamicValidateForm, 'belong_to')
      this.$set(this.dynamicValidateForm, 'belong_to', this.temp[index].belong_to)
      // 将内嵌的搜索框也要加进去
      this.$delete(this.productListQuery, 'dealer_name')
      this.$set(this.productListQuery, 'dealer_name', this.temp[index].belong_to)

      // 手机
      this.$delete(this.dynamicValidateForm, 'phone')
      this.$set(this.dynamicValidateForm, 'phone', this.temp[index].phone)
      // 地址
      this.$delete(this.dynamicValidateForm, 'address')
      this.$set(this.dynamicValidateForm, 'address', this.temp[index].address)
      // 物流公司
      this.$delete(this.dynamicValidateForm, 'logistics_company')
      this.$set(this.dynamicValidateForm, 'logistics_company', this.temp[index].logistics_company)
      // 物流信息
      this.$delete(this.dynamicValidateForm, 'logistics_num')
      this.$set(this.dynamicValidateForm, 'logistics_num', this.temp[index].logistics_num)
      // 备注
      this.$delete(this.dynamicValidateForm, 'remarks')
      this.$set(this.dynamicValidateForm, 'remarks', this.temp[index].remarks)
      // 订单id
      this.$delete(this.dynamicValidateForm, 'business_id')
      this.$set(this.dynamicValidateForm, 'business_id', this.temp[index].business_id)

      // 订单的创建时间
      this.$delete(this.dynamicValidateForm, 'create_time')
      this.$set(this.dynamicValidateForm, 'create_time', parseInt(this.temp[index].create_time) * 1000)

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 点击查看详情
    handleDetails(business_id, index) {
      this.detailsListLoading = true

      this.dialogStatus = 'detail'
      this.viewDetail = true
      this.outbound_order_index = index
      this.outbound_phone = this.temp[index].phone
      this.outbound_address = this.temp[index].address
      this.outbound_logistics_company = this.temp[index].logistics_company
      this.outbound_logistics_num = this.temp[index].logistics_num

      const params = {
        'outbound_order_id': business_id
      }
      getOutboundProductDetails(params).then((response) => {
        this.currentProduct = response.data.data
        this.detailsListLoading = false
      }).catch(() => {
        this.detailsListLoading = false
      })
    },

    // 内嵌产品表格点击要删除此产品
    handleDeleteProduct(index) {
      this.$confirm('是否确认删除此条产品数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 根据index删除此条数据
        this.saveOutboundProduct.splice(index, 1)
        this.calPiecePrice()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消！'
        })
      })
    },

    // 点击删除卡片按钮
    handleDelete(obj, index) {
      const business_id = obj.business_id
      const title = obj.title

      this.$confirm('是否确认删除此次出库数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const params = {
          'outbound_order_id': business_id
        }
        // 根据 business_id 删除此条出库数据
        delOutboundOrder(params).then((response) => {
          this.$notify({
            title: '删除出库单：' + title,
            message: '删除成功！',
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

    // 获取出库单数据
    getData() {
      this.cardListLoading = true
      // 发送到后台，添加该次出库单
      getOutboundOrder(this.listQuery).then((response) => {
        this.temp = response.data.data
        this.total = response.data.count
        this.cardListLoading = false
      }).catch(() => {
        this.cardListLoading = false
      })
    },

    // 金额数字转大写
    digitUppercase(price) {
      const fraction = ['角', '分']
      const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      const unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
      ]
      let num = Math.abs(price)
      let s = ''
      fraction.forEach((item, index) => {
        s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '')
      })
      s = s || '整'
      num = Math.floor(num)
      for (let i = 0; i < unit[0].length && num > 0; i += 1) {
        let p = ''
        for (let j = 0; j < unit[1].length && num > 0; j += 1) {
          p = digit[num % 10] + unit[1][j] + p
          num = Math.floor(num / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
      }

      return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
    }
  }
}
</script>

<style>
  /* 超出的内容文字隐藏（变成...） */
  .designer-inner-info_width{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .bottom {
    margin-top: 8px;
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
    /* 手机端的form表单适配 */
    .el-dialog {
      width: 90% !important;
    }
    .el-form-item__content {
      margin: 0 !important;
    }

    /* .el-descriptions的适配 */
    .el-descriptions-item {
      float: left !important;
    }
  }
</style>
