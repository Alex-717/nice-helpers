# nRequest

`nRequest` 是一个增强的网络请求函数，基于 axios 封装，提供了缓存、重试、取消请求等高级功能。

## 使用方式

```javascript
import { nRequest } from 'nice-helpers'
// 或者
import nRequest from 'nice-helpers/nRequest'
```

## 功能特性

- ✅ **智能缓存** - 支持 LRU 缓存策略，自动跳过文件上传请求
- ✅ **自动重试** - 支持失败重试机制，智能判断是否应该重试
- ✅ **请求取消** - 支持 AbortController 取消请求
- ✅ **自定义拦截器** - 支持请求和响应拦截器
- ✅ **缓存管理** - 支持重置缓存，LRU 淘汰策略
- ✅ **文件检测** - 自动检测嵌套对象中的文件，避免缓存文件上传请求

## API

### nRequest(config)

发送网络请求。

**参数：**
- `config` (INRequestConfig) - 请求配置对象

**配置选项：**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `url` | string | - | 请求的 URL 地址（必填） |
| `method` | 'get' \| 'post' \| 'put' \| 'delete' | 'POST' | 请求方法 |
| `data` | any | - | 请求数据 |
| `headers` | object | {} | 请求头配置 |
| `timeout` | number | 8000 | 请求超时时间（毫秒） |
| `retry` | number | 0 | 失败重试次数 |
| `needCache` | boolean | false | 是否启用缓存 |
| `isResetCache` | boolean | false | 是否重置所有缓存 |
| `signal` | AbortSignal | - | AbortController 的 signal |
| `interceptors` | object | - | 拦截器配置 |

**拦截器配置：**
```typescript
interceptors?: {
  request?: [(config: any) => any, (error: any) => any]
  response?: [(response: any) => any, (error: any) => any]
}
```

**返回：**
- (Promise\<AxiosResponse\>) - 返回 axios 响应对象

## 使用示例

### 基本请求

```javascript
// GET 请求
const response = await nRequest({
  url: 'https://api.example.com/users',
  method: 'get'
})

// POST 请求
const response = await nRequest({
  url: 'https://api.example.com/users',
  method: 'post',
  data: {
    name: 'John',
    email: 'john@example.com'
  }
})
```

### 启用缓存

```javascript
// 启用缓存，相同请求会直接返回缓存结果
const response = await nRequest({
  url: 'https://api.example.com/users',
  method: 'get',
  needCache: true
})

// 第二次相同请求会直接返回缓存
const cachedResponse = await nRequest({
  url: 'https://api.example.com/users',
  method: 'get',
  needCache: true
})
```

### 重试机制

```javascript
// 失败时自动重试 3 次
const response = await nRequest({
  url: 'https://api.example.com/unstable-endpoint',
  method: 'get',
  retry: 3
})
```

### 请求取消

```javascript
const controller = new AbortController()

// 5 秒后取消请求
setTimeout(() => {
  controller.abort()
}, 5000)

try {
  const response = await nRequest({
    url: 'https://api.example.com/slow-endpoint',
    method: 'get',
    signal: controller.signal
  })
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('请求已取消')
  }
}

### 使用拦截器

```javascript
const response = await nRequest({
  url: 'https://api.example.com/protected',
  method: 'get',
  interceptors: {
    request: [
      // 请求拦截器
      (config) => {
        config.headers.Authorization = 'Bearer ' + getToken()
        return config
      },
      (error) => Promise.reject(error)
    ],
    response: [
      // 响应拦截器
      (response) => {
        console.log('请求成功:', response.status)
        return response
      },
      (error) => {
        console.error('请求失败:', error.message)
        return Promise.reject(error)
      }
    ]
  }
})
```

### 文件上传

```javascript
// 文件上传请求会自动跳过缓存
const formData = new FormData()
formData.append('file', file)
formData.append('name', 'document')

const response = await nRequest({
  url: 'https://api.example.com/upload',
  method: 'post',
  data: formData,
  needCache: true  // 即使设置为 true，也不会缓存文件上传请求
})

// 包含文件的对象也会跳过缓存
const response2 = await nRequest({
  url: 'https://api.example.com/upload',
  method: 'post',
  data: {
    user: { name: 'John' },
    files: [file1, file2]  // 嵌套的文件会被检测到
  },
  needCache: true  // 不会缓存
})
```

### 缓存管理

```javascript
// 重置所有缓存
await nRequest({
  url: 'https://api.example.com/any-endpoint',
  method: 'get',
  isResetCache: true
})

// 缓存会自动使用 LRU 策略，最多保留 10 个缓存项
// 当缓存超过限制时，最久未使用的缓存会被自动删除
```

## 缓存机制

### 缓存键生成

缓存键基于以下信息生成 MD5 哈希：
- 请求 URL
- 请求方法
- 请求数据（如果有）

```javascript
// 相同的请求参数会生成相同的缓存键
const key1 = MD5('https://api.example.com/users-get-{"page":1}')
const key2 = MD5('https://api.example.com/users-get-{"page":1}')
// key1 === key2
```

### 缓存策略

1. **自动跳过文件上传**：包含 File、Blob、FormData 的请求不会被缓存
2. **LRU 淘汰**：最多保留 10 个缓存项，超出时删除最久未使用的缓存
3. **深度文件检测**：递归检测嵌套对象和数组中的文件对象
4. **循环引用保护**：自动检测并处理循环引用的对象

## 重试机制

### 重试条件

以下情况**不会**重试：
- 用户主动取消请求（AbortError）

其他网络错误和服务器错误会自动重试。

### 重试参数验证

```javascript
// ✅ 正确的重试参数
nRequest({ url: '/api', retry: 3 })     // 重试 3 次
nRequest({ url: '/api', retry: 0 })     // 不重试

// ❌ 错误的重试参数
nRequest({ url: '/api', retry: -1 })    // 抛出错误：retry 必须是非负整数
nRequest({ url: '/api', retry: 1.5 })   // 抛出错误：retry 必须是非负整数
```

## 错误处理

```javascript
try {
  const response = await nRequest({
    url: 'https://api.example.com/data',
    method: 'get',
    retry: 2
  })
  console.log(response.data)
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('请求被取消')
  } else if (error.code === 'ECONNABORTED') {
    console.log('请求超时')
  } else {
    console.error('请求失败:', error.message)
  }
}
```

## 注意事项

1. **缓存限制**：最多保留 10 个缓存项，使用 LRU 策略自动淘汰
2. **文件上传**：包含文件的请求会自动跳过缓存，即使设置了 `needCache: true`
3. **重试验证**：retry 参数必须是非负整数，否则会抛出错误
4. **循环引用**：如果请求数据包含循环引用，会自动跳过缓存并输出警告
5. **拦截器作用域**：拦截器只对当前请求生效，不会影响其他请求

## TypeScript 支持

```typescript
import { nRequest, INRequestConfig } from 'nice-helpers'

const config: INRequestConfig = {
  url: 'https://api.example.com/users',
  method: 'get',
  needCache: true,
  retry: 3
}

const response = await nRequest(config)
```