<template>
  <div class="app-container">
    <!-- 过滤组件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.title" placeholder="请输入产品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出表格数据
      </el-button>
      <!-- <el-checkbox v-model.trim="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        显示隐藏列
      </el-checkbox> -->
    </div>

    <!-- 添加 和 多行删除 按钮 -->
    <el-button class="filter-item" type="danger" icon="el-icon-delete" :disabled="!(selectionList&&selectionList.length)" @click="batchDelete()">删除</el-button>
    <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    <!-- 选择经销商 -->
    <el-select v-model.trim="listQuery.dealer_name" placeholder="请选择经销商" clearable class="filter-item" style="width: 130px; margin-left: 10px;" @change="selectDealer">
      <el-option v-for="item in dealerListOptions" :key="item.id" :label="item.dealer_name" :value="item.dealer_name" />
    </el-select>

    <!-- 表格数据 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column label="产品名称" prop="product_name" sortable="custom" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="viewDetails(row)">{{ row.product_name }} </span>
          <el-tag>{{ row.scent_type }}</el-tag>
          <el-tag type="success">{{ row.specifications }} ML</el-tag>
          <el-tag type="warning">{{ row.belong_to }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="每件规格（瓶）" sortable="custom" prop="specification_of_piece" align="center">
        <template slot-scope="{row}">
          <span>{{ row.specification_of_piece }}</span>
        </template>
      </el-table-column>

      <el-table-column label="产品出厂价（元/瓶）" sortable="custom" prop="unit_price" class-name="status-col">
        <template slot-scope="{row}">
          <span>{{ row.unit_price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="每件价格（元）" sortable="custom" prop="price_of_piece" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price_of_piece }}</span>
        </template>
      </el-table-column>

      <el-table-column label="产品批发价（元/瓶）" sortable="custom" prop="wholesale_price" align="center">
        <template slot-scope="{row}">
          <span>{{ row.wholesale_price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="建议零售价（元/瓶）" sortable="custom" prop="suggested_retail_price" align="center">
        <template slot-scope="{row}">
          <span>{{ row.suggested_retail_price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="产品扫码价（元/瓶）" sortable="custom" prop="scanning_price" align="center">
        <template slot-scope="{row}">
          <span>{{ row.scanning_price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" prop="remarks" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remarks }}</span>
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

      <el-table-column v-if="showReviewer" label="创建时间" sortable="custom" prop="create_time" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showReviewer" label="更新时间" sortable="custom" prop="update_time" align="center">
        <template slot-scope="{row}">
          <span>{{ row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页面控制 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleFilter" />

    <!-- 编辑按钮弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="155px" label-position="left">
        <el-form-item label="属于哪里的经销商" prop="belong_to">
          <el-select v-model.trim="temp.belong_to" placeholder="请选择经销商" clearable class="filter-item" @change="selectProductDealer">
            <el-option v-for="item in dealerListOptions" :key="item.id" :label="item.dealer_name" :value="item.dealer_name" />
          </el-select>
        </el-form-item>

        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model.trim="temp.product_name" style="width: auto; float: left;" disabled placeholder="请选择基准产品" />
          <el-button v-if="dialogStatus==='create'" type="primary" style="float: left;" :disabled="temp.belong_to === undefined || temp.belong_to === ''" @click="select_product">点击选择产品</el-button>
        </el-form-item>

        <el-form-item label="产品规格（ML）" prop="specifications">
          <el-input v-model.trim="temp.specifications" style="width: auto;" disabled placeholder="产品规格（ML）" />
        </el-form-item>

        <el-form-item label="产品香型" prop="scent_type">
          <el-input v-model.trim="temp.scent_type" style="width: auto;" disabled placeholder="产品香型" />
        </el-form-item>

        <el-form-item label="每件规格（瓶）" prop="specification_of_piece">
          <el-input v-model.trim="temp.specification_of_piece" style="width: auto;" disabled placeholder="每件规格（瓶）" @input="calPiecePrice" />
        </el-form-item>

        <el-form-item label="产品出厂价（元/瓶）" prop="unit_price">
          <el-input-number v-model.trim="temp.unit_price" :controls="true" :precision="2" placeholder="请输入产品出厂价（元/瓶）" @input="calPiecePrice" />
        </el-form-item>

        <el-form-item label="每件价格（元）" prop="price_of_piece">
          <el-input v-model.trim="temp.price_of_piece" style="width: auto;" disabled :precision="2" placeholder="每件价格（元）" />
        </el-form-item>

        <el-form-item label="产品批发价（元/瓶）" prop="wholesale_price">
          <el-input-number v-model.trim="temp.wholesale_price" :controls="true" :precision="2" placeholder="请输入产品批发价（元/瓶）" />
        </el-form-item>

        <el-form-item label="建议零售价（元/瓶）" prop="suggested_retail_price">
          <el-input-number v-model.trim="temp.suggested_retail_price" :controls="true" :precision="2" placeholder="请输入建议零售价（元/瓶）" />
        </el-form-item>

        <el-form-item label="产品扫码价（元/瓶）" prop="scanning_price">
          <el-input-number v-model.trim="temp.scanning_price" :controls="true" :precision="2" placeholder="请输入产品扫码价（元/瓶）" />
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input v-model.trim="temp.remarks" :autosize="{ minRows: 2, maxRows: 2}" type="textarea" placeholder="输入产品的备注信息" />
        </el-form-item>
      </el-form>

      <!-- 内嵌产品搜索 dialog -->
      <el-dialog
        width="70%"
        :title="add_dealer_title"
        :visible.sync="productInnerVisible"
        append-to-body
      >
        <el-input v-model.trim="productListQuery.title" prefix-icon="el-icon-search" placeholder="请输入产品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleProductFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleProductFilter">搜索</el-button>

        <el-divider />
        <el-table
          v-loading="embeddedListLoading"
          :data="productList"
          border
          style="width: 100%"
        >
          <el-table-column label="产品名称" sortable prod="product_name" min-width="150px">
            <template slot-scope="{row}">
              <span>{{ row.product_name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="香型" prod="scent_type">
            <template slot-scope="{row}">
              <span>{{ row.scent_type }} </span>
            </template>
          </el-table-column>

          <el-table-column label="产品规格（ML）" sortable prod="specifications">
            <template slot-scope="{row}">
              <span>{{ row.specifications }} </span>
            </template>
          </el-table-column>

          <el-table-column label="每件规格（瓶）" sortable prod="specification_of_piece">
            <template slot-scope="{row}">
              <span>{{ row.specification_of_piece }} </span>
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

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button v-if="row.status!='deleted'" size="small" type="primary" @click="handleAddProduct(row)">
                选择此产品
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 内嵌的页面控制 -->
        <pagination v-show="productTotal>0" :total="productTotal" :page.sync="productListQuery.page" :limit.sync="productListQuery.limit" @pagination="handleProductFilter" />
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
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
import { getAllDealerProduct, getDealerList, updateDealerProduct, deleteDealerProduct, dealerProductMultiDelete, addDealerProduct, searchDealerProduct } from '@/api/dealer_product'
import { searchProduct } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
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
      add_dealer_title: '',

      // 内嵌搜索产品页面
      productInnerVisible: false,
      // 内嵌搜索加载条
      embeddedListLoading: true,
      productList: [],
      // 内嵌产品列表的总量
      productTotal: 0,
      productListQuery: {
        page: 1,
        limit: 10
      },

      // 下载 excel 保存数据
      downloadDataList: [],

      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        dealer_name: ''
      },
      // 选择经销商的单选框
      selectionList: [],
      // 保存远程拉取的经销商名单数据
      dealerListOptions: [],
      statusOptions: ['老白干香型', '浓香型', '清香型', '酱香型', '其他香型'],
      // 是否展示隐藏列
      showReviewer: false,
      temp: {
        timestamp: new Date()
      },
      dialogFormVisible: false,
      // 弹出层的状态，例如是 create 或者是 update
      dialogStatus: '',
      textMap: {
        detail: '查看产品详情',
        update: '编辑产品',
        create: '添加产品'
      },
      // 表单验证规则
      rules: {
        belong_to: [{ required: true, message: '请输入属于哪里的经销商价格', trigger: 'change' }],
        unit_price: [{ required: true, msg: '请输入出厂价（元/瓶）', validator: limitNumber, trigger: 'blur' }],
        wholesale_price: [{ required: true, msg: '请输入批发价（元/瓶）', validator: limitNumber, trigger: 'blur' }],
        suggested_retail_price: [{ required: true, msg: '请输入建议零售价（元/瓶）', validator: limitNumber, trigger: 'blur' }],
        scanning_price: [{ required: true, msg: '请输入扫码价（元/瓶）', validator: limitNumber, trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },

  created() {
    // 初始化页面的数据
    this.getDealerSelection()
  },

  methods: {
    select_product() {
      this.productInnerVisible = true
      if (this.temp.belong_to !== '') {
        this.add_dealer_title = '选择【' + this.temp.belong_to + '】经销商的产品'
      } else {
        this.add_dealer_title = '选择产品'
      }
    },

    // 自定义排序
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.order_by = '+' + prop
      } else {
        this.listQuery.order_by = '-' + prop
      }
      // 获取 search 数据
      this.handleFilter()
    },

    // 下拉选择经销商 触发事件
    selectDealer(value) {
      this.listQuery.dealer_name = value
      sessionStorage.setItem('selectDealer', value)
      this.handleFilter()
    },

    // 选择产品的界面 下拉选择经销商触发事件
    selectProductDealer(value) {
      this.temp.belong_to = value
      // 强制更新
      this.$forceUpdate()
    },

    // 获取经销商的下拉框数据
    getDealerSelection() {
      this.listLoading = true
      getDealerList().then((response) => {
        this.dealerListOptions = response.data.data
        this.listLoading = false

        const dealer_name = sessionStorage.getItem('selectDealer')
        // 如果为空，就选择一个默认值
        if (dealer_name === null) {
          // 默认为第一个
          sessionStorage.setItem('selectDealer', this.dealerListOptions[0].dealer_name)
          this.listQuery.dealer_name = this.dealerListOptions[0].dealer_name
        } else {
          this.listQuery.dealer_name = dealer_name
        }

        // 获取列表数据
        this.handleFilter()
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 计算每一件的价格（单价 x 每件多少瓶）
    calPiecePrice(event) {
      this.temp.price_of_piece = this.temp.specification_of_piece * this.temp.unit_price
    },

    // 选择产品之后对form表单进行赋值
    handleAddProduct(row) {
      this.productInnerVisible = false
      // 赋值
      this.temp.product_name = row.product_name
      this.temp.specifications = row.specifications
      this.temp.scent_type = row.scent_type
      this.temp.specification_of_piece = row.specification_of_piece
      this.temp.product_id = row.business_id
    },

    // 批量删除经销商产品
    batchDelete() {
      try {
        this.$confirm('是否确认删除这些数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          // 放需要删除的业务id，每一次都进行清除变量
          const business_ids = []
          this.list = this.list.filter(
            (a) => !this.selectionList.some((b, index) => {
              if (a.business_id === b.element.business_id) {
                business_ids.push(b.element.business_id)
                return true
              }
            })
          )

          // 多行删除api
          dealerProductMultiDelete(business_ids).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '批量删除产品',
              message: '删除成功！',
              type: 'success',
              duration: 2000
            })
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
      } catch (error) {
        this.listLoading = false
        console.log('批量删除出错了：')
        console.log(error)
      } finally {
        this.listLoading = false
      }
    },

    // 处理单选框，选择某个经销商
    handleSelectionChange(selection) {
      // 将选中的行的对象丢入 selectionList 里面
      const dataList = []
      const allList = this.list
      selection.forEach(element => {
        const element_dict = {
          element: element,
          index: allList.indexOf(element)
        }
        dataList.push(element_dict)
      })
      this.selectionList = dataList
    },

    // 搜索功能
    handleFilter() {
      this.listLoading = true
      searchDealerProduct(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.count
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 内嵌产品搜索功能
    handleProductFilter() {
      this.embeddedListLoading = true
      searchProduct(this.productListQuery).then(response => {
        this.productList = response.data.data
        this.productTotal = response.data.count
        this.embeddedListLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 点击添加按钮，弹出 添加经销商产品弹出层
    handleCreate() {
      // 增加一个时间戳，用来前端更新弹出层用的
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      // 获取所有的产品
      this.embeddedListLoading = true
      searchProduct(this.productListQuery).then(response => {
        this.productList = response.data.data
        this.productTotal = response.data.count
        this.embeddedListLoading = false
      }).catch(() => {
        this.listLoading = false
      })

      // 设置经销商
      this.temp.belong_to = sessionStorage.getItem('selectDealer')
    },
    // 时间
    resetTemp() {
      this.temp = {
        timestamp: new Date()
      }
    },

    // 添加经销商产品数据
    addData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addDealerProduct(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '新增产品：' + this.temp.product_name,
              message: '新增成功！',
              type: 'success',
              duration: 2000
            })

            // 刷新表格数据
            this.getDealerSelection()
          }).catch(() => {
            this.listLoading = false
          })
        }
      })
    },

    // 更新经销商产品数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          // 更新表格
          updateDealerProduct(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '更新产品：' + this.temp.product_name,
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.listLoading = false
          })

          // 刷新表格数据
          this.getDealerSelection()
        }
      })
    },

    // 编辑产品数据（更新）
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 查看详情页面
    viewDetails(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 处理删除
    handleDelete(row, index) {
      this.$confirm('是否确认删除这条数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteDealerProduct(row).then(() => {
          this.dialogFormVisible = false
          this.$notify({
            title: '删除产品：' + row.product_name,
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
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

    // // 处理下载 Excel 表格数据
    handleDownload() {
      let message = ''
      let download_title = ''
      if (this.listQuery.dealer_name !== undefined && this.listQuery.dealer_name !== null && this.listQuery.dealer_name !== '') {
        message = '是否确认将【' + this.listQuery.dealer_name + '的货单表】导出为Excel表格？'
        download_title = this.listQuery.dealer_name + '的货单表'
      } else {
        message = '是否确认将【全部经销商的货单表】导出为Excel表格？'
        download_title = '全部经销商的货单表'
      }

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true
        // 从后台获取所要下载的所有数据
        getAllDealerProduct(this.listQuery).then((response) => {
          const res = response.data.data
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['产品名称', '产品规格（ML）', '产品香型', '每件规格（瓶）', '产品出厂价（元/瓶）', '建议零售价（元）', '产品扫码价（元）', '每件价格（元）']
            const filterVal = ['product_name', 'specifications', 'scent_type', 'specification_of_piece', 'unit_price', 'suggested_retail_price', 'scanning_price', 'price_of_piece']
            const data = this.formatJson(filterVal, res)

            // 导出 excel
            excel.export_json_to_excel({
              header: tHeader,
              autoWidth: true,
              data,
              bookType: 'xlsx',
              filename: download_title
            })

            this.downloadLoading = false
          })
        }).catch(() => {
          this.downloadLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消！'
        })
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
</style>
