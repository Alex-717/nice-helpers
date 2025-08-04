/**
 * 深拷贝函数
 * 支持对象、数组、Date、Map、Set、RegExp、Error 等类型的深度克隆
 * @param obj 需要深拷贝的对象
 * @param visited 用于跟踪已拷贝对象的WeakMap，防止循环引用
 * @returns 深拷贝后的对象
 */
function deepClone<T>(obj: T, visited: WeakMap<any, any> = new WeakMap()): T {
  // 处理 null 或 undefined
  if (obj === null || obj === undefined) {
    return obj
  }

  // 处理基本数据类型
  if (typeof obj !== 'object') {
    return obj
  }

  // 检查是否已拷贝过该对象（处理循环引用）
  if (visited.has(obj)) {
    return visited.get(obj) as T
  }

  // 处理日期对象
  if (obj instanceof Date) {
    const clonedDate = new Date(obj.getTime())
    visited.set(obj, clonedDate)
    return clonedDate as any
  }

  // 处理正则表达式
  if (obj instanceof RegExp) {
    const clonedRegExp = new RegExp(obj.source, obj.flags)
    visited.set(obj, clonedRegExp)
    return clonedRegExp as any
  }

  // 处理错误对象
  if (obj instanceof Error) {
    const clonedError = new Error(obj.message)
    clonedError.name = obj.name
    clonedError.stack = obj.stack
    visited.set(obj, clonedError)
    return clonedError as any
  }

  // 处理 Map 对象
  if (obj instanceof Map) {
    const clonedMap = new Map()
    visited.set(obj, clonedMap)
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, visited), deepClone(value, visited))
    })
    return clonedMap as any
  }

  // 处理 Set 对象
  if (obj instanceof Set) {
    const clonedSet = new Set()
    visited.set(obj, clonedSet)
    obj.forEach(value => {
      clonedSet.add(deepClone(value, visited))
    })
    return clonedSet as any
  }

  // 处理 WeakMap 和 WeakSet（无法完全克隆，返回新的空实例）
  if (obj instanceof WeakMap) {
    const clonedWeakMap = new WeakMap()
    visited.set(obj, clonedWeakMap)
    return clonedWeakMap as any
  }

  if (obj instanceof WeakSet) {
    const clonedWeakSet = new WeakSet()
    visited.set(obj, clonedWeakSet)
    return clonedWeakSet as any
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const clonedArray: any = []
    // 将数组本身加入visited，处理循环引用
    visited.set(obj, clonedArray)
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepClone(obj[i], visited)
    }
    return clonedArray as any
  }

  // 处理 ArrayBuffer
  if (obj instanceof ArrayBuffer) {
    const clonedBuffer = obj.slice(0)
    visited.set(obj, clonedBuffer)
    return clonedBuffer as any
  }

  // 处理类型化数组（TypedArray）
  if (ArrayBuffer.isView(obj) && !(obj instanceof DataView)) {
    const TypedArrayConstructor = (obj as any).constructor
    const clonedTypedArray = new TypedArrayConstructor(obj)
    visited.set(obj, clonedTypedArray)
    return clonedTypedArray as any
  }

  // 处理 DataView
  if (obj instanceof DataView) {
    const clonedDataView = new DataView(deepClone(obj.buffer, visited))
    visited.set(obj, clonedDataView)
    return clonedDataView as any
  }

  // 处理普通对象
  if (typeof obj === 'object') {
    const clonedObj: any = {}
    // 将对象本身加入visited，处理循环引用
    visited.set(obj, clonedObj)
    
    // 复制所有可枚举属性
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key], visited)
      }
    }
    
    // 复制 Symbol 属性
    const symbolKeys = Object.getOwnPropertySymbols(obj)
    for (const symbolKey of symbolKeys) {
      const descriptor = Object.getOwnPropertyDescriptor(obj, symbolKey)
      if (descriptor && descriptor.enumerable) {
        clonedObj[symbolKey] = deepClone((obj as any)[symbolKey], visited)
      }
    }
    
    return clonedObj as any
  }

  // 其他情况直接返回
  return obj
}

export {
  deepClone,
  deepClone as default
};