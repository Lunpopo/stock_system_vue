<!--
 * @Author: lunpopo lunpopo.personal@gmail.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-03-14 21:31:16
 * @FilePath: /order_system_vue/src/views/permission/role.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增角色</el-button>

    <el-table v-loading="listLoading" :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色权限key" width="220">
        <template slot-scope="scope">
          {{ scope.row.group_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名" width="220">
        <template slot-scope="scope">
          {{ scope.row.group_label }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述信息">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑权限</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色键值名">
          <el-input v-model.trim="role.group_name" placeholder="请输入角色键值名，例如：editor" />
        </el-form-item>
        <el-form-item label="角色名">
          <el-input v-model.trim="role.group_label" placeholder="请输入角色键值名，例如：普通用户组" />
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input
            v-model.trim="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入角色描述信息"
          />
        </el-form-item>

        <!-- :check-strictly="checkStrictly" -->
        <el-form-item label="菜单">
          <el-tree
            ref="tree"
            :data="routesData"
            show-checkbox
            node-key="path"
            :props="defaultProps"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoutesByRole, getRoles, addRole, deleteRole, updateRole } from '@/api/role'

export default {
  data() {
    return {
      listLoading: true,
      role: {},
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      // 多选框是否与父类进行单独隔开
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // 获取所有的路由和角色
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    // 弹出框的确认按钮（新增或者更新）
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      const { group_name } = this.role

      if (isEdit) {
        // 更新角色
        this.listLoading = true
        updateRole(this.role).then(() => {
          for (let index = 0; index < this.rolesList.length; index++) {
            if (this.rolesList[index].business_id === this.role.business_id) {
              this.rolesList.splice(index, 1, Object.assign({}, this.role))
              break
            }
          }
          this.listLoading = false

          // 更新成功提示框
          this.dialogVisible = false
          this.$notify({
            title: '更新角色：' + group_name,
            message: '新增成功！',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        // 新增角色
        // const { data } = await addRole(this.role)
        this.listLoading = true
        addRole(this.role).then((response) => {
          this.rolesList.push(response.data)
          this.dialogVisible = false
          // 新增成功提示框
          this.$notify({
            title: '新增角色：' + group_name,
            message: '新增成功！',
            type: 'success',
            duration: 2000
          })
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },

    // 获取所有的路由（菜单/api 列表）
    async getRoutes() {
      this.listLoading = true
      getRoutes().then((response) => {
        this.serviceRoutes = response.data
        this.routes = this.generateRoutes(response.data)
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 获取所有的角色信息
    async getRoles() {
      // const res = await getRoles()
      // this.rolesList = res.data.data
      this.listLoading = true
      getRoles().then((response) => {
        this.rolesList = response.data.data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 重塑路由结构，使其看起来与侧边栏相同
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // 是否在前端进行隐藏
        if (route.hidden) { continue }
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          // 拼接路由，例如：path.resolve('/', './baz/foo')   // returns '/baz/foo'
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }
        // 递归子路由
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },

    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      // 如果没有子路由，就会返回 []
      const showingChildren = children.filter(item => !item.hidden)

      // 当只有一个子路线时，默认情况下显示该子路线
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // 如果没有要显示的子路线，则显示父路线
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },

    // 处理添加角色按钮
    handleAddRole() {
      this.role = {}
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    // 编辑角色
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true

      // 深度拷贝这一行的数据对象
      this.role = deepClone(scope.row)

      // this.$nextTick(()=>{}) 将回调函数中的操作放到下一次DOM更新之后执行
      this.$nextTick(() => {
        this.listLoading = true
        // 获取只存在该行角色的路由
        getRoutesByRole({ role: this.role.group_name }).then((response) => {
          const routes = this.generateArr(this.generateRoutes(response.data))
          this.$refs.tree.setCheckedNodes(routes)
          // 设置节点的已检查状态不会影响其父节点和子节点
          // this.checkStrictly = false
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      })
    },

    // 生成checkbox选中的方法
    generateArr(routes) {
      const data = []
      routes.forEach(route => {
        if (route.children) {
          route.children.forEach(children_route => {
            data.push(children_route)
          })
        }
        // 如果是与父类进行单独隔开，就要用这部分的代码
        // data.push(route)
        // if (route.children) {
        //   const temp = this.generateArr(route.children)
        //   if (temp.length > 0) {
        //     data = [...data, ...temp]
        //   }
        // }
      })
      return data
    },

    // 删除角色
    handleDelete({ $index, row }) {
      this.$confirm('确认删除此角色吗？', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteRole({ 'role_id': row.business_id, 'group_name': row.group_name }).then(() => {
          this.rolesList.splice($index, 1)
          // 关闭加载框
          this.listLoading = false

          this.$notify({
            title: '删除角色：' + row.group_name,
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
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

    // 生成路由结构树
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []
      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)
        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }
        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
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
