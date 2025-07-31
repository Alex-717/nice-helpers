


/**
 * 判断当前环境是否为浏览器环境
 * 通过检查 window 对象和 document 对象是否存在来判断
 * 在服务端(Node.js)环境下 window 和 document 对象都不存在
 * 在浏览器环境下这两个对象都存在
 */
export const isInBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

/**
 * 判断值是否为 true
 * @param v - 要检查的值
 * @returns 如果值严格等于 true 则返回 true，否则返回 false
 */
export function isTrue (v: any) {
  return v === true
}

/**
 * 判断值是否为 false
 * @param v - 要检查的值
 * @returns 如果值严格等于 false 则返回 true，否则返回 false
 */
export function isFalse (v: any) {
  return v === false
}

/**
 * 判断值是否为 undefined 或 null
 * @param v - 要检查的值
 * @returns 如果值是 undefined 或 null 则返回 true，否则返回 false
 */
export function isUndef (v: any): v is undefined | null {
  return v === undefined || v === null
}

/**
 * 判断值是否已定义（不为 undefined 且不为 null）
 * @param v - 要检查的值
 * @returns 如果值不为 undefined 且不为 null 则返回 true，否则返回 false
 */
export function isDef<T>(v: T): v is NonNullable<T> {
  return v !== undefined && v !== null
}

/**
 * 判断值是否为对象（不包括 null）
 * @param v - 要检查的值
 * @returns 如果值是对象且不为 null 则返回 true，否则返回 false
 */
export function isObject(v: any) {
  return typeof v === 'object' && v !== null
}

/**
 * 判断值是否为原始类型（string, number, symbol, boolean）
 * @param v - 要检查的值
 * @returns 如果值是原始类型则返回 true，否则返回 false
 */
export function isPrimitive (v: any) {
  const type = typeof v
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'symbol' ||
    type === 'boolean'
  )
}

/**
 * 判断值是否为函数
 * @param v - 要检查的值
 * @returns 如果值是函数则返回 true，否则返回 false
 */
export function isFunction (v: any): v is (...args: any[]) => any {
  return typeof v === 'function'
}

/**
 * 判断值是否为 Promise 对象
 * @param v - 要检查的值
 * @returns 如果值是 Promise 对象则返回 true，否则返回 false
 */
export function isPromise (v: any): v is Promise<any> {
  return (
    isDef(v) &&
    typeof v.then === 'function' &&
    typeof v.catch === 'function'
  )
}

/**
 * 获取值的原始类型字符串
 * @param v - 要检查的值
 * @returns 返回值的原始类型字符串，如 'string', 'number', 'object', 'array' 等
 */
export function toRawType (v: any) {
  return Object.prototype.toString.call(v).slice(8, -1).toLocaleLowerCase()
}

/**
 * 检查对象是否具有指定的自有属性
 * @param obj - 要检查的对象
 * @param key - 要检查的属性名
 * @returns 如果对象具有指定的自有属性则返回 true，否则返回 false
 */
export function hasOwnProp (obj: object | Array<any>, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * 手机号正则表达式
 * 支持中国手机号格式，包括 +86 或 0086 前缀
 */
const mobileReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/

/**
 * 判断字符串是否为有效的中国手机号
 * @param str - 要检查的字符串
 * @returns 如果字符串是有效的中国手机号则返回 true，否则返回 false
 */
export function isMobile (str: string) {
  return mobileReg.test(str)
}

/**
 * 判断字符串是否为有效的邮箱地址
 * @param str - 要检查的字符串
 * @returns 如果字符串是有效的邮箱地址则返回 true，否则返回 false
 */
export function isEmail (str: string) {
  const emailReg = /^\w+@\w+(\.\w+){1,2}$/
  return emailReg.test(str)
}

/**
 * 判断构造函数是否为原生函数
 * @param Ctor - 要检查的构造函数
 * @returns 如果构造函数是原生函数则返回 true，否则返回 false
 */
export function isNative (Ctor: any) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}