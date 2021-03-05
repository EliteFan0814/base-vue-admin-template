import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import Qs from 'qs'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (config.method === 'post') {
      // 如果请求参数不是 FormData 类型，就将对象序列化成键值对的形式放入请求体
      // 如果是formData形式则可以直接传递
      if (!(config.data instanceof FormData)) {
        config.data = Qs.stringify(config.data)
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
    }
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.data.success || response.data.code === 1) {
      // successcess
      if (response.data.msg && response.data.msg !== 'ok') {
        Message.success(response.data.msg)
      }
      return response.data
    }
    if (response.data.code === 0) {
      Message.error(response.data.msg)
    }
    // if (response.data.success || response.data.code === 1) return response.data
    return Promise.reject(response.data)
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response) {
      if (error.response.status === 401) {
        MessageBox.confirm('身份认证已过期，请重新登录', '认证过期', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      if (error.response.status === 403) {
        Message.error('没有操作权限')
      }
      if (error.response.status === 400) {
        if (error.response.data && error.response.data.message) {
          Message.error(error.response.data.message)
        } else {
          Message.error(JSON.stringify(error.response.data))
        }
      }
    }
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
