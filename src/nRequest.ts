import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

interface INRequestConfig {
  url: string
  method?: 'get' | 'post' | 'put' | 'delete'
  data?: any
  headers?: any
  timeout?: number
  retry?: number
  isCache?: boolean,
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
 * 1. 支持缓存 - 通过 isCache 参数启用请求结果缓存
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
 * @param config.isCache 是否启用缓存，默认 false
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
 *   isCache: true,
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
let cache: Record<string, any> = {}
export function nRequest (config: INRequestConfig): any {
  const { url, method = 'POST', isCache, signal, isResetCache = false, retry = 0, timeout = 8000 } = config

  if (!/^[0-9]\d*$/.test(retry.toString())) {
    throw new Error('retry 必须是非负整数')
  }

  if (isResetCache) {
    cache = {}
  }

  const cacheKey = `${method}-${url}-${JSON.stringify(config.data)}`
  if (isCache && cache[cacheKey]) {
    return Promise.resolve(cache[cacheKey])
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
    // requestConfig.params = qs.stringify(config.data)
    requestConfig.params = config.data
  } else {
    requestConfig.data = config.data
  }

  return instance(requestConfig).then(res => {
    if (isCache) {
      cache[cacheKey] = res
    }
    return res
  }).catch(err => {
    if (retry) {
      return nRequest({
        ...config,
        retry: retry - 1
      })
    }
    return Promise.reject(err)
  })
}

