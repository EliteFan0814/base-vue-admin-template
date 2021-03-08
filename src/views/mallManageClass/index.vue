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
        <el-button type="primary" icon="el-icon-edit" @click="handleEdit(false)">新增</el-button>
      </div>
    </div>
    <div class="form-wrap">
      <el-table :data="tableData" highlight-current-row border height="700" style="width: 100%">
        <!-- <el-table-column prop="name" label="分类图片" width="100" align="center">
          <template slot-scope="{row}">
            <div class="img-wrap">
              <el-image class="avatar" :src="row.img" :preview-src-list="[row.img]">
              </el-image>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="name" label="分类名称" align="center">
        </el-table-column>
        <el-table-column prop="stock" label="分类库存(个)" align="center">
        </el-table-column>
        <el-table-column prop="date" label="创建日期" width="180" align="center">
        </el-table-column>
        <!-- <el-table-column prop="address" label="状态" align="center">
          <template slot-scope="{row}">
            <el-button v-if="row.state" type="primary" size="mini" @click="handleState(row,$index)">
              已创建
            </el-button>
            <el-button v-else type="danger" size="mini" @click="handleState(row)">
              已下架
            </el-button>
          </template>
        </el-table-column> -->
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
        { label: '已下架', value: 0 },
        { label: '已创建', value: 1 }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        state: '',
        keywords: undefined
      },
      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          price: '20.25',
          stock: 50,
          state: 1,
          img: 'https://dummyimage.com/600x400/000/fff'
        },
        {
          id: 2,
          date: '2016-05-02',
          name: '王小虎',
          price: '20.25',
          stock: 50,
          state: 0,
          img: 'https://dummyimage.com/200x400/000/fff'
        },
        {
          id: 3,
          date: '2016-05-02',
          name: '王小虎',
          price: '20.25',
          stock: 50,
          state: 1,
          img: 'https://dummyimage.com/100x200/000/fff'
        },
        {
          id: 4,
          date: '2016-05-02',
          name: '王小虎',
          price: '20.25',
          stock: 50,
          state: 1,
          img: 'https://dummyimage.com/400x600/000/fff'
        },
        {
          id: 4,
          date: '2016-05-02',
          name: '王小虎',
          price: '20.25',
          stock: 50,
          state: 1,
          img: 'https://dummyimage.com/400x600/000/fff'
        },
        {
          id: 4,
          date: '2016-05-02',
          name: '王小虎',
          price: '20.25',
          stock: 50,
          state: 1,
          img: 'https://dummyimage.com/400x600/000/fff'
        },
        {
          id: 4,
          date: '2016-05-02',
          name: '王小虎',
          price: '20.25',
          stock: 50,
          state: 1,
          img: 'https://dummyimage.com/400x600/000/fff'
        },
        {
          id: 4,
          date: '2016-05-02',
          name: '王小虎',
          price: '20.25',
          stock: 50,
          state: 1,
          img: 'https://dummyimage.com/400x600/000/fff'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    handleState(row) {},
    handleEdit(rowInfo) {
      if (rowInfo) {
        this.rowInfo = rowInfo
      } else {
        this.rowInfo = undefined
      }
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
      .avatar {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        ::v-deep .el-image__inner {
          display: block;
          width: auto;
          height: auto;
          max-width: 80px;
          max-height: 80px;
        }
      }
    }
    .pagination-wrap {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
