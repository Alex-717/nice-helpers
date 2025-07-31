// @ts-ignore
import { deepClone } from 'nice-helpers'

// 测试数据
const testData = {
  name: 'test',
  age: 18,
  address: {
    city: 'Beijing',
    street: 'Chaoyang Road'
  },
  hobbies: ['reading', 'coding'],
  birthday: new Date('2000-01-01')
}

// 执行深拷贝
const clonedData = deepClone(testData)

// 验证拷贝结果
console.log('原始数据:', testData)
console.log('拷贝数据:', clonedData)
console.log('是否为同一对象:', testData === clonedData)
console.log('address是否为同一对象:', testData.address === clonedData.address)
console.log('hobbies是否为同一对象:', testData.hobbies === clonedData.hobbies)
console.log('birthday是否为同一对象:', testData.birthday === clonedData.birthday)
