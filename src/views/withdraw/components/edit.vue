<template>
  <div class="edit-wrap">
    <el-dialog title="拒绝原因" :visible.sync="dialogVisible" center width="40%" @close="closeDialog(false)">
      <el-form ref="formInfo" :model="formInfo" :rules="rules" label-width="100px">
        <el-form-item label="拒绝原因" prop="remark">
          <div class="form-item">
            <el-input v-model="formInfo.remark" type="textarea" :rows="2" placeholder="请输入拒绝原因" clearable></el-input>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(false)">取 消</el-button>
        <el-button type="primary" @click="closeDialog(true)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: true,
      formInfo: {
        remark: ''
      },
      rules: {
        remark: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
      },
      imgUpLimit: 3,
      listObj: {},
      fileList: [
        { url: 'https://dummyimage.com/300' },
        { url: 'https://dummyimage.com/300' }
      ]
    }
  },
  created() {
    if (this.info.id) {
      this.formInfo = { ...this.formInfo, ...this.info }
    }
  },
  methods: {
    closeDialog(flag) {
      if (flag) {
        this.$refs['formInfo'].validate((valid) => {
          if (!valid) return
          this.$emit('close', true)
        })
      } else {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-wrap {
  .up-wrap {
    width: 500px;
    ::v-deep .el-upload-list {
      display: inline;
    }
  }
}
</style>
