/**
 * 根据路径获取对象的值，支持嵌套对象和数组索引
 * @param obj 目标对象
 * @param path 路径字符串，支持点号分隔和数组索引，如 'a.b.c' 或 'a[0].b.c'
 * @param defaultValue 默认值，当路径不存在时返回
 * @returns 获取到的值或默认值
 * 
 * @example
 * const obj = { a: { b: { c: 'value' } } }
 * getObjVal(obj, 'a.b.c', null) // 'value'
 * 
 * const objWithArray = { a: [{ b: { c: 'arrayValue' } }] }
 * getObjVal(objWithArray, 'a[0].b.c', null) // 'arrayValue'
 */
export function getObjVal(obj: any, path: string, defaultValue: any): any {
  if (!obj || typeof path !== 'string' || path.trim() === '') {
    return defaultValue
  }

  // 处理路径，将数组索引转换为点号分隔的格式
  // 例如：'a[0].b.c' -> 'a.0.b.c'
  const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1')
  
  // 分割路径并过滤空字符串
  const keys = normalizedPath.split('.').filter(key => key !== '')
  
  // 如果没有有效的键，返回默认值
  if (keys.length === 0) {
    return defaultValue
  }
  
  let result = obj
  
  for (const key of keys) {
    // 检查当前层级是否存在且不为 null/undefined
    if (result != null && (typeof result === 'object' || typeof result === 'function')) {
      // 检查属性是否存在
      if (key in result) {
        result = result[key]
      } else {
        return defaultValue
      }
    } else {
      return defaultValue
    }
  }
  
  return result
}