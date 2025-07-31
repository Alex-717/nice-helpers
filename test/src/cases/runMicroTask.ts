// @ts-ignore
import { runMicroTask } from 'nice-helpers'

// 测试数据
const testCallback = () => {
  console.log('Microtask executed')
}

// 执行微任务
runMicroTask(testCallback)

// 验证微任务是否正确执行
console.log('Microtask scheduled')