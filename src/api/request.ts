import axios from 'axios'     //引入
import { notification } from 'antd';

const baseURL = 'http://localhost:3001'

const config = {
  baseURL: baseURL,
  timeout: 30000       //设置最大请求时间
}
const _axios = axios.create(config)
const openNotification = (msg) => {
  notification.error({
    message: 'Error',
    description: msg,
    duration: 3,
  });
};
//封装post,get方法,其他的自行往下加，比如put,delete
const request = {
  get(url = '', params = {}) {
    return new Promise((resolve, reject) => {
      _axios({
        url,
        params,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        method: 'GET'
      }).then(res => {
        // 检查响应码并处理数据
        if (res.data.code === 5000 || res.data.code === 401) {
          openNotification(res.data.msg);
        } else {
          resolve(res.data);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  post(url = '', params = {}) {
    return new Promise((resolve, reject) => {
      _axios({
        url,
        data: params,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        method: 'POST'
      }).then(res => {
        // 检查响应码并处理数据
        if (res.data.code === 5000 || res.data.code === 401) {
          openNotification(res.data.msg);
        } else {
          resolve(res.data);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  postImg(url = '', params = {}) {
    return new Promise((resolve, reject) => {
      _axios({
        url,
        data: params,
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'POST'
      }).then(res => {
        // 检查响应码并处理数据
        if (res.data.code === 5000 || res.data.code === 401) {
          openNotification(res.data.msg);
        } else {
          resolve(res.data);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  delete(url = '', params = {}) {
    return new Promise((resolve, reject) => {
      _axios({
        url,
        params,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        method: 'DELETE'
      }).then(res => {
        // 检查响应码并处理数据
        if (res.data.code === 5000 || res.data.code === 401) {
          openNotification(res.data.msg);
        } else {
          resolve(res.data);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  put(url = '', params = {}) {
    return new Promise((resolve, reject) => {
      _axios({
        url,
        data: params,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        method: 'PUT'
      }).then(res => {
        // 检查响应码并处理数据
        if (res.data.code === 5000 || res.data.code === 401) {
          openNotification(res.data.msg);
        } else {
          resolve(res.data);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default request;