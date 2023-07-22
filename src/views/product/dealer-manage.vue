<!-- 经销商列表管理 -->
<template>
  <div class="app-container">
    <!-- 过滤组件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.title" placeholder="请输入经销商名称进行搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <!-- <el-checkbox v-model.trim="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        显示隐藏列
      </el-checkbox> -->
    </div>

    <!-- 添加 和 多行删除 按钮 -->
    <!-- <el-button class="filter-item" type="danger" icon="el-icon-delete" :disabled="!(selectionList&&selectionList.length)" @click="batchDelete()">删除</el-button> -->
    <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
      添加
    </el-button>

    <!-- 表格数据 -->
    <!-- :default-sort="{prop: 'product_name', order: 'descending'}" -->
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

      <!-- <el-table-column type="selection" width="55" /> -->

      <!-- 按下详情按钮 -->
      <el-table-column label="详情" type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="经销商名称">
              <span>{{ props.row.dealer_name }}</span>
            </el-form-item>
            <el-form-item label="来源经销商">
              <span>{{ props.row.parent_dealer }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remarks }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ props.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
            <el-form-item label="业务id">
              <span>{{ props.row.business_id }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="经销商名称" sortable="custom" prop="dealer_name" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="viewDetails(row)">{{ row.dealer_name }} </span>
        </template>
      </el-table-column>

      <el-table-column label="来源经销商" sortable="custom" prop="parent_dealer" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.parent_dealer }} </span>
        </template>
      </el-table-column>

      <el-table-column label="备注" prop="remarks" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" sortable="custom" prop="create_time" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" sortable="custom" prop="update_time" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
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
        <el-form-item label="经销商名称" prop="dealer_name">
          <el-input v-model.trim="temp.dealer_name" placeholder="请输入经销商名称" />
        </el-form-item>

        <el-form-item v-if="textMap[dialogStatus] === '添加产品'" label="来源经销商" prop="parent_dealer">
          <el-select v-model.trim="temp.parent_dealer" placeholder="可以选择拷贝某个经销商的所有产品到该经销商下面" clearable class="filter-item" @change="selectProductDealer">
            <el-option v-for="item in dealerListOptions" :key="item.id" :label="item.dealer_name" :value="item.dealer_name" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="textMap[dialogStatus] !== '添加产品'" label="来源经销商" prop="parent_dealer">
          <el-select v-model.trim="temp.parent_dealer" clearable class="filter-item" disabled>
            <span>{{ temp.dealer_name }}</span>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input v-model.trim="temp.remarks" :autosize="{ minRows: 2, maxRows: 2}" type="textarea" placeholder="输入产品的备注信息" />
        </el-form-item>
      </el-form>

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
import { getDealerList, searchDealerList, addDealerName, deleteDealerName, updateDealerInfo } from '@/api/dealer_product'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'MysqlPriceList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // 显示隐藏列
      tableKey: 0,
      // 数据列表
      list: null,
      // 数据总数
      total: 0,
      // 是否显示加载圆圈
      listLoading: true,
      // 数据请求参数
      listQuery: {
        page: 1,
        limit: 10
      },
      // 多选框保存的选择项
      selectionList: [],
      // 保存远程拉取的经销商名单数据
      dealerListOptions: [],
      scentTypeOptions: ['老白干香型', '浓香型', '清香型', '酱香型', '其他香型'],
      // 是否显示隐藏列
      showReviewer: false,
      // 临时保存数据
      temp: {
        timestamp: new Date()
      },
      dialogFormVisible: false,
      // 弹窗狂状态，create / update
      dialogStatus: '',
      textMap: {
        detail: '查看产品详情',
        update: '编辑产品',
        create: '添加产品'
      },
      // 表单验证规则
      rules: {
        dealer_name: [{ required: true, message: '请输入经销商名称', trigger: 'change' }]
      }
    }
  },

  // 初始化函数
  created() {
    this.handleFilter()
  },

  methods: {
    // 获取所有的经销商的下拉框数据
    getDealerSelection() {
      this.listLoading = true
      // 获取所有的经销商数据，放入下拉框
      getDealerList().then((response) => {
        this.dealerListOptions = response.data.data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 选择产品的界面 下拉选择经销商触发事件
    selectProductDealer(value) {
      this.temp.parent_dealer = value
      // 强制更新
      this.$forceUpdate()
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

    // 处理表格多选框（用作删除的），将选中的行的对象丢入 selectionList 里面
    handleSelectionChange(selection) {
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
      searchDealerList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.count
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 生成时间戳，用来更新创建框的缓存
    resetTemp() {
      this.temp = {
        timestamp: new Date()
      }
    },

    // 创建按钮弹出框逻辑
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      this.getDealerSelection()

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 新增一条经销商到名单中
    addData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true

          // 新增一条经销商
          addDealerName(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '新增一名经销商：' + this.temp.dealer_name,
              message: '新增成功！',
              type: 'success',
              duration: 2000
            })
            this.listLoading = false

            // 刷新表格数据
            this.handleFilter()
          }).catch(() => {
            this.listLoading = false
          })
        }
      })
    },

    // 更新经销商数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true

          // 更新表格
          updateDealerInfo(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '更新经销商：' + this.temp.dealer_name,
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })

            this.listLoading = false
            // 刷新表格数据
            this.handleFilter()
          }).catch(() => {
            this.listLoading = false
          })
        }
      })
    },

    // 编辑产品数据（更新产品数据）
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

    // 删除经销商名单
    handleDelete(row, index) {
      this.$confirm('是否确认删除这名经销商？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteDealerName(row).then(() => {
          this.dialogFormVisible = false
          this.$notify({
            title: '删除经销商：' + row.dealer_name,
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
    }
  }
}
</script>

<style>
  /* 移动端的适配 */
  @media screen and (max-width: 500px) {
    .el-dialog {
      width: 90% !important;
    }

    .el-form-item__content {
      margin: 0 !important;
    }

    .el-message-box{
      width: 60% !important;
    }

    .el-message {
      min-width: 300px !important;
    }
  }

  /* 产看详情的 style */
  .demo-table-expand {
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
  }

  /* 上传框的 style */
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
