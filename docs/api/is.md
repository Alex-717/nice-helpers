# is

`is` 是一个类型检查工具函数集合，用于检查变量的类型。

## 使用方式

```javascript
import { is } from 'nice-helpers'
// 或者
import is from 'nice-helpers/is'
```

## API

### isTrue(value)

检查值是否为 true。

**参数：**
- `value` (any) - 要检查的值

**返回：**
- (boolean) - 如果值严格等于 true 则返回 true，否则返回 false

**示例：**
```javascript
isTrue(true) // true
isTrue(1) // false
```

### isFalse(value)

检查值是否为 false。

**参数：**
- `value` (any) - 要检查的值

**返回：**
- (boolean) - 如果值严格等于 false 则返回 true，否则返回 false

**示例：**
```javascript
isFalse(false) // true
isFalse(0) // false
```

### isUndef(value)

检查值是否为 undefined 或 null。

**参数：**
- `value` (any) - 要检查的值

**返回：**
- (boolean) - 如果值是 undefined 或 null 则返回 true，否则返回 false

**示例：**
```javascript
isUndef(undefined) // true
isUndef(null) // true
isUndef('') // false
```

### isDef(value)

检查值是否已定义（不为 undefined 且不为 null）。

**参数：**
- `value` (any) - 要检查的值

**返回：**
- (boolean) - 如果值不为 undefined 且不为 null 则返回 true，否则返回 false

**示例：**
```javascript
isDef(0) // true
isDef('') // true
isDef(null) // false
isDef(undefined) // false
```

### isObject(value)

检查值是否为对象类型（不包括 null）。

**参数：**
- `value` (any) - 要检查的值

**返回：**
- (boolean) - 如果值是对象则返回 true，否则返回 false

**示例：**
```javascript
isObject({}) // true
isObject(null) // false
isObject([]) // true
```

### isPrimitive(value)

检查值是否为原始类型（string, number, symbol, boolean）。

**参数：**
- `value` (any) - 要检查的值

**返回：**
- (boolean) - 如果值是原始类型则返回 true，否则返回 false

**示例：**
```javascript
isPrimitive('hello') // true
isPrimitive(123) // true
isPrimitive({}) // false
```

### isFunction(value)

检查值是否为函数类型。

**参数：**
- `value` (any) - 要检查的值

**返回：**
- (boolean) - 如果值是函数则返回 true，否则返回 false

**示例：**
```javascript
isFunction(() => {}) // true
isFunction({}) // false
```

### isPromise(value)

检查值是否为 Promise 对象。

**参数：**
- `value` (any) - 要检查的值

**返回：**
- (boolean) - 如果值是 Promise 对象则返回 true，否则返回 false

**示例：**
```javascript
isPromise(new Promise(() => {})) // true
isPromise({}) // false
```

### toRawType(value)

获取值的原始类型字符串。

**参数：**
- `value` (any) - 要检查的值

**返回：**
- (string) - 返回值的原始类型字符串，如 'string', 'number', 'object', 'array' 等

**示例：**
```javascript
toRawType('hello') // 'string'
toRawType(123) // 'number'
toRawType({}) // 'object'
```

### hasOwnProp(obj, key)

检查对象是否具有指定的自有属性。

**参数：**
- `obj` (object) - 要检查的对象
- `key` (string) - 要检查的属性名

**返回：**
- (boolean) - 如果对象具有指定的自有属性则返回 true，否则返回 false

**示例：**
```javascript
hasOwnProp({ a: 1 }, 'a') // true
hasOwnProp({ a: 1 }, 'b') // false
```

### isMobile(str)

检查字符串是否为有效的中国手机号。

**参数：**
- `str` (string) - 要检查的字符串

**返回：**
- (boolean) - 如果字符串是有效的中国手机号则返回 true，否则返回 false

**示例：**
```javascript
isMobile('13812345678') // true
isMobile('12345') // false
```

### isEmail(str)

检查字符串是否为有效的邮箱地址。

**参数：**
- `str` (string) - 要检查的字符串

**返回：**
- (boolean) - 如果字符串是有效的邮箱地址则返回 true，否则返回 false

**示例：**
```javascript
isEmail('test@example.com') // true
isEmail('invalid.email') // false
```

### isNative(Ctor)

检查构造函数是否为原生函数。

**参数：**
- `Ctor` (function) - 要检查的构造函数

**返回：**
- (boolean) - 如果构造函数是原生函数则返回 true，否则返回 false

**示例：**
```javascript
isNative(Array) // true
isNative(function() {}) // false
```

### isInBrowser

检查当前环境是否为浏览器环境。

**返回：**
- (boolean) - 如果当前环境是浏览器则返回 true，否则返回 false

**示例：**
```javascript
isInBrowser // true (在浏览器环境中)
```