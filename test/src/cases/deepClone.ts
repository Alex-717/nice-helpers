// @ts-ignore
import { deepClone } from 'nice-helpers'
// 简单的测试函数
function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`)
      }
    },
    notToBe(expected: any) {
      if (actual === expected) {
        throw new Error(`Expected ${actual} not to be ${expected}`)
      }
    }
  }
}

// 测试用例
function testCircularReferencesInObjects() {
  const obj: any = { name: 'test' }
  obj.self = obj
  
  const cloned = deepClone(obj)
  
  expect(cloned.name).toBe('test')
  expect(cloned.self).toBe(cloned)
  expect(cloned === obj).toBe(false)
  console.log('✓ Circular references in objects test passed')
}

function testCircularReferencesInArrays() {
  const arr: any[] = [1, 2, 3]
  arr.push(arr)
  
  const cloned = deepClone(arr)
  
  expect(cloned[0]).toBe(1)
  expect(cloned[1]).toBe(2)
  expect(cloned[2]).toBe(3)
  expect(cloned[3]).toBe(cloned)
  expect(cloned === arr).toBe(false)
  console.log('✓ Circular references in arrays test passed')
}

function testNestedCircularReferences() {
  const obj1: any = { name: 'obj1' }
  const obj2: any = { name: 'obj2' }
  
  obj1.ref = obj2
  obj2.ref = obj1
  
  const cloned = deepClone({ obj1, obj2 })
  
  expect(cloned.obj1.name).toBe('obj1')
  expect(cloned.obj2.name).toBe('obj2')
  expect(cloned.obj1.ref).toBe(cloned.obj2)
  expect(cloned.obj2.ref).toBe(cloned.obj1)
  expect(cloned.obj1 === obj1).toBe(false)
  expect(cloned.obj2 === obj2).toBe(false)
  console.log('✓ Nested circular references test passed')
}

// 运行测试
try {
  testCircularReferencesInObjects()
  testCircularReferencesInArrays()
  testNestedCircularReferences()
  console.log('All tests passed!')
} catch (error) {
  console.error('Test failed:', error)
}