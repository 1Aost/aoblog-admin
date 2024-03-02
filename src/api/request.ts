import axios from 'axios'     //引入

let baseURL = 'http://localhost:3001'

 
let config = {
  baseURL: baseURL,
  timeout: 30000       //设置最大请求时间
}
const _axios = axios.create(config)
 
 
//封装post,get方法,其他的自行往下加，比如put,delete
const request = {
  get(url='',params={}){
    return new Promise((resolve, reject) => {
      _axios({
        url,
        params,
        headers:{'Content-Type': 'application/json;charset=UTF-8'},
        method: 'GET'
      }).then(res => {
        resolve(res.data)
        return res
      }).catch(error => {
        reject(error)
      })
    })
  },
  post(url='',params={}){
    return new Promise((resolve, reject) => {
      _axios({
        url,
        data:params,
        headers:{'Content-Type': 'application/json;charset=UTF-8'},
        method: 'POST'
      }).then(res => {
        resolve(res.data)
        return res
      }).catch(error => {
        reject(error)
      })
    })
  },
  postImg(url='',params={}){
    return new Promise((resolve, reject) => {
      _axios({
        url,
        data:params,
        headers:{'Content-Type': 'multipart/form-data'},
        method: 'POST'
      }).then(res => {
        resolve(res.data)
        return res
      }).catch(error => {
        reject(error)
      })
    })
  }
}


export default request
