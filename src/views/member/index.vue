<template>
  <div class="dashboard-container">
    <div class="search-wrap">
      <div class="left">
        <div class="item">搜索：</div>
        <el-input v-model="listQuery.keywords" class="item" style="width: 200px;" placeholder="请输入关键词" clearable
          @keyup.enter.native="handleFilter"></el-input>
        <el-select v-model="listQuery.state" placeholder="请选择状态" clearable style="width: 150px" class="item">
          <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
      <div class="right">
        <el-button type="primary" icon="el-icon-edit" @click="handleEdit">新增</el-button>
      </div>
    </div>
    <div class="form-wrap">
      <el-table :data="tableData" highlight-current-row border style="width: 100%">
        <el-table-column prop="name" label="头像" width="100" align="center">
          <template slot-scope="{row}">
            <div class="img-wrap">
              <img :src="row.avatar" class="avatar" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="date" label="注册日期" width="180" align="center">
        </el-table-column>
        <el-table-column prop="address" label="地址" align="center">
        </el-table-column>
        <el-table-column prop="address" label="状态" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              锁定
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrap">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getList" />
    </div>
    <edit v-if="showEdit" :info="rowInfo" @close="closeDialog"></edit>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import edit from './components/edit' // secondary package based on el-pagination
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Dashboard',
  components: { Pagination, edit },
  data() {
    return {
      showEdit: false,
      rowInfo: undefined,
      total: 120,
      stateList: [
        { label: '已锁定', value: 0 },
        { label: '正常', value: 1 }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        state: '',
        keywords: undefined
      },
      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          avatar: 'https://dummyimage.com/600x400/000/fff',
          phone: '15202221114',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    handleEdit(rowInfo) {
      this.rowInfo = rowInfo
      this.showEdit = true
    },
    handleDelete(row, index) {
      this.$confirm('确认删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    closeDialog(flag) {
      this.showEdit = false
      if (flag) {
        this.getList()
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {}
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 15px;
    .search-wrap {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
      }
      .item {
        margin-right: 10px;
      }
    }
    .img-wrap {
      margin: 0 auto;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      .avatar {
        display: block;
        max-width: 80px;
        max-height: 80px;
      }
    }
    .pagination-wrap {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
