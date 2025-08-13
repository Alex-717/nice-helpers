import axios from 'axios'
import cryptoJs from 'crypto-js'
import type { AxiosRequestConfig } from 'axios'

interface INRequestConfig {
  url: string
  method?: 'get' | 'post' | 'put' | 'delete'
  data?: any
  headers?: any
  timeout?: number
  retry?: number
  needCache?: boolean,
  isResetCache?: boolean,
  signal?: AbortSignal,
  interceptors?: {
    request?: [(config: any) => any, (error: any) => any]
    response?: [(response: any) => any, (error: any) => any]
  }
}
/**
 * 增强的网络请求函数，基于 axios 封装
 * 
 * 功能特性：
 * 1. 支持缓存 - 通过 needCache 参数启用请求结果缓存
 * 2. 支持重试 - 通过 retry 参数设置失败重试次数
 * 3. 支持取消 - 通过 signal 参数支持 AbortController 取消请求
 * 4. 支持自定义拦截器 - 可配置请求和响应拦截器
 * 5. 支持重置缓存 - 通过 isResetCache 参数清空所有缓存
 * 
 * @param config 请求配置对象
 * @param config.url 请求的 URL 地址
 * @param config.method 请求方法，默认为 'POST'
 * @param config.data 请求数据（POST/PUT 等方法使用）
 * @param config.params 查询参数（GET 方法会将 data 转换为查询字符串）
 * @param config.headers 请求头配置
 * @param config.retry 失败重试次数，默认不重试
 * @param config.needCache 是否启用缓存，默认 false
 * @param config.isResetCache 是否重置所有缓存，默认 false
 * @param config.signal AbortController 的 signal，用于取消请求
 * @param config.interceptors 拦截器配置
 * @param config.interceptors.request 请求拦截器 [成功回调, 失败回调]
 * @param config.interceptors.response 响应拦截器 [成功回调, 失败回调]
 * 
 * @returns Promise<AxiosResponse> 返回 axios 响应对象
 * 
 * @example
 * // 基本使用
 * const response = await nRequest({
 *   url: 'https://api.example.com/data',
 *   method: 'get'
 * })
 * 
 * @example
 * // 启用缓存和重试
 * const response = await nRequest({
 *   url: 'https://api.example.com/data',
 *   method: 'get',
 *   needCache: true,
 *   retry: 3
 * })
 * 
 * @example
 * // 使用拦截器
 * const response = await nRequest({
 *   url: 'https://api.example.com/data',
 *   method: 'post',
 *   data: { name: 'test' },
 *   interceptors: {
 *     request: [
 *       (config) => {
 *         config.headers.Authorization = 'Bearer token'
 *         return config
 *       },
 *       (error) => Promise.reject(error)
 *     ]
 *   }
 * })
 */
let cache: Record<string, any> = new Map()
const MAX_CACHE_SIZE = 10
export function nRequest (config: INRequestConfig): any {
  const { url, method = 'POST', signal, isResetCache = false, retry = 0, timeout = 8000 } = config
  let { needCache = false } = config

  if (!/^[0-9]\d*$/.test(retry.toString())) {
    throw new Error('retry 必须是非负整数')
  }

  if (isResetCache) {
    cache.clear()
  }

  let cacheKey = ''
  if (!shouldCache(config.data)) {
    needCache = false
  } else if (needCache) {
    cacheKey = createCacheKey(url, method, config.data)
    if (cache.has(cacheKey)) {
      return Promise.resolve(cache.get(cacheKey))
    }
  }

  const instance = axios.create()
  if (config.interceptors) {
    if (config.interceptors.request) {
      instance.interceptors.request.use(config.interceptors.request[0], config.interceptors.request[1])
    }
    if (config.interceptors.response) {
      instance.interceptors.response.use(config.interceptors.response[0], config.interceptors.response[1])
    }
  }
  
  const requestConfig: AxiosRequestConfig = {
    timeout,
    url: config.url,
    method: config.method,
    headers: config.headers || {}
  }
  
  if (signal) {
    requestConfig.signal = signal
  }
  if (method.toLowerCase() === 'get') {
    requestConfig.params = config.data
  } else {
    requestConfig.data = config.data
  }

  return instance(requestConfig).then(res => {
    if (needCache) {
      updateCache(cacheKey, res)
      // cache.set(cacheKey, res)
    }
    return res.data
  }).catch(err => {
    if (retry && shouldRetry(err)) {
      return nRequest({
        ...config,
        retry: retry - 1
      })
    }
    return Promise.reject(err)
  })
}

function shouldCache (data: any) {
  if (data instanceof FormData) return false
  try {
    JSON.stringify(data)
  } catch (err) {
    console.warn('postData可能存在循环引用，请检查')
    return false
  }
  // data传进来一般是个对象
  if (hasFileInObj(data)) return false  
  return true
}
function hasFileInObj (data: any) {
  if (data instanceof File) return true
  if (data instanceof Blob) return true
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      for (const item of data) {
        if (hasFileInObj(item)) {
          return true
        }
      }
    } else {
      for (const key in data) {
        if (hasFileInObj(data[key])) {
          return true
        }
      }
    }
  }
  return false
}

function createCacheKey (url: string, method: string, data: any): string {
  let cacheKey = ''
  const baseKey = `${url}-${method}`
  if (!data) {
    cacheKey = cryptoJs.MD5(baseKey).toString()
    console.log('cacheKey:', cacheKey)
    return cacheKey
  }
  const dataStr = JSON.stringify(data)
  cacheKey = cryptoJs.MD5(`${baseKey}-${dataStr}`).toString()
  console.log('cacheKey:', cacheKey)
  return cacheKey
}

function updateCache (cacheKey: string, res: any) {
  if (cache.has(cacheKey)) {
    cache.delete(cacheKey)
  }
  cache.set(cacheKey, res)

  // LRU---最近最少使用策略
  if (cache.size >= MAX_CACHE_SIZE) {
    cache.delete(cache.keys().next().value)
  }
}

function shouldRetry (err: any) {
  // 用户主动取消
  if (err.name === 'AbortError') {
    return false
  }
  return true
}

