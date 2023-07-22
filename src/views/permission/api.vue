<!--
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-03-15 00:36:22
 * @FilePath: /order_system_vue/src/views/permission/role.vue
 * @Description: 各大api的权限（也就是功能的权限）
-->
<template>
  <div class="app-container">
    <!-- 过滤组件 -->
    <div class="filter-container">
      <el-input v-model.trim="query.title" placeholder="请输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-button class="filter-item" type="primary" style="margin-bottom: 15px;" icon="el-icon-edit" @click="handleAddApi">新增api（功能）权限</el-button>

    <el-table v-loading="listLoading" :data="apiList" style="width: 100%;" border>
      <el-table-column align="center" label="API名字">
        <template slot-scope="{row}">
          {{ row.title }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="API路径">
        <template slot-scope="{row}">
          {{ row.api_name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="API权限">
        <template slot-scope="{row}">
          {{ row.permission }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="API描述信息">
        <template slot-scope="{row}">
          {{ row.description }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑权限</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页面控制 -->
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleFilter" />

    <!-- 弹出框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑API功能':'新增API功能'">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-width="155px" label-position="left">
        <el-form-item label="API名字" prop="title">
          <el-input v-model.trim="temp.title" placeholder="请输入API名字，例如：获取货单表格数据" />
        </el-form-item>

        <el-form-item label="API路径" prop="api_name">
          <el-input v-model.trim="temp.api_name" placeholder="请输入API路径，例如：/user/get_group_data" />
        </el-form-item>

        <el-form-item label="API权限" prop="permission">
          <el-select v-model.trim="temp.permission" multiple filterable allow-create default-first-option placeholder="请选择此API的权限，例如：editor">
            <el-option
              v-for="item in api_permission_options"
              :key="item.id"
              :label="item.label"
              :value="item.group_name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="API的描述信息" prop="description">
          <el-input v-model.trim="temp.description" :autosize="{ minRows: 3, maxRows: 4}" type="textarea" placeholder="输入此API的描述信息" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="dialogType==='new'?addApi():updateApi()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import { getAllPermission } from '@/api/menu'
import { searchApi, addApi, deleteApi, updateApi } from '@/api/api'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // 分页显示菜单列表
      total: 0,
      // 表格加载圆圈
      listLoading: true,
      query: {
        page: 1,
        limit: 10
      },

      // 保存api所有的权限
      api_permission_options: [],

      // 表格数据
      temp: {
        // 默认api权限为editor
        'permission': ['editor']
      },
      // 获取所有的api，放入apiList里面
      apiList: [],

      dialogVisible: false,
      dialogType: 'new',
      // 表单验证规则
      rules: {
        title: [{ required: true, message: '请输入API的名字', trigger: 'change' }],
        api_name: [{ required: true, message: '请输入api路由路径', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入API权限', trigger: 'blur' }]
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // 获取所有的功能api列表
    this.handleFilter()
  },
  methods: {
    // 搜索功能
    handleFilter() {
      this.listLoading = true
      searchApi(this.query).then(response => {
        this.apiList = response.data.data
        this.total = response.data.count
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 获取所有的api权限列表
    get_all_permission() {
      this.listLoading = true
      getAllPermission().then((response) => {
        this.api_permission_options = response.data.data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 点击新增api
    handleAddApi() {
      // 增加一个时间戳，用来前端更新弹出层用的
      this.resetTemp()
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // 获取所有的api权限列表
      this.get_all_permission()
    },
    // 时间
    resetTemp() {
      this.temp = {
        timestamp: new Date(),
        'permission': ['editor']
      }
    },

    // 点击确认添加功能（api）
    addApi() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addApi(this.temp).then(() => {
            // 前端新增一条api
            this.apiList.unshift(this.temp)
            this.dialogVisible = false

            this.$notify({
              title: '新增API：' + this.temp.title,
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

    // 点击确认添加功能（api）
    updateApi() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          updateApi(this.temp).then(() => {
            this.dialogVisible = false

            this.$notify({
              title: '更新API：' + this.temp.title,
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

    // 编辑api
    handleEdit(row) {
      // 拷贝这一行的数据对象
      this.temp = Object.assign({}, row)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      // 获取所有的api权限列表
      this.get_all_permission()
    },

    // 处理删除api
    handleDelete(row, index) {
      this.$confirm('确认删除这条API吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteApi({ 'business_id': row.business_id }).then(() => {
          this.$notify({
            title: '删除API：' + row.title,
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
          this.apiList.splice(index, 1)
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
}
</style>
