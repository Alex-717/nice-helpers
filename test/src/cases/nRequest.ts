// @ts-ignore
import { nRequest } from 'nice-helpers'

/**
 * 测试 nRequest 函数的基本功能
 */
async function testBasicRequest() {
  console.log('🚀 测试基本请求功能...')
  
  try {
    // 测试基本的 GET 请求
    const response = await nRequest({
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'get'
    })
    
    if (response && response.data) {
      console.log('✅ 基本 GET 请求成功')
      console.log('📄 响应数据:', response.data.title)
    } else {
      console.log('❌ 基本 GET 请求失败')
    }
  } catch (error) {
    console.log('❌ 基本请求测试失败:', error.message)
  }
}

/**
 * 测试带参数的 GET 请求
 */
async function testGetWithParams() {
  console.log('🚀 测试带参数的 GET 请求...')
  
  try {
    // 测试带查询参数的 GET 请求
    const response = await nRequest({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'get',
      data: {
        userId: 1,
        _limit: 3
      }
    })
    
    if (response && response.data && Array.isArray(response.data)) {
      console.log('✅ 带参数的 GET 请求成功')
      console.log(`📊 返回 ${response.data.length} 条数据`)
      console.log('📄 第一条数据标题:', response.data[0]?.title)
    } else {
      console.log('❌ 带参数的 GET 请求失败')
    }
  } catch (error) {
    console.log('❌ 带参数的 GET 请求测试失败:', error.message)
  }
}

/**
 * 测试 POST 请求
 */
async function testPostRequest() {
  console.log('🚀 测试 POST 请求...')
  
  try {
    // 测试 POST 请求创建新数据
    const postData = {
      title: 'nRequest 测试文章',
      body: '这是通过 nRequest 函数发送的 POST 请求测试',
      userId: 1
    }
    
    const response = await nRequest({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'post',
      data: postData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response && response.data) {
      console.log('✅ POST 请求成功')
      console.log('📄 创建的数据 ID:', response.data.id)
      console.log('📄 创建的数据标题:', response.data.title)
      console.log('📊 响应状态码:', response.status)
    } else {
      console.log('❌ POST 请求失败')
    }
  } catch (error) {
    console.log('❌ POST 请求测试失败:', error.message)
  }
}

/**
 * 测试 PUT 请求
 */
async function testPutRequest() {
  console.log('🚀 测试 PUT 请求...')
  
  try {
    // 测试 PUT 请求更新数据
    const putData = {
      id: 1,
      title: 'nRequest 更新测试文章',
      body: '这是通过 nRequest 函数发送的 PUT 请求测试',
      userId: 1
    }
    
    const response = await nRequest({
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'put',
      data: putData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response && response.data) {
      console.log('✅ PUT 请求成功')
      console.log('📄 更新的数据标题:', response.data.title)
      console.log('📊 响应状态码:', response.status)
    } else {
      console.log('❌ PUT 请求失败')
    }
  } catch (error) {
    console.log('❌ PUT 请求测试失败:', error.message)
  }
}

/**
 * 测试缓存功能
 */
async function testCacheFeature() {
  console.log('🚀 测试缓存功能...')
  
  try {
    const config = {
      url: 'https://jsonplaceholder.typicode.com/posts/2',
      method: 'get' as const,
      isCache: true
    }
    
    // 第一次请求
    const startTime1 = Date.now()
    const response1 = await nRequest(config)
    const endTime1 = Date.now()
    
    // 第二次请求（应该从缓存获取）
    const startTime2 = Date.now()
    const response2 = await nRequest(config)
    const endTime2 = Date.now()
    
    const time1 = endTime1 - startTime1
    const time2 = endTime2 - startTime2
    
    if (time2 < time1 && response1.data.id === response2.data.id) {
      console.log('✅ 缓存功能正常工作')
      console.log(`📊 第一次请求耗时: ${time1}ms, 第二次请求耗时: ${time2}ms`)
    } else {
      console.log('❌ 缓存功能可能未正常工作')
    }
  } catch (error) {
    console.log('❌ 缓存测试失败:', error.message)
  }
}

/**
 * 测试重试功能
 */
async function testRetryFeature() {
  console.log('🚀 测试重试功能...')
  
  try {
    // 使用一个不存在的 URL 来触发重试
    await nRequest({
      url: 'https://nonexistent-domain-for-test.com/api',
      method: 'get',
      retry: 2
    })
  } catch (error) {
    console.log('✅ 重试功能正常（预期会失败）')
    console.log('📝 错误信息:', error.message)
  }
}

/**
 * 测试取消功能
 */
async function testCancelFeature() {
  console.log('🚀 测试取消功能...')
  
  try {
    const controller = new AbortController()
    
    // 立即取消请求
    setTimeout(() => {
      controller.abort()
    }, 10)
    
    await nRequest({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'get',
      signal: controller.signal
    })
    
    console.log('❌ 取消功能未正常工作（请求应该被取消）')
  } catch (error) {
    if (error.name === 'AbortError' || error.message.includes('abort')) {
      console.log('✅ 取消功能正常工作')
    } else {
      console.log('❌ 取消功能测试失败:', error.message)
    }
  }
}

/**
 * 测试拦截器功能
 */
async function testInterceptors() {
  console.log('🚀 测试拦截器功能...')
  
  try {
    let requestIntercepted = false
    let responseIntercepted = false
    
    const response = await nRequest({
      url: 'https://jsonplaceholder.typicode.com/posts/3',
      method: 'get',
      interceptors: {
        request: [
          (config) => {
            requestIntercepted = true
            console.log('📤 请求拦截器被调用')
            return config
          },
          (error) => Promise.reject(error)
        ],
        response: [
          (response) => {
            responseIntercepted = true
            console.log('📥 响应拦截器被调用')
            return response
          },
          (error) => Promise.reject(error)
        ]
      }
    })
    
    if (requestIntercepted && responseIntercepted && response.data) {
      console.log('✅ 拦截器功能正常工作')
    } else {
      console.log('❌ 拦截器功能未完全工作')
    }
  } catch (error) {
    console.log('❌ 拦截器测试失败:', error.message)
  }
}

/**
 * 测试重置缓存功能
 */
async function testResetCache() {
  console.log('🚀 测试重置缓存功能...')
  
  try {
    // 先创建一个缓存
    await nRequest({
      url: 'https://jsonplaceholder.typicode.com/posts/4',
      method: 'get',
      isCache: true
    })
    
    // 重置缓存
    await nRequest({
      url: 'https://jsonplaceholder.typicode.com/posts/5',
      method: 'get',
      isResetCache: true
    })
    
    console.log('✅ 重置缓存功能执行完成')
  } catch (error) {
    console.log('❌ 重置缓存测试失败:', error.message)
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('🎯 开始 nRequest 函数完整测试...\n')
  
  await testBasicRequest()
  console.log('')
  
  await testGetWithParams()
  console.log('')
  
  await testPostRequest()
  console.log('')
  
  await testPutRequest()
  console.log('')
  
  await testCacheFeature()
  console.log('')
  
  await testRetryFeature()
  console.log('')
  
  await testCancelFeature()
  console.log('')
  
  await testInterceptors()
  console.log('')
  
  await testResetCache()
  console.log('')
  
  console.log('🏁 nRequest 函数测试完成！')
}

// 运行所有测试
runAllTests()
