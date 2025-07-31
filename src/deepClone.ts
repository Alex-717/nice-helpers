/**
 * 深拷贝函数
 * @param obj 需要深拷贝的对象
 * @returns 深拷贝后的对象
 */
function deepClone<T>(obj: T): T {
  // 处理 null 或 undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // 处理基本数据类型
  if (typeof obj !== 'object') {
    return obj;
  }

  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const clonedArray: any = [];
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepClone(obj[i]);
    }
    return clonedArray as any;
  }

  // 处理普通对象
  if (typeof obj === 'object') {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
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