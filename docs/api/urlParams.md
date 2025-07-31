# urlParams

`urlParams` 是一个 URL 参数处理工具函数，用于解析和生成 URL 参数。

## 使用方式

```javascript
import { getParam, setParam } from 'nice-helpers'
// 或者
import { getParam, setParam } from 'nice-helpers/urlParams'
```

## API

### hasURLFunction

检查当前环境是否支持 URL 构造函数。

**返回：**
- (boolean) - 如果支持 URL 构造函数则返回 true，否则返回 false

**示例：**
```javascript
hasURLFunction // true (在支持 URL 构造函数的环境中)
```

### hasLocation

检查当前环境是否具有 location 对象。

**返回：**
- (boolean) - 如果具有 location 对象则返回 true，否则返回 false

**示例：**
```javascript
hasLocation // true (在浏览器环境中)
```

### getParam(name, url)

获取 URL 中指定名称的参数值。

**参数：**
- `name` (string) - 要获取的参数名称
- `url` (string, optional) - 要解析的 URL，默认为当前页面 URL

**返回：**
- (string) - 参数值，如果不存在则返回空字符串

**示例：**
```javascript
const value = getParam('name', 'https://example.com/?name=John')
console.log(value) // 'John'
```

### setParam(name, val, url)

设置 URL 中指定名称的参数值。

**参数：**
- `name` (string) - 要设置的参数名称
- `val` (string) - 要设置的参数值
- `url` (string) - 要修改的 URL

**返回：**
- (string|boolean) - 修改后的 URL，如果 URL 无效则返回 false

**示例：**
```javascript
const newUrl = setParam('name', 'John', 'https://example.com/')
console.log(newUrl) // 'https://example.com/?name=John'
```