// @ts-ignore
import { deepClone } from 'nice-helpers'

/**
 * 简单的测试断言函数
 */
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
    },
    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`)
      }
    },
    toBeInstanceOf(expectedClass: any) {
      if (!(actual instanceof expectedClass)) {
        throw new Error(`Expected ${actual} to be instance of ${expectedClass.name}`)
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected ${actual} to be null`)
      }
    },
    toBeUndefined() {
      if (actual !== undefined) {
        throw new Error(`Expected ${actual} to be undefined`)
      }
    }
  }
}

/**
 * 测试基本数据类型的克隆
 */
function testPrimitiveTypes() {
  // 测试 null 和 undefined
  expect(deepClone(null)).toBeNull()
  expect(deepClone(undefined)).toBeUndefined()
  
  // 测试基本类型
  expect(deepClone(42)).toBe(42)
  expect(deepClone('hello')).toBe('hello')
  expect(deepClone(true)).toBe(true)
  expect(deepClone(false)).toBe(false)
  
  console.log('✓ Primitive types test passed')
}

/**
 * 测试 Date 对象的克隆
 */
function testDateCloning() {
  const originalDate = new Date('2023-01-01T00:00:00.000Z')
  const clonedDate = deepClone(originalDate)
  
  expect(clonedDate).toBeInstanceOf(Date)
  expect(clonedDate.getTime()).toBe(originalDate.getTime())
  expect(clonedDate).notToBe(originalDate)
  
  console.log('✓ Date cloning test passed')
}

/**
 * 测试 RegExp 对象的克隆
 */
function testRegExpCloning() {
  const originalRegex = /test/gi
  const clonedRegex = deepClone(originalRegex)
  
  expect(clonedRegex).toBeInstanceOf(RegExp)
  expect(clonedRegex.source).toBe(originalRegex.source)
  expect(clonedRegex.flags).toBe(originalRegex.flags)
  expect(clonedRegex).notToBe(originalRegex)
  
  console.log('✓ RegExp cloning test passed')
}

/**
 * 测试 Error 对象的克隆
 */
function testErrorCloning() {
  const originalError = new Error('Test error message')
  originalError.name = 'CustomError'
  const clonedError = deepClone(originalError)
  
  expect(clonedError).toBeInstanceOf(Error)
  expect(clonedError.message).toBe(originalError.message)
  expect(clonedError.name).toBe(originalError.name)
  expect(clonedError).notToBe(originalError)
  
  console.log('✓ Error cloning test passed')
}

/**
 * 测试 Map 对象的克隆
 */
function testMapCloning() {
  const originalMap = new Map()
  originalMap.set('key1', 'value1')
  originalMap.set('key2', { nested: 'object' })
  originalMap.set(42, 'number key')
  
  const clonedMap = deepClone(originalMap)
  
  expect(clonedMap).toBeInstanceOf(Map)
  expect(clonedMap.size).toBe(originalMap.size)
  expect(clonedMap.get('key1')).toBe('value1')
  expect(clonedMap.get('key2')).notToBe(originalMap.get('key2')) // 深拷贝
  expect(clonedMap.get(42)).toBe('number key')
  expect(clonedMap).notToBe(originalMap)
  
  console.log('✓ Map cloning test passed')
}

/**
 * 测试 Set 对象的克隆
 */
function testSetCloning() {
  const originalSet = new Set()
  originalSet.add('value1')
  originalSet.add(42)
  originalSet.add({ nested: 'object' })
  
  const clonedSet = deepClone(originalSet)
  
  expect(clonedSet).toBeInstanceOf(Set)
  expect(clonedSet.size).toBe(originalSet.size)
  expect(clonedSet.has('value1')).toBe(true)
  expect(clonedSet.has(42)).toBe(true)
  expect(clonedSet).notToBe(originalSet)
  
  console.log('✓ Set cloning test passed')
}

/**
 * 测试 ArrayBuffer 的克隆
 */
function testArrayBufferCloning() {
  const originalBuffer = new ArrayBuffer(16)
  const view = new Uint8Array(originalBuffer)
  view[0] = 42
  view[1] = 24
  
  const clonedBuffer = deepClone(originalBuffer)
  const clonedView = new Uint8Array(clonedBuffer)
  
  expect(clonedBuffer).toBeInstanceOf(ArrayBuffer)
  expect(clonedBuffer.byteLength).toBe(originalBuffer.byteLength)
  expect(clonedView[0]).toBe(42)
  expect(clonedView[1]).toBe(24)
  expect(clonedBuffer).notToBe(originalBuffer)
  
  console.log('✓ ArrayBuffer cloning test passed')
}

/**
 * 测试 TypedArray 的克隆
 */
function testTypedArrayCloning() {
  const originalArray = new Uint8Array([1, 2, 3, 4, 5])
  const clonedArray = deepClone(originalArray)
  
  expect(clonedArray).toBeInstanceOf(Uint8Array)
  expect(clonedArray.length).toBe(originalArray.length)
  expect(clonedArray[0]).toBe(1)
  expect(clonedArray[4]).toBe(5)
  expect(clonedArray).notToBe(originalArray)
  
  console.log('✓ TypedArray cloning test passed')
}

/**
 * 测试普通数组的克隆
 */
function testArrayCloning() {
  const originalArray = [1, 'string', { nested: true }, [1, 2, 3]]
  const clonedArray = deepClone(originalArray)
  
  expect(Array.isArray(clonedArray)).toBe(true)
  expect(clonedArray.length).toBe(originalArray.length)
  expect(clonedArray[0]).toBe(1)
  expect(clonedArray[1]).toBe('string')
  expect(clonedArray[2]).notToBe(originalArray[2]) // 深拷贝
  expect(clonedArray[3]).notToBe(originalArray[3]) // 深拷贝
  expect(clonedArray).notToBe(originalArray)
  
  console.log('✓ Array cloning test passed')
}

/**
 * 测试普通对象的克隆
 */
function testObjectCloning() {
  const originalObj = {
    name: 'test',
    age: 25,
    nested: {
      value: 42,
      array: [1, 2, 3]
    }
  }
  
  const clonedObj = deepClone(originalObj)
  
  expect(clonedObj.name).toBe('test')
  expect(clonedObj.age).toBe(25)
  expect(clonedObj.nested).notToBe(originalObj.nested) // 深拷贝
  expect(clonedObj.nested.value).toBe(42)
  expect(clonedObj.nested.array).notToBe(originalObj.nested.array) // 深拷贝
  expect(clonedObj).notToBe(originalObj)
  
  console.log('✓ Object cloning test passed')
}

/**
 * 测试 Symbol 属性的克隆
 */
function testSymbolProperties() {
  const sym = Symbol('test')
  const originalObj = {
    normalProp: 'value',
    [sym]: 'symbol value'
  }
  
  // 使 Symbol 属性可枚举
  Object.defineProperty(originalObj, sym, {
    value: 'symbol value',
    enumerable: true,
    writable: true,
    configurable: true
  })
  
  const clonedObj = deepClone(originalObj)
  
  expect(clonedObj.normalProp).toBe('value')
  expect(clonedObj[sym]).toBe('symbol value')
  expect(clonedObj).notToBe(originalObj)
  
  console.log('✓ Symbol properties test passed')
}

/**
 * 测试循环引用 - 对象
 */
function testCircularReferencesInObjects() {
  const obj: any = { name: 'test' }
  obj.self = obj
  
  const cloned = deepClone(obj)
  
  expect(cloned.name).toBe('test')
  expect(cloned.self).toBe(cloned)
  expect(cloned === obj).toBe(false)
  console.log('✓ Circular references in objects test passed')
}

/**
 * 测试循环引用 - 数组
 */
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

/**
 * 测试嵌套循环引用
 */
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

/**
 * 测试复杂嵌套结构
 */
function testComplexNestedStructure() {
  const complexObj = {
    date: new Date('2023-01-01'),
    regex: /test/gi,
    map: new Map([['key1', 'value1'], ['key2', { nested: true }]]),
    set: new Set([1, 2, { value: 'test' }]),
    array: [1, 2, { nested: [4, 5, 6] }],
    nested: {
      level1: {
        level2: {
          value: 'deep value'
        }
      }
    }
  }
  
  const cloned = deepClone(complexObj)
  
  expect(cloned.date).toBeInstanceOf(Date)
  expect(cloned.date).notToBe(complexObj.date)
  expect(cloned.regex).toBeInstanceOf(RegExp)
  expect(cloned.regex).notToBe(complexObj.regex)
  expect(cloned.map).toBeInstanceOf(Map)
  expect(cloned.map).notToBe(complexObj.map)
  expect(cloned.set).toBeInstanceOf(Set)
  expect(cloned.set).notToBe(complexObj.set)
  expect(cloned.nested.level1.level2.value).toBe('deep value')
  expect(cloned.nested).notToBe(complexObj.nested)
  
  console.log('✓ Complex nested structure test passed')
}

/**
 * 运行所有测试
 */
function runAllTests() {
  const tests = [
    testPrimitiveTypes,
    testDateCloning,
    testRegExpCloning,
    testErrorCloning,
    testMapCloning,
    testSetCloning,
    testArrayBufferCloning,
    testTypedArrayCloning,
    testArrayCloning,
    testObjectCloning,
    testSymbolProperties,
    testCircularReferencesInObjects,
    testCircularReferencesInArrays,
    testNestedCircularReferences,
    testComplexNestedStructure
  ]
  
  console.log('🚀 开始运行 deepClone 测试用例...\n')
  
  let passedTests = 0
  let failedTests = 0
  
  for (const test of tests) {
    try {
      test()
      passedTests++
    } catch (error) {
      console.error(`❌ ${test.name} failed:`, error.message)
      failedTests++
    }
  }
  
  console.log(`\n📊 测试结果: ${passedTests} 通过, ${failedTests} 失败`)
  
  if (failedTests === 0) {
    console.log('🎉 所有测试都通过了!')
  } else {
    console.log('⚠️ 有测试失败，请检查代码')
  }
}

// 运行测试
runAllTests()