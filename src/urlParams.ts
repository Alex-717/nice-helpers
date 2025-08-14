

// export function hasURLFunction () {
//   return typeof URL === 'function'
// }

// export function hasLocation () {
//   return typeof location === 'object'
// }

export const hasURLFunction = typeof URL === 'function'
export const hasLocation = typeof location === 'object' && location.href

export const getParam = (function () {
  if (hasURLFunction) {
    return getParamByURL
  } else {
    return getParamByReg
  }
})();

function getParamByURL (name: string, url?: string) {
  const urlStr = url ? url : hasLocation ? location.href : ''
  if (!urlStr) return ''
  const params = new URL(urlStr).searchParams
  const result = params.get(name)
  return result ? result : ''
}

function getParamByReg (name: string, url?: string) {
  const urlStr = url ? url : hasLocation ? location.href : ''
  if (!urlStr) return ''
  const reg = new RegExp(`(\\?|&|#)${name}=([^&#]*)(&#)*`)
  const result = urlStr.match(reg)
  return result ? result[2] : ''
}

export const setParam = (function () {
  if (hasURLFunction) {
    return setParamByURL
  } else {
    return setParamByReg
  }
})();
function setParamByURL (name: string, val: string, url?: string) {
  const urlStr = url ? url : hasLocation ? location.href : ''
  if (!urlStr) return false
  const urlObj = new URL(urlStr)
  const params = urlObj.searchParams
  params.set(name, val)
  return urlObj.toString()
}

// 已有参数就更新，没有则添加
function setParamByReg (name: string, val: string, url?: string) {
  const urlStr = url ? url : hasLocation ? location.href : ''
  if (!urlStr) return false
  const reg = new RegExp(`(\\?|&)${name}=.*?(&|#|$)`)
  if (urlStr.match(reg)) {
    return urlStr.replace(reg, "$1" + name + "=" + val + "$2")
  }
  const array = urlStr.split('#')
  array[0] = `${array[0]}${array[0].indexOf('?') > -1 ? '&' : '?'}${name}=${val}`
  return array.join('#')
}