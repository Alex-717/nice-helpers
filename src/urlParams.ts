

export function hasURLFunction () {
  return typeof URL === 'function'
}

export function hasLocation () {
  return typeof location === 'object'
}

export const getParam = (function () {
  if (hasURLFunction()) {
    return getParamByURL
  } else {
    return getParamByReg
  }
})();

function getParamByURL (name: string, url?: string) {
  const urlStr = url ? url : hasLocation() ? location.href : ''
  if (!urlStr) return ''
  const params = new URL(urlStr).searchParams
  const result = params.get(name)
  return result ? result : ''
}

function getParamByReg (name: string, url?: string) {
  const urlStr = url ? url : hasLocation() ? location.href : ''
  if (!urlStr) return ''
  const reg = new RegExp(`(\\?|&|#)${name}=([^&#]*)(&#)*`)
  const result = urlStr.match(reg)
  return result ? result[2] : ''
}