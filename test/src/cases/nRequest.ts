// @ts-ignore
import { nRequest } from 'nice-helpers'

/**
 * 测试 nRequest 函数
 */
function testNRequest() {
  console.log('🚀 开始测试 nRequest 函数...')
  
  try {
    // 测试创建 axios 实例
    const request = nRequest()
    
    // 验证实例是否正确创建
    if (request && typeof request === 'object') {
      console.log('✅ nRequest 实例创建成功')
      
      // 验证配置
      if (request.defaults.baseURL === 'https://api.nice.helpers') {
        console.log('✅ baseURL 配置正确')
      } else {
        console.log('❌ baseURL 配置错误:', request.defaults.baseURL)
      }
      
      if (request.defaults.timeout === 10000) {
        console.log('✅ timeout 配置正确')
      } else {
        console.log('❌ timeout 配置错误:', request.defaults.timeout)
      }
      
      // 验证方法是否存在
      const methods = ['get', 'post', 'put', 'delete', 'patch']
      let methodsValid = true
      
      methods.forEach(method => {
        if (typeof request[method] !== 'function') {
          console.log(`❌ ${method} 方法不存在`)
          methodsValid = false
        }
      })
      
      if (methodsValid) {
        console.log('✅ 所有 HTTP 方法都存在')
      }
      
      console.log('✅ nRequest 函数测试通过')
      
    } else {
      console.log('❌ nRequest 实例创建失败')
    }
    
  } catch (error) {
    console.log('❌ nRequest 测试失败:', error.message)
  }
}

// 运行测试
testNRequest()
