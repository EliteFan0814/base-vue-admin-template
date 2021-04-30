<template>
  <div class="edit-wrap">
    <el-dialog :title="info.id?'编辑':'新增'" :visible.sync="dialogVisible" fullscreen :close-on-click-modal="false" center
      width="40%" @close="closeDialog(false)">
      <div class="form-wrap">
        <el-form ref="formInfo" :model="formInfo" :rules="rules" label-width="100px">
          <el-form-item label="广告名称" prop="name">
            <div class="form-item">
              <el-input v-model="formInfo.name" placeholder="请输入广告名称" clearable></el-input>
            </div>
          </el-form-item>
          <el-form-item label="上架日期" prop="date">
            <div class="form-item">
              <el-date-picker v-model="formInfo.date" type="date" placeholder="请输入上架日期" format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="上传图片">
            <div class="form-item up-wrap">
              <el-upload :multiple="false" action="https://httpbin.org/post" :file-list="fileList"
                :show-file-list="true" :on-remove="handleRemove" :on-success="handleSuccess"
                :before-upload="beforeUpload" :on-exceed="handleExceed" list-type="picture-card">
                <img v-if="formInfo.picurl" :src="formInfo.picurl" class="good-img" />
                <i v-else class="el-icon-plus"></i>
                <!-- <i class="el-icon-plus"></i> -->
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
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
      upImgUrl: this.$store.getters.upImgUrl,
      dialogVisible: true,
      formInfo: {
        name: '',
        date: '',
        // picurl: 'https://dummyimage.com/300'
        picurl: ''
      },
      rules: {
        name: [{ required: true, message: '请输入广告名', trigger: 'blur' }],
        date: [{ required: true, message: '请输入上架日期', trigger: 'blur' }]
      },
      imgUpLimit: 1,
      listObj: {},
      // fileList: [{ url: 'https://dummyimage.com/300' }]
      fileList: []
    }
  },
  created() {
    console.log(this.upImgUrl)
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
    handleSuccess(response, file) {
      console.log(response, file)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      // if (this.fileList.length > 1) {
      //   return this.$message('已达最大上传数量！')
      // }
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function () {
          _self.listObj[fileName] = {
            hasSuccess: false,
            uid: file.uid,
            width: this.width,
            height: this.height
          }
        }
        console.log('before', this.listObj)
        resolve(true)
        // reject(false)
      })
    },
    handleExceed(files, fileList) {
      console.log('files', files)
      console.log('fileList', fileList)
      this.$message('已达最大上传数量！')
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
  .form-wrap {
    display: flex;
    align-items: center;
    .el-form {
      margin: 0 auto;
    }
  }
  .form-item {
    width: 200px;
  }
  .up-wrap {
    width: 500px;
    ::v-deep .el-upload-list {
      display: inline;
    }
    ::v-deep .el-upload {
      border: none;
    }
    .good-img {
      max-width: 148px;
      max-height: 148px;
    }
  }
}
</style>
