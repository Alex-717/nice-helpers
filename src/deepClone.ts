/**
 * 深拷贝函数
 * @param obj 需要深拷贝的对象
 * @param visited 用于跟踪已拷贝对象的WeakMap，防止循环引用
 * @returns 深拷贝后的对象
 */
function deepClone<T>(obj: T, visited: WeakMap<any, any> = new WeakMap()): T {
  // 处理 null 或 undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // 处理基本数据类型
  if (typeof obj !== 'object') {
    return obj;
  }

  // 检查是否已拷贝过该对象（处理循环引用）
  if (visited.has(obj)) {
    return visited.get(obj) as T;
  }

  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const clonedArray: any = [];
    // 将数组本身加入visited，处理循环引用
    visited.set(obj, clonedArray);
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepClone(obj[i], visited);
    }
    return clonedArray as any;
  }

  // 处理普通对象
  if (typeof obj === 'object') {
    const clonedObj: any = {};
    // 将对象本身加入visited，处理循环引用
    visited.set(obj, clonedObj);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key], visited);
      }
    }
    return clonedObj as any;
  }

  // 其他情况直接返回
  return obj;
}

export {
  deepClone,
  deepClone as default
};