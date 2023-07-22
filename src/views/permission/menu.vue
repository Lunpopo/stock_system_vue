<!--
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-03-15 00:37:40
 * @FilePath: /order_system_vue/src/views/permission/role.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-edit" @click="handleAddRole">新增菜单</el-button>

    <!-- 表格数据 -->
    <el-table v-loading="listLoading" :data="apiList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="API名字">
        <template slot-scope="{row}">
          {{ row.title }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="在Vue中的名字">
        <template slot-scope="{row}">
          {{ row.vue_name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="icon">
        <template slot-scope="{row}">
          {{ row.icon }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="redirect">
        <template slot-scope="{row}">
          {{ row.redirect }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="父类菜单">
        <template slot-scope="{row}">
          {{ row.api_parent_id_label }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="菜单等级">
        <template slot-scope="{row}">
          {{ row.menu_type_label }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否隐藏">
        <template slot-scope="{row}">
          <el-tag v-if="row.hidden == 0">{{ row.hidden_label }}</el-tag>
          <el-tag v-if="row.hidden == 1" type="warning">{{ row.hidden_label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="API权限">
        <template slot-scope="{row}">
          {{ row.permission }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="路由路径">
        <template slot-scope="{row}">
          {{ row.router_path }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="容器路径">
        <template slot-scope="{row}">
          {{ row.component_path }}
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
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="get_menu" />

    <!-- 弹出框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-width="155px" label-position="left">
        <el-form-item label="API名字" prop="title">
          <el-input v-model.trim="temp.title" placeholder="请输入API名字，例如：货单表格" />
        </el-form-item>

        <el-form-item label="在vue中的name" prop="vue_name">
          <el-input v-model.trim="temp.vue_name" placeholder="请输入Vue中展示的名字，例如：Permission" />
        </el-form-item>

        <el-form-item label="icon" prop="icon">
          <el-input v-model.trim="temp.icon" placeholder="请输入icon，例如：table" />
        </el-form-item>

        <el-form-item label="redirect" prop="redirect">
          <el-input v-model.trim="temp.redirect" placeholder="请输入redirect，例如：/permission/page" />
        </el-form-item>

        <el-form-item label="菜单等级" prop="menu_type">
          <el-select v-model.trim="temp.menu_type" placeholder="请选择菜单等级">
            <el-option
              v-for="item in menu_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- 选了非一级菜单之后才会出现这个父级菜单 -->
        <el-form-item v-if="temp.menu_type == 1" label="父类菜单" prop="api_parent_id">
          <el-select v-model.trim="temp.api_parent_id" clearable placeholder="请选择父类菜单">
            <el-option
              v-for="item in parent_menu_type_options"
              :key="item.id"
              :label="item.title"
              :value="item.business_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="是否隐藏该菜单" prop="hidden">
          <el-select v-model.trim="temp.hidden" placeholder="请选择是否隐藏该菜单">
            <el-option
              v-for="item in hidden_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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

        <el-form-item label="路由路径" prop="router_path">
          <el-input v-model.trim="temp.router_path" placeholder="请输入路由路径，例如：/get_group_data" />
        </el-form-item>
        <el-form-item label="容器路径" prop="component_path">
          <el-input v-model.trim="temp.component_path" placeholder="请输入容器路径，例如：views/product/myself-price-list" />
        </el-form-item>
        <el-form-item label="API的描述信息" prop="description">
          <el-input v-model.trim="temp.description" :autosize="{ minRows: 3, maxRows: 4}" type="textarea" placeholder="输入此API的描述信息" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <!-- <el-button type="primary" @click="confirmMenu">确认</el-button> -->
        <el-button type="primary" @click="dialogType==='new'?addMenu():updateMenu()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getMenu, addMenu, deleteMenu, updateMenu, getParentMenu, getAllPermission } from '@/api/menu'

export default {
  components: { Pagination },
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
      // 分页显示菜单列表
      total: 0,
      // 表格加载圆圈
      listLoading: true,
      query: {
        page: 1,
        limit: 10
      },

      // 菜单是否隐藏
      hidden_options: [{
        value: 0,
        label: '否'
      }, {
        value: 1,
        label: '是'
      }],
      // 菜单等级下拉框
      menu_type_options: [{
        value: 0,
        label: '一级目录'
      }, {
        value: 1,
        label: '二级目录'
      }],
      // 一级菜单保存选项
      parent_menu_type_options: [],
      // 保存api所有的权限
      api_permission_options: [],

      // 表格数据
      temp: {
        // 默认选择一级目录
        'menu_type': 0,
        // 默认选择不隐藏
        'hidden': 0,
        // 默认api权限为editor
        'permission': ['editor']
      },
      // 获取所有的api，放入apiList里面
      apiList: [],

      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      // 表单验证规则
      rules: {
        title: [{ required: true, message: '请输入API的名字', trigger: 'change' }],
        api_parent_id: [{ required: true, message: '请选择父类菜单', trigger: 'blur' }],
        menu_type: [{ required: true, msg: '请选择菜单等级', validator: limitNumber, trigger: 'blur' }],
        hidden: [{ required: true, message: '请选择是否隐藏此菜单（API）', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入API权限', trigger: 'blur' }],
        router_path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
        component_path: [{ required: true, message: '请输入容器路径', trigger: 'blur' }]
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // 获取所有的菜单
    this.get_menu()
  },
  methods: {
    // 获取所有的菜单（api）
    get_menu() {
      this.listLoading = true
      getMenu(this.query).then((response) => {
        this.apiList = response.data.data
        this.total = response.data.count
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 下拉选择是否隐藏
    selectHidden(value) {
      this.$delete(this.temp, 'hidden')
      this.$set(this.temp, 'hidden', value)
    },

    // 获取所有的一级（父级）菜单（api）
    get_parent_menu() {
      this.listLoading = true
      getParentMenu().then((response) => {
        this.parent_menu_type_options = response.data.data
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

    // 点击新增菜单
    handleAddRole() {
      // 增加一个时间戳，用来前端更新弹出层用的
      this.resetTemp()
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // 获取所有的一级目录
      this.get_parent_menu()
      // 获取所有的api权限列表
      this.get_all_permission()
    },
    // 时间
    resetTemp() {
      this.temp = {
        timestamp: new Date(),
        'menu_type': 0,
        'hidden': 0,
        'permission': ['editor']
      }
    },

    // 点击确认添加菜单（api）
    addMenu() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addMenu(this.temp).then(() => {
            // 前端新增一条菜单
            this.apiList.unshift(this.temp)
            this.dialogVisible = false

            this.$notify({
              title: '新增菜单：' + this.temp.title,
              message: '新增成功！',
              type: 'success',
              duration: 2000
            })
            this.listLoading = false

            // 刷新表格数据
            this.get_menu()
          }).catch(() => {
            this.listLoading = false
          })
        }
      })
    },

    // 点击确认添加菜单（api）
    updateMenu() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          updateMenu(this.temp).then(() => {
            this.dialogVisible = false

            this.$notify({
              title: '更新菜单：' + this.temp.title,
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })

            this.listLoading = false

            // 刷新表格数据
            this.get_menu()
          }).catch(() => {
            this.listLoading = false
          })
        }
      })
    },

    // 编辑菜单
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

    // 处理删除菜单
    handleDelete(row, index) {
      this.$confirm('确认删除这条菜单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteMenu({ 'business_id': row.business_id }).then(() => {
          this.$notify({
            title: '删除菜单：' + row.title,
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
