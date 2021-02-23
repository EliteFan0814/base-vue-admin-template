<template>
  <div class="edit-wrap">
    <el-dialog :title="info.id?'编辑':'新增'" :visible.sync="dialogVisible" center width="60%" @close="closeDialog(false)">
      <el-form ref="formInfo" :model="formInfo" :rules="rules" label-width="100px">
        <el-form-item label="文章标题" prop="name">
          <div class="form-item">
            <el-input v-model="formInfo.name" placeholder="请输入文章标题" clearable></el-input>
          </div>
        </el-form-item>
        <el-form-item label="文章类型" prop="type">
          <div class="form-item">
            <el-select v-model="formInfo.type" placeholder="请选择类型" clearable style="width: 150px" class="item">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="发布日期" prop="type">
          <div class="form-item">
            <el-date-picker v-model="formInfo.date" type="date" placeholder="请输入发布日期" format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <div class="form-item" style="width:700px;">
            <Editor v-model="formInfo.content" height="300"></Editor>
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
import Editor from '@/components/Tinymce'
export default {
  components: {
    Editor
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    typeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      dialogVisible: true,
      formInfo: {
        name: '',
        type: '',
        date: '',
        content: ''
      },
      rules: {
        name: [{ required: true, message: '请输入文章名', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        date: [{ required: true, message: '请输入上架日期', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      imgFiles: []
    }
  },
  created() {
    if (this.info.id) {
      this.formInfo = { ...this.formInfo, ...this.info }
    }
  },
  methods: {
    uploadImgFile(file) {
      const fileObj = file.file
      const form = new FormData()
      form.append('file', fileObj)
    },
    closeDialog(flag) {
      if (flag) {
        this.$refs['formInfo'].validate((valid) => {
          if (!valid) return
          if (this.formInfo.id) {
            // 做修改操作
            this.$emit('close', true)
          } else {
            // 做新增操作
            this.$emit('close', true)
          }
        })
      } else {
        this.$emit('close')
      }
    },
    // 转换为数字
    transToNumberStr(val, str) {
      this.formInfo[str] = val
        .replace(/[^0-9.]/g, '')
        .replace('.', '#*')
        .replace(/\./g, '')
        .replace('#*', '.')
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-wrap {
  .form-item {
    width: 200px;
  }
}
</style>
