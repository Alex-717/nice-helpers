function getParameterByReg(name, url) {
  const urlStr = url
  if (!urlStr) return "";
  const reg = new RegExp(`(\\?|&|#)${name}=([^&#]*)(&#)*`)
  var result = urlStr.match(reg);
  console.log(result)
  return result ? result[2] : "";
}

console.log(getParameterByReg('b', 'https://www.baidu.com?a=1&b=2'))