# getObjVal

`getObjVal` 是一个对象属性访问工具函数，用于根据路径字符串安全地获取嵌套对象的值。该函数支持点号分隔的路径和数组索引访问，并提供默认值机制。

## 使用方式

```javascript
import { getObjVal } from 'nice-helpers'
// 或者
import getObjVal from 'nice-helpers/getObjVal'
```

## API

### getObjVal(obj, path, defaultValue)

根据路径字符串获取对象的值，支持嵌套对象和数组索引。

**参数：**
- `obj` (any) - 目标对象
- `path` (string) - 路径字符串，支持点号分隔和数组索引，如 'a.b.c' 或 'a[0].b.c'
- `defaultValue` (any) - 默认值，当路径不存在时返回

**返回：**
- (any) - 获取到的值或默认值

## 基本用法

### 简单对象路径访问

```javascript
const obj = {
  user: {
    profile: {
      name: 'Alice',
      age: 25
    }
  }
}

// 获取嵌套属性
const name = getObjVal(obj, 'user.profile.name', null)
console.log(name) // 'Alice'

// 获取不存在的属性
const email = getObjVal(obj, 'user.profile.email', 'unknown')
console.log(email) // 'unknown'
```

### 数组索引访问

```javascript
const data = {
  users: [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 }
  ]
}

// 访问数组元素
const firstUser = getObjVal(data, 'users[0].name', null)
console.log(firstUser) // 'Alice'

const secondUserAge = getObjVal(data, 'users[1].age', 0)
console.log(secondUserAge) // 30
```

### 复杂嵌套结构

```javascript
const complexData = {
  company: {
    departments: [
      {
        name: 'Engineering',
        teams: [
          {
            name: 'Frontend',
            members: [
              { name: 'Alice', skills: ['React', 'Vue'] },
              { name: 'Bob', skills: ['Angular', 'TypeScript'] }
            ]
          }
        ]
      }
    ]
  }
}

// 深层嵌套访问
const skill = getObjVal(complexData, 'company.departments[0].teams[0].members[0].skills[1]', 'N/A')
console.log(skill) // 'Vue'

// 访问不存在的路径
const nonExistent = getObjVal(complexData, 'company.departments[1].name', 'Unknown')
console.log(nonExistent) // 'Unknown'
```

### 多维数组访问

```javascript
const matrix = {
  data: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ],
  nested: [
    [
      { value: 'a', index: 0 },
      { value: 'b', index: 1 }
    ],
    [
      { value: 'c', index: 2 },
      { value: 'd', index: 3 }
    ]
  ]
}

// 访问二维数组
const value = getObjVal(matrix, 'data[1][2]', 0)
console.log(value) // 6

// 访问嵌套对象数组
const nestedValue = getObjVal(matrix, 'nested[0][1].value', null)
console.log(nestedValue) // 'b'
```

## 边界情况处理

### 安全访问

```javascript
// 处理 null/undefined 对象
const result1 = getObjVal(null, 'a.b.c', 'default')
console.log(result1) // 'default'

const result2 = getObjVal(undefined, 'a.b.c', 'default')
console.log(result2) // 'default'

// 处理空路径
const result3 = getObjVal({ a: 1 }, '', 'default')
console.log(result3) // 'default'

// 处理无效路径类型
const result4 = getObjVal({ a: 1 }, null, 'default')
console.log(result4) // 'default'
```

### 特殊值处理

```javascript
const obj = {
  zero: 0,
  false: false,
  empty: '',
  nullValue: null,
  undefinedValue: undefined
}

// 正确返回 falsy 值
console.log(getObjVal(obj, 'zero', 'default'))      // 0
console.log(getObjVal(obj, 'false', 'default'))     // false
console.log(getObjVal(obj, 'empty', 'default'))     // ''
console.log(getObjVal(obj, 'nullValue', 'default')) // null
console.log(getObjVal(obj, 'undefinedValue', 'default')) // undefined
```

## 实际应用场景

### API 响应数据处理

```javascript
// 处理可能不完整的 API 响应
const apiResponse = {
  data: {
    user: {
      profile: {
        avatar: 'https://example.com/avatar.jpg'
      }
    }
  }
}

// 安全获取用户头像，提供默认值
const avatar = getObjVal(apiResponse, 'data.user.profile.avatar', '/default-avatar.png')
const username = getObjVal(apiResponse, 'data.user.profile.username', 'Anonymous')
```

### 配置对象访问

```javascript
// 访问配置对象
const config = {
  app: {
    theme: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d'
      }
    },
    features: [
      { name: 'darkMode', enabled: true },
      { name: 'notifications', enabled: false }
    ]
  }
}

// 获取主题色
const primaryColor = getObjVal(config, 'app.theme.colors.primary', '#000000')

// 检查功能是否启用
const darkModeEnabled = getObjVal(config, 'app.features[0].enabled', false)
```

## 注意事项

1. **路径格式**：支持点号分隔（`a.b.c`）和数组索引（`a[0].b`）的混合使用
2. **类型安全**：函数会检查每一层的类型，确保安全访问
3. **性能考虑**：对于频繁访问的路径，建议缓存结果
4. **默认值**：当路径不存在时，总是返回提供的默认值
5. **数组索引**：只支持数字索引，不支持负数索引

## 相关函数

- [`deepClone`](./deepClone.md) - 深拷贝对象
- [`is`](./is.md) - 类型检查工具