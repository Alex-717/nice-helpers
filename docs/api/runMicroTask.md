# runMicroTask

`runMicroTask` 是一个微任务执行工具函数，用于将函数推迟到微任务队列中执行。

## 使用方式

```javascript
import { runMicroTask } from 'nice-helpers'
// 或者
import runMicroTask from 'nice-helpers/runMicroTask'
```

## API

### runMicroTask(callback)

将回调函数推迟到微任务队列中执行。

**参数：**
- `callback` (function) - 要执行的回调函数

**返回：**
- (void)

**示例：**
```javascript
console.log('start')
runMicroTask(() => {
  console.log('microtask')
})
console.log('end')

// 输出顺序：
// start
// end
// microtask
```