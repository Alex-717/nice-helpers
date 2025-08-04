import axios from 'axios'

interface NRequestConfig {
  url: string
  method?: 'get' | 'post' | 'put' | 'delete'
  data?: any
  params?: any
  headers?: any
  retry?: number
  isCache?: boolean
  interceptors?: {
    request?: [(config: any) => any, (error: any) => any]
    response?: [(response: any) => any, (error: any) => any]
  }
}
/**
 * 1、支持缓存
 * 2、支持重试
 * 3、支持可取消
 * 4、支持自定义拦截
 * */
const cache = {}
export function nRequest (config: NRequestConfig) {
  const { url, method, isCache } = config
  const instance = axios.create()
  const cacheKey = `${method}-${url}`
  if (isCache &&cache[cacheKey]) {
    return Promise.resolve(cache[cacheKey])
  }

  if (config.interceptors) {
    if (config.interceptors.request) {
      instance.interceptors.request.use(config.interceptors.request[0], config.interceptors.request[1])
    }
    if (config.interceptors.response) {
      instance.interceptors.response.use(config.interceptors.response[0], config.interceptors.response[1])
    }
  }

  return instance({
    url: config.url,
    method: config.method,
    data: config.data,
    params: config.params,
    headers: config.headers
  }).then(res => {
    if (isCache) {
      cache[cacheKey] = res
    }
    return res
  }).catch(err => {
    if (config.retry) {
      return nRequest({
        ...config,
        retry: config.retry - 1
      })
    }
    return Promise.reject(err)
  })
}

