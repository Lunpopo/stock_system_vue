<!--
 * @Author: xie.yx yxxie@gk-estor.com
 * @Date: 2023-02-27 09:30:06
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-03-22 21:55:27
 * @FilePath: /order_system_vue/src/views/dashboard/admin/components/TransactionTable.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-table
    v-loading="listLoading"
    :data="list"
    style="width: 100%; padding-top: 15px;;"
    :row-class-name="tableRowClassName"
    :summary-method="getSummaries"
    show-summary
  >
    <el-table-column type="index" :index="indexMethod" />

    <el-table-column label="产品名" prop="name">
      <template slot-scope="scope">
        {{ scope.row.name }}
      </template>
    </el-table-column>

    <el-table-column label="销售额" align="center" prop="outbound_price">
      <template slot-scope="scope">
        ¥{{ scope.row.outbound_price }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { productTransactionList } from '@/api/remote-search'

export default {
  data() {
    return {
      listLoading: true,
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (data !== null) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = parseFloat(sums[index]).toFixed(2)
            sums[index] += ' 元'
          }
        }
      })

      return sums
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      }
    },

    indexMethod(index) {
      return index + 1
    },

    fetchData() {
      this.listLoading = true
      productTransactionList().then(response => {
        // this.list = response.data.items.slice(0, 8)
        this.list = response.data.items
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
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
</style>
