<!--
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-06-28 11:57:30
 * @FilePath: /vue-element-admin/src/views/tab/order.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container">
    <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加入库单</el-button>

    <el-row v-loading="cardListLoading">
      <el-col v-for="(domain, index) in temp" :key="domain.id" :xs="22" :sm="22" :lg="10" :offset="1" style="margin-top: 20px">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <!-- 本次入库的标题 -->
            <span style="font-size: 17px;font-weight: 800;"><i class="el-icon-document" />入库抬头：{{ domain.title }}</span>
            <el-button type="text" class="button" @click="handleDetails(domain.business_id)">查看详情<i class="el-icon-view el-icon--right" /></el-button>
            <el-button type="text" class="button" style="margin-right: 15px;" @click="handleUpdate(domain, index)">编辑<i class="el-icon-edit el-icon--right" /></el-button>
            <el-divider />
            <div class="bottom clearfix">本次订单入库时间：{{ domain.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
            <div class="bottom clearfix">本次订单更新时间：{{ domain.update_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
            <div class="bottom clearfix">本次入库产品种类：<el-tag size="small" type="success">{{ domain.type }}</el-tag></div>
            <div class="bottom clearfix">本次入库总数量（件）：{{ domain.total_piece }}</div>
            <div class="bottom clearfix">本次入库总金额（元）：{{ domain.total_price }}</div>
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
        :data="currentProduct"
        border
        style="width: 100%"
      >
        <el-table-column label="产品名称" prod="product_name" min-width="150px">
          <template slot-scope="{row}">
            <span>{{ row.product_name }} </span>
            <el-tag>{{ row.scent_type }}</el-tag>
            <el-tag type="success">{{ row.specifications }} ML</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="数量（件）" prod="quantity">
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
      <el-form ref="dataForm" :rules="rules" :model="dynamicValidateForm" label-width="120px" label-position="right">
        <el-form-item prop="title" label="入库单标题：">
          <el-input v-model.trim="dynamicValidateForm.title" />
        </el-form-item>

        <el-form-item v-if="dialogStatus == 'update'" label-width="120px" prop="create_time" label="入库时间：">
          <el-date-picker v-model.trim="dynamicValidateForm.create_time" type="datetime" value-format="timestamp" placeholder="选择日期时间" />
        </el-form-item>

        <el-form-item label="入库产品列表：" prop="product_list">
          <el-table
            v-loading="detailsListLoading"
            :data="savePurchaseProduct"
            border
            style="width: 100%"
          >
            <el-table-column label="产品名称" prod="product_name" min-width="200px">
              <template slot-scope="{row}">
                <span>{{ row.product_name }} </span>
                <el-tag>{{ row.scent_type }}</el-tag>
                <el-tag type="success">{{ row.specifications }} ML</el-tag>
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

            <el-table-column label="数量（件）" prod="quantity">
              <template slot-scope="{row, $index}">
                <el-input v-model.trim="row.quantity" :value="row.quantity" placeholder="输入数量（件）" @change="calTotalChangePrice(row, $index)" />
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

            <el-table-column label="备注" prop="remarks" align="center">
              <template slot-scope="{row}">
                <span>{{ row.remarks }}</span>
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
          <el-button type="primary" @click="addPurchaseProduct">点击添加入库产品</el-button>
        </el-form-item>

        <el-form-item label="合计（元）：" prop="total_price">
          <el-input-number v-model.trim="dynamicValidateForm.total_price" disabled :controls="true" :precision="2" />
        </el-form-item>

        <el-form-item label="合计（件）：" prop="total_piece">
          <el-input-number v-model.trim="dynamicValidateForm.total_piece" disabled :controls="true" />
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input v-model.trim="dynamicValidateForm.remarks" :autosize="{ minRows: 2, maxRows: 2}" type="textarea" placeholder="输入该次入库的备注信息" />
        </el-form-item>
      </el-form>

      <!-- 内嵌产品搜索 dialog -->
      <el-dialog
        width="70%"
        title="添加需要入库的产品"
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
              <el-input v-model.trim="row.remarks" :value="row.remarks" placeholder="输入备注信息" />
            </template>
          </el-table-column>

          <el-table-column label="小计（元）" prod="subtotal_price">
            <template slot-scope="{row}">
              <span>{{ row.subtotal_price }} </span>
            </template>
          </el-table-column>

          <el-table-column label="数量（件）" min-width="210px" prod="quantity">
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
import { addPurchaseOrder, updatePurchaseOrder, getPurchaseOrder, getPurchaseProductDetails, delPurchaseOrder } from '@/api/purchase_order'
import { searchProduct } from '@/api/product'
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
      // 内嵌搜索加载圈圈
      embeddedListLoading: true,
      cardListLoading: true,
      listLoading: true,
      // 动态表单的提交内容
      dynamicValidateForm: {
        title: this.getTime() + '日入库',
        domains: [{
          product_name: ''
        }],
        total_piece: 0,
        total_price: 0
      },
      // 临时保存入库订单的产品
      savePurchaseProduct: [],
      // 外面的入库订单总量
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
      // 详情页的当前入库产品列表
      currentProduct: [],
      statusOptions: ['老白干香型', '浓香型', '清香型', '酱香型', '其他香型'],
      // 是否展示隐藏列
      showReviewer: false,
      temp: {},
      // 是否展示添加入库单弹出框
      dialogFormVisible: false,
      // 是否打开内嵌的搜索产品 dialog
      innerVisible: false,
      // 是否展示详情弹出框
      viewDetail: false,
      // 弹出层的状态，例如是 create 或者是 update
      dialogStatus: '',
      textMap: {
        detail: '本次入库详情信息',
        update: '更新本次入库信息',
        create: '添加本次入库单产品'
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
    // 获取当前日期的函数：2023-2-14
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

    // 点击添加入库产品按钮
    addPurchaseProduct() {
      this.innerVisible = true
      this.embeddedListLoading = true

      // 获取所有产品
      searchProduct(this.productListQuery).then(response => {
        // 用临时变量暂时保存检索的产品
        const temp_productList = response.data.data
        // 将临时保存的产品的数量弄到搜索框里面去
        this.savePurchaseProduct.forEach(element1 => {
          temp_productList.forEach((element2, index) => {
            if (element1.product_name === element2.product_name && element1.scent_type === element2.scent_type && element1.specifications === element2.specifications) {
              temp_productList[index].quantity = element1.quantity
              if (temp_productList[index].quantity !== undefined) {
                let subtotal_price = 0
                subtotal_price = temp_productList[index].specification_of_piece * temp_productList[index].unit_price * temp_productList[index].quantity
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

    // 搜索功能
    handleFilter() {
      this.embeddedListLoading = true
      searchProduct(this.productListQuery).then(response => {
        this.productList = response.data.data
        this.productTotal = response.data.count
        this.embeddedListLoading = false
      }).catch(() => {
        this.embeddedListLoading = false
      })
    },

    // 更改数量之后立马更新 行内的 小计金额 和 外面的总计金额 和 总计件数
    calTotalChangePrice(row, index) {
      if (row.quantity !== undefined) {
        let subtotal_price = 0
        subtotal_price = row.specification_of_piece * row.unit_price * row.quantity
        if (subtotal_price >= 0) {
          // 页面更新数据，得先删除这个属性，再进行赋值
          this.$delete(this.savePurchaseProduct[index], 'subtotal_price')
          this.$set(this.savePurchaseProduct[index], 'subtotal_price', subtotal_price)
        } else {
          // 页面更新数据，得先删除这个属性，再进行赋值
          this.$delete(this.savePurchaseProduct[index], 'subtotal_price')
          this.$set(this.savePurchaseProduct[index], 'subtotal_price', undefined)
        }
      }
      this.calPiecePrice()
    },

    // 计算小计的价格（单价 x 每件多少瓶 x 多少件）
    calPiecePrice() {
      let total_price = 0.0 // 总金额
      let total_piece = 0 // 总数量
      this.savePurchaseProduct.forEach(element => {
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
        subtotal_price = row.specification_of_piece * row.unit_price * row.quantity
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

    // 点击 添加按钮 添加入库单
    handleCreate() {
      // 增加一个时间戳，用来前端更新弹出层用的
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.detailsListLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      // 页面更新数据，得先删除这个属性，再进行赋值
      this.$delete(this.dynamicValidateForm, 'title')
      this.$set(this.dynamicValidateForm, 'title', this.getTime() + '日入库')
    },

    // 更新入库单卡片数据
    handleUpdate(domain, index) {
      this.detailsListLoading = true
      const params = {
        'purchase_order_id': domain.business_id
      }
      getPurchaseProductDetails(params).then((response) => {
        this.savePurchaseProduct = response.data.data
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
      // 将内嵌的搜索框也要加进去
      this.$delete(this.productListQuery, 'dealer_name')
      this.$set(this.productListQuery, 'dealer_name', this.temp[index].belong_to)

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
    handleDetails(business_id) {
      this.dialogStatus = 'detail'
      this.viewDetail = true
      const params = {
        'purchase_order_id': business_id
      }
      this.listLoading = true
      getPurchaseProductDetails(params).then((response) => {
        this.currentProduct = response.data.data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 点击删除按钮
    handleDelete(obj, index) {
      const business_id = obj.business_id
      const title = obj.title

      this.$confirm('是否确认删除此次入库数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          'purchase_order_id': business_id
        }
        this.listLoading = true
        // 根据 business_id 删除此条入库数据
        delPurchaseOrder(params).then((response) => {
          this.$notify({
            title: '删除入库单：' + title,
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

    // 内嵌产品的删除产品
    handleDeleteProduct(index) {
      this.$confirm('是否确认删除此条产品数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 根据index删除此条数据
        this.savePurchaseProduct.splice(index, 1)

        // 调用计算 总计金额 和 总计数量 的函数
        this.calPiecePrice()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消！'
        })
      })
    },

    // 添加产品到本次入库订单的产品列表
    addProduct() {
      this.dynamicValidateForm.domains = []
      // 如果已存在一模一样的，就直接覆盖
      this.productList.forEach(element => {
        let is_same = false

        this.savePurchaseProduct.forEach((element1, index) => {
          if (element1.product_name === element.product_name && element1.scent_type === element.scent_type && element1.specifications === element.specifications) {
            // 一样的就将数量进行覆盖
            this.savePurchaseProduct[index].quantity = element.quantity
            // 数量覆盖之后，行内价格也要进行覆盖
            const subtotal_price = element.specification_of_piece * element.unit_price * element.quantity
            this.savePurchaseProduct[index].subtotal_price = subtotal_price

            is_same = true
            return false // 跳出此次循环
          }
        })
        if (is_same === false) {
          this.savePurchaseProduct.push(element)
        }
      })

      // 删除数量为0的产品列表
      const remove_zero_outbound_product = this.savePurchaseProduct.filter(item => item.quantity !== 0 && item.quantity !== undefined)
      this.savePurchaseProduct = remove_zero_outbound_product

      // 调用计算 总计金额 和 总计数量 的函数
      this.calPiecePrice()
      // 将临时保存的订单产品列表放入 domains 里面
      this.dynamicValidateForm.domains = this.savePurchaseProduct
      this.innerVisible = false
    },

    // 添加入库单数据
    addData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const deleteZeroProduct = []
          this.savePurchaseProduct.forEach(element => {
            if (element.quantity !== 0) {
              deleteZeroProduct.push(element)
            }
          })
          this.dynamicValidateForm.domains = deleteZeroProduct

          this.listLoading = true
          // 发送到后台，添加该次入库单
          addPurchaseOrder(this.dynamicValidateForm).then((response) => {
            this.$notify({
              title: '新增入库单',
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

    // 更新入库数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          const deleteZeroProduct = []
          this.savePurchaseProduct.forEach(element => {
            if (element.quantity !== 0) {
              deleteZeroProduct.push(element)
            }
          })
          this.dynamicValidateForm.domains = deleteZeroProduct

          // 发送到后台，添加该次出库单
          updatePurchaseOrder(this.dynamicValidateForm).then((response) => {
            this.$notify({
              title: '更新入库单',
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

    // 获取入库单数据
    getData() {
      this.cardListLoading = true
      // 发送到后台，添加该次入库单
      getPurchaseOrder(this.listQuery).then((response) => {
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
