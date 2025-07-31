# deepClone

`deepClone` 是一个深拷贝工具函数，用于创建对象的深层副本。该函数能够正确处理循环引用，避免无限递归。

## 使用方式

```javascript
import { deepClone } from 'nice-helpers'
// 或者
import deepClone from 'nice-helpers/deepClone'
```

## API

### deepClone(obj)

创建对象的深层副本。

**参数：**
- `obj` (any) - 要拷贝的对象

**返回：**
- (any) - 对象的深层副本

**示例：**
```javascript
const original = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4]
  }
}

const cloned = deepClone(original)

console.log(cloned) // { a: 1, b: { c: 2, d: [3, 4] } }
console.log(cloned === original) // false
console.log(cloned.b === original.b) // false
console.log(cloned.b.d === original.b.d) // false
```

### 循环引用处理

`deepClone` 函数能够正确处理对象和数组中的循环引用：

```javascript
// 对象中的循环引用
const obj = { name: 'test' }
obj.self = obj

const cloned = deepClone(obj)
console.log(cloned.self === cloned) // true

// 数组中的循环引用
const arr = [1, 2, 3]
arr.push(arr)

const clonedArr = deepClone(arr)
console.log(clonedArr[3] === clonedArr) // true
```