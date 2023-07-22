/*
 * @Author: lunpopo lunpopo.personal@gmail.com
 * @Date: 2022-12-05 21:09:43
 * @LastEditors: xie.yx yxxie@gk-estor.com
 * @LastEditTime: 2023-03-22 21:38:17
 * @FilePath: /vue-element-admin/src/utils/request.js
 * @Description: axios请求拦截器
 */
import router from '../router'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600000 // request timeout，设置为60分钟
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // 根据实际情况修改
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log('请求出错了：')
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获取http信息，例如header 或者 状态
   * Please return response => response
  */

  /**
   * 通过自定义代码确定请求状态
   * 还可以通过HTTP状态代码判断状态
   */
  response => {
    const res = response.data

    // 如果自定义代码不是20000，则判断为错误。
    if (res.code !== 20000) {
      // 50008: 非法token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('您已登出，请重新登陆', '登录信息提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
        // }).then(() => {
        //   store.dispatch('user/resetToken')
        // })
      }
      // return Promise.reject(new Error(res.msg || 'Error'))
      return Promise.reject(res.msg)
    } else {
      return res
    }
  }, (error) => {
    if (error.response !== null && error.response !== undefined && error.response !== '') {
      const res = error.response
      if (res.status === 401) {
        console.log('401了，兄弟，你没有权限访问该页面（功能）！')
        // 如果又是 401 然后 token又过期了，就直接跳到login页面
        router.push({ name: 'Page401' })
      } else if (res.status === 500) {
        // 服务器内部报错
        Message({
          message: res.data.msg,
          type: 'error',
          duration: 5 * 1000,
          showClose: true
        })
        return Promise.reject(res.data.msg)
      }

      return Promise.reject(new Error(error))
    } else {
      return Promise.reject(new Error(error))
    }
  }
)

export default service
