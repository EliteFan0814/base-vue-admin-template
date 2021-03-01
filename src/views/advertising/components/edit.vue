<template>
  <div class="edit-wrap">
    <el-dialog :title="info.id?'编辑':'新增'" :visible.sync="dialogVisible" center width="40%" @close="closeDialog(false)">
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
            <el-upload :multiple="false" action="https://httpbin.org/post" :file-list="fileList" :show-file-list="false"
              :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeUpload"
              :on-exceed="handleExceed" list-type="picture-card">
              <img v-if="formInfo.picurl" :src="formInfo.picurl" class="good-img" />
              <i v-else class="el-icon-plus"></i>
            </el-upload>
            <div class="up-imp-wrap">
              <div class="img-list-wrap">
                <div v-for="(item,index) in imgSrc" :key="index" class="img-wrap">
                  <progress :value="item.progressValue" :max="item.progressMax" class="progress"></progress>
                  <img :src="item.imgUrl" alt="">
                </div>
              </div>
              <label class="up-label" for="up-img">上传图片</label>
              <input id="up-img" ref="upFile" type="file" name="file" accept="image/*" multiple @change="handleUpImg">
            </div>
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
        name: '',
        date: '',
        picurl: 'https://dummyimage.com/300'
      },
      rules: {
        name: [{ required: true, message: '请输入广告名', trigger: 'blur' }],
        date: [{ required: true, message: '请输入上架日期', trigger: 'blur' }]
      },
      imgUpLimit: 1,
      listObj: {},
      fileList: [{ url: 'https://dummyimage.com/300' }],
      imgSrc: []
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
      console.log('file', file)
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
    },
    handleUpImg() {
      console.log(this.$refs.upFile.files)
      const upFileList = this.$refs.upFile.files
      upFileList.forEach((item) => {
        // 新建 FileReader 对象
        const reader = new FileReader()
        reader.readAsDataURL(item)
        // 初始化一个图片显示对象
        const imgInfoObj = {
          progressValue: 0,
          progressMax: undefined,
          imgUrl: ''
        }
        this.imgSrc.push(imgInfoObj)
        reader.onloadstart = function (e) {
          imgInfoObj.progressValue = 0
          imgInfoObj.progressMax = e.total
          console.log('start', e.loaded)
        }
        reader.onprogress = function (e) {
          imgInfoObj.progressValue = e.loaded
          console.log('progress', e.loaded)
        }
        reader.onload = function (e) {
          imgInfoObj.progressValue = e.loaded
          imgInfoObj.imgUrl = this.result
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-wrap {
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
    .up-imp-wrap {
      font-size: 14px;
      border: 1px solid red;
      .img-list-wrap {
        .img-wrap {
          position: relative;
          .progress {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }
          img {
            width: 150px;
          }
        }
      }
      .up-label {
        background-color: #1b9af7;
        border-color: #1b9af7;
        color: #fff;
        padding: 5px;
        border-radius: 5px;
        &:hover {
          cursor: pointer;
          background-color: #4cb0f9;
          border-color: #4cb0f9;
        }
      }
      #up-img {
        opacity: 0;
        width: 0;
        height: 0;
      }
    }
  }
}
</style>
