<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="120px" align="center" label="配置名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="配置值">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.value" class="edit-input" size="small" />
            <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">
              取消
            </el-button>
          </template>
          <span v-else>{{ row.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="编辑" width="120">
        <template slot-scope="{row}">
          <el-button v-if="row.edit" type="success" size="small" icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)">
            确认
          </el-button>
          <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="row.edit=!row.edit">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { fetchList } from '@/api/article'

export default {
  name: 'Setting',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      // const { data } = await fetchList(this.listQuery)
      // const items = data.items
      const items = [
        { id: 1, name: '邮费', value: 50 },
        { id: 2, name: '网址', value: 'www.goo.com' }
      ]
      this.list = items.map((v) => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalValue = v.value //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.value = row.originalValue
      row.edit = false
    },
    confirmEdit(row) {
      row.edit = false
      row.originalValue = row.value
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
