// @ts-ignore
import { getObjVal } from 'nice-helpers'

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
 * 测试基本对象路径访问
 */
function testBasicObjectPath() {
  const obj = {
    a: {
      b: {
        c: 'value'
      }
    }
  }
  
  expect(getObjVal(obj, 'a.b.c', null)).toBe('value')
  expect(getObjVal(obj, 'a.b', null)).toBe(obj.a.b)
  expect(getObjVal(obj, 'a', null)).toBe(obj.a)
  
  console.log('✓ Basic object path test passed')
}

/**
 * 测试数组索引路径访问
 */
function testArrayIndexPath() {
  const obj = {
    a: [
      { b: { c: 'arrayValue0' } },
      { b: { c: 'arrayValue1' } }
    ]
  }
  
  expect(getObjVal(obj, 'a[0].b.c', null)).toBe('arrayValue0')
  expect(getObjVal(obj, 'a[1].b.c', null)).toBe('arrayValue1')
  expect(getObjVal(obj, 'a[0].b', null)).toBe(obj.a[0].b)
  expect(getObjVal(obj, 'a[0]', null)).toBe(obj.a[0])
  
  console.log('✓ Array index path test passed')
}

/**
 * 测试复杂嵌套结构
 */
function testComplexNestedStructure() {
  const obj = {
    users: [
      {
        name: 'Alice',
        profile: {
          settings: {
            theme: 'dark'
          }
        },
        posts: [
          { title: 'Post 1', tags: ['js', 'ts'] },
          { title: 'Post 2', tags: ['vue', 'react'] }
        ]
      },
      {
        name: 'Bob',
        profile: {
          settings: {
            theme: 'light'
          }
        }
      }
    ]
  }
  
  expect(getObjVal(obj, 'users[0].name', null)).toBe('Alice')
  expect(getObjVal(obj, 'users[0].profile.settings.theme', null)).toBe('dark')
  expect(getObjVal(obj, 'users[0].posts[0].title', null)).toBe('Post 1')
  expect(getObjVal(obj, 'users[0].posts[1].tags[0]', null)).toBe('vue')
  expect(getObjVal(obj, 'users[1].name', null)).toBe('Bob')
  expect(getObjVal(obj, 'users[1].profile.settings.theme', null)).toBe('light')
  
  console.log('✓ Complex nested structure test passed')
}

/**
 * 测试不存在的路径
 */
function testNonExistentPaths() {
  const obj = {
    a: {
      b: [
        { c: 'value' }
      ]
    }
  }
  
  expect(getObjVal(obj, 'a.b.c', 'default')).toBe('default')
  expect(getObjVal(obj, 'a.b[1].c', 'default')).toBe('default')
  expect(getObjVal(obj, 'a.x.y', 'default')).toBe('default')
  expect(getObjVal(obj, 'x.y.z', 'default')).toBe('default')
  expect(getObjVal(obj, 'a.b[0].x', 'default')).toBe('default')
  
  console.log('✓ Non-existent paths test passed')
}

/**
 * 测试边界情况
 */
function testEdgeCases() {
  // 测试 null/undefined 对象
  expect(getObjVal(null, 'a.b.c', 'default')).toBe('default')
  expect(getObjVal(undefined, 'a.b.c', 'default')).toBe('default')
  
  // 测试空路径
  expect(getObjVal({ a: 1 }, '', 'default')).toBe('default')
  
  // 测试非字符串路径
  expect(getObjVal({ a: 1 }, null as any, 'default')).toBe('default')
  expect(getObjVal({ a: 1 }, undefined as any, 'default')).toBe('default')
  
  // 测试值为 0、false、空字符串的情况
  const obj = {
    zero: 0,
    false: false,
    empty: '',
    nullValue: null,
    undefinedValue: undefined
  }
  
  expect(getObjVal(obj, 'zero', 'default')).toBe(0)
  expect(getObjVal(obj, 'false', 'default')).toBe(false)
  expect(getObjVal(obj, 'empty', 'default')).toBe('')
  expect(getObjVal(obj, 'nullValue', 'default')).toBeNull()
  expect(getObjVal(obj, 'undefinedValue', 'default')).toBeUndefined()
  
  console.log('✓ Edge cases test passed')
}

/**
 * 测试多维数组
 */
function testMultiDimensionalArray() {
  const obj = {
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    nested: [
      [
        { value: 'a' },
        { value: 'b' }
      ],
      [
        { value: 'c' },
        { value: 'd' }
      ]
    ]
  }
  
  expect(getObjVal(obj, 'matrix[0][1]', null)).toBe(2)
  expect(getObjVal(obj, 'matrix[2][2]', null)).toBe(9)
  expect(getObjVal(obj, 'nested[0][1].value', null)).toBe('b')
  expect(getObjVal(obj, 'nested[1][0].value', null)).toBe('c')
  
  console.log('✓ Multi-dimensional array test passed')
}

/**
 * 运行所有测试
 */
function runAllTests() {
  const tests = [
    testBasicObjectPath,
    testArrayIndexPath,
    testComplexNestedStructure,
    testNonExistentPaths,
    testEdgeCases,
    testMultiDimensionalArray
  ]
  
  console.log('🚀 开始运行 getObjVal 测试用例...\n')
  
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
