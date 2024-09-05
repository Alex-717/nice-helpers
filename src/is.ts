
// export function isInBrowser () {
//   return typeof window !== 'undefined' && typeof window.document !== 'undefined'
// }

export const isInBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

export function isTrue (v: any) {
  return v === true
}

export function isFalse (v: any) {
  return v === false
}

export function isUndef (v: any): v is undefined | null {
  return v === undefined || v === null
}

export function isDef<T>(v: T): v is NonNullable<T> {
  return v !== undefined && v !== null
}

export function isObject(v: any) {
  return typeof v === 'object' && v !== null
}

export function isPrimitive (v: any) {
  const type = typeof v
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'symbol' ||
    type === 'boolean'
  )
}

export function isFunction (v: any): v is (...args: any[]) => any {
  return typeof v === 'function'
}

export function isPromise (v: any): v is Promise<any> {
  return (
    isDef(v) &&
    typeof v.then === 'function' &&
    typeof v.catch === 'function'
  )
}

export function toRawType (v: any) {
  return Object.prototype.toString.call(v).slice(8, -1).toLocaleLowerCase()
}

export function hasOwnProp (obj: object | Array<any>, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

const mobileReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
export function isMobile (str: string) {
  return mobileReg.test(str)
}

export function isEmail (str: string) {
  const emailReg = /^\w+@\w+(\.\w+){1,2}$/
  return emailReg.test(str)
}

export function isNative (Ctor: any) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}